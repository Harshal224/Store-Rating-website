import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getAllStores, submitRating, updateRating } from '../controllers/userController.js';

const router = express.Router();

// Get all stores
router.get('/', authenticate, getAllStores);

// Submit a new rating
router.post('/:storeId/rate', authenticate, submitRating);

// Update an existing rating
router.put('/:storeId/rate', authenticate, updateRating);

export default router;
