const express = require('express');
const router = express.Router();
const {
  registerOrganizer,
  sendLoginOTP,
  loginOrganizer,
  getOrganizerProfile,
} = require('../controllers/organizerController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', registerOrganizer);
router.post('/send-otp', sendLoginOTP);
router.post('/login', loginOrganizer);
router.get('/profile', protect, getOrganizerProfile);

module.exports = router; 