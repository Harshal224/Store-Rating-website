// controllers/adminController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

// ==========================
// Dashboard stats
// ==========================
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
};

// ==========================
// Create user (any role)
// ==========================
export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role: role.toUpperCase()
      }
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

// ==========================
// Create store
// ==========================
export const createStoreByAdmin = async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;
    if (!name || !address || !ownerId) {
      return res.status(400).json({ message: 'Name, address, and ownerId are required' });
    }

    const owner = await prisma.user.findUnique({ where: { id: Number(ownerId) } });
    if (!owner || owner.role !== 'OWNER') {
      return res.status(400).json({ message: 'Invalid store owner' });
    }

    const store = await prisma.store.create({
      data: {
        name,
        address,
        ownerId: Number(ownerId)
      }
    });

    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create store', error: error.message });
  }
};

// ==========================
// Get stores list with filters
// ==========================
export const getStoresList = async (req, res) => {
  try {
    const { name, address } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          address ? { address: { contains: address } } : {}
        ]
      },
      include: {
        owner: true,
        ratings: true
      }
    });

    const formatted = stores.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      ownerEmail: store.owner.email,
      averageRating: store.ratings.length
        ? store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length
        : null
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
  }
};

// ==========================
// Get users list with filters
// ==========================
export const getUsersList = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          email ? { email: { contains: email } } : {},
          address ? { address: { contains: address } } : {},
          role ? { role: role.toUpperCase() } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// ==========================
// Get user details
// ==========================
export const getUserDetails = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ratings: {
          include: { store: true }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const details = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ratings: user.role === 'OWNER'
        ? user.ratings.map(r => ({
            storeName: r.store.name,
            value: r.value
          }))
        : []
    };

    res.json(details);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
  }
};
