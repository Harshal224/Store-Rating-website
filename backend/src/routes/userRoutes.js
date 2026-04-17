import express from 'express'; 
import { authenticate } from '../middleware/authMiddleware.js';
import { updatePassword } from '../controllers/userController.js';
import { getAllStores } from '../controllers/userController.js';
import { submitRating, updateRating } from '../controllers/userController.js';



const router = express.Router(); 

router.put('/update-password', authenticate, updatePassword);
router.get('/stores', authenticate, getAllStores);

router.post('/rate/:storeId', authenticate, submitRating);
router.put('/rate/:storeId', authenticate, updateRating);


export default router; 
