import express from 'express';
const router = new express.Router();

import userController from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', protect, userController.getUserProfile);

export default router; 