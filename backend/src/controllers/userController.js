import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================
// Update Password
// ============================
export const updatePassword = async (req, res) => {
  try {
    const userId = Number(req.user?.userId || req.user?.id); // ✅ support both
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both fields are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password', error: err.message });
  }
};

// ============================
// Get All Stores with Ratings
// ============================
export const getAllStores = async (req, res) => {
  try {
    const userId = Number(req.user?.userId || req.user?.id); // ✅ ensure number
    const search = req.query.search || '';

    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { address: { contains: search } }
        ]
      },
      include: {
        ratings: {
          include: {
            user: true, // include user info for each rating
          }
        },
      },
    });

    const formattedStores = stores.map((store) => {
      // find rating from the logged-in user
      const userRatingObj = store.ratings.find(
        (r) => Number(r.userId) === userId
      );

      // calculate average rating
      const averageRating =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
          : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating,
        userRating: userRatingObj?.value || null,
        ratings: store.ratings.map(r => ({
          value: r.value,
          user: { id: r.user.id, name: r.user.name }
        }))
      };
    });

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error('🔥 getAllStores error:', error);
    res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
  }
};

// ============================
// Submit New Rating
// ============================
export const submitRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body; // numeric rating
  const userId = Number(req.user?.userId || req.user?.id); // ✅ fix

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Check if the store exists
    const store = await prisma.store.findUnique({
      where: { id: parseInt(storeId) },
    });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if the user already rated this store
    const existing = await prisma.rating.findFirst({
      where: { userId, storeId: parseInt(storeId) },
    });

    if (existing) {
      return res.status(400).json({ message: 'You already rated this store. Use PUT to update.' });
    }

    // Create the rating
    const newRating = await prisma.rating.create({
      data: {
        value: rating,
        userId,
        storeId: parseInt(storeId),
      },
      include: {
        user: true, // get user data
      },
    });

    res.status(201).json({
      message: 'Rating submitted',
      rating: {
        id: newRating.id,
        value: newRating.value,
        storeId: newRating.storeId,
        user: { id: newRating.user.id, name: newRating.user.name },
      },
    });
  } catch (error) {
    console.error('🔥 submitRating error:', error);
    res.status(500).json({ message: 'Failed to submit rating', error: error.message });
  }
};

// ============================
// Update Existing Rating
// ============================
export const updateRating = async (req, res) => {
  const { storeId } = req.params;
  const { value } = req.body;
  const userId = Number(req.user?.userId || req.user?.id); // ✅ fix

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const rating = await prisma.rating.updateMany({
      where: { userId, storeId: parseInt(storeId) },
      data: { value },
    });

    if (rating.count === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update rating', error: error.message });
  }
};
