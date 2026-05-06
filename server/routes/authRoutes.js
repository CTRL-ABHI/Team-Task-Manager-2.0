import express from 'express';
import { registerUser, loginUser, getUserProfile, getAllUsers, updateUserProfile, updateUserRole, deleteUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, getAllUsers);
router.put('/users/:id', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
