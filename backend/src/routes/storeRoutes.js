import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all stores with average rating and user's rating
router.get('/', authenticate, async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        ratings: true
      }
    });

    const storeData = stores.map(store => {
      const allRatings = store.ratings.map(r => r.value);
      const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 'No ratings';
      const userRating = store.ratings.find(r => r.userId === req.user.userId)?.value || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: avgRating,
        userRating
      };
    });

    res.json(storeData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
  }
});

// Submit or update rating
router.post('/:storeId/rate', authenticate, async (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const { value } = req.body;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const existing = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: req.user.userId,
          storeId
        }
      }
    });

    if (existing) {
      await prisma.rating.update({
        where: {
          userId_storeId: {
            userId: req.user.userId,
            storeId
          }
        },
        data: { value }
      });
    } else {
      await prisma.rating.create({
        data: {
          userId: req.user.userId,
          storeId,
          value
        }
      });
    }

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit rating', error: error.message });
  }
});

export default router;
