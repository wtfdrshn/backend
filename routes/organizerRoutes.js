import express from 'express';
const router = new express.Router();
import organizerController from '../controllers/organizerController.js';
import protect from '../middleware/authMiddleware.js';

router.post('/register', organizerController.registerOrganizer);
router.post('/send-otp', organizerController.sendLoginOTP);
router.post('/login', organizerController.loginOrganizer);
router.get('/profile', protect, organizerController.getOrganizerProfile);
router.post('/verify-credentials', organizerController.verifyCredentials);

export default router; 