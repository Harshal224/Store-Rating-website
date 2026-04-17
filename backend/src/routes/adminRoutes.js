// routes/adminRoutes.js
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';
import {
  getAdminDashboard,
  createUserByAdmin,
  createStoreByAdmin,
  getStoresList,
  getUsersList,
  getUserDetails
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require admin
router.use(authenticate, authorizeAdmin);

router.get('/dashboard', getAdminDashboard);
router.post('/users', createUserByAdmin);
router.post('/stores', createStoreByAdmin);
router.get('/stores', getStoresList);
router.get('/users', getUsersList);
router.get('/users/:id', getUserDetails);

export default router;
