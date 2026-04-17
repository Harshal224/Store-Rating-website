import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Password update route
router.put('/update-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Owner dashboard route
router.get('/dashboard', async (req, res) => {
  if (req.user.role !== 'OWNER') {
    return res.status(403).json({ message: 'Forbidden: Owners only' });
  }

  try {
    const store = await prisma.store.findFirst({
      where: { ownerId: req.user.userId },
      include: {
        ratings: {
          include: { user: true },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const averageRating = store.ratings.length
      ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
      : 0;

    const usersWhoRated = store.ratings.map(r => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      rating: r.value,
    }));

    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating,
        usersWhoRated,
      },
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
