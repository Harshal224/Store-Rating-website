import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;


export const register = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({ message: 'All fields including role are required' });
    }

    // Normalize role to uppercase for consistency
    const normalizedRole = role.toUpperCase();

    // Allowed roles for self-registration (public)
    const allowedPublicRoles = ['USER', 'OWNER'];
    // All allowed roles in system
    const allowedRoles = ['USER', 'OWNER', 'ADMIN'];

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Block admin registration unless requester is admin (if you have req.user from auth middleware)
    if (normalizedRole === 'ADMIN' && (!req.user || req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Only admins can create admin accounts' });
    }

    // If you want to restrict self-registration only to public roles (USER, OWNER):
    if (!allowedPublicRoles.includes(normalizedRole) && (!req.user || req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'You are not authorized to register with this role' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prisma expects role as enum, so just pass the string uppercase matching enum values
    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role: normalizedRole, // Role enum string
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


// ======================== LOGIN ========================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('Login attempt for:', email, 'with role:', role);

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Normalize role for comparison
    const normalizedRole = role.toUpperCase();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== normalizedRole) {
      console.log('Role mismatch');
      return res.status(403).json({ message: 'Role mismatch' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for:', user.email, 'as', user.role);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
