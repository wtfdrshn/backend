const asyncHandler = require('express-async-handler');
const Organizer = require('../models/organizerModel.js');
const { generateToken } = require('../utils/jwtUtils.js');
const { sendOTP } = require('../utils/emailUtils.js');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register organizer
// @route   POST /api/organizers/register
// @access  Public
const registerOrganizer = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const organizerExists = await Organizer.findOne({ email });
  if (organizerExists) {
    res.status(400);
    throw new Error('Organizer already exists');
  }

  const organizer = await Organizer.create({
    name,
    email,
    password,
  });

  if (organizer) {
    res.status(201).json({
      _id: organizer._id,
      name: organizer.name,
      email: organizer.email,
      token: generateToken(organizer._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid organizer data');
  }
});

// @desc    Send OTP for login
// @route   POST /api/organizers/send-otp
// @access  Public
const sendLoginOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log('Received OTP request for:', email);

  const organizer = await Organizer.findOne({ email });
  if (!organizer) {
    res.status(404);
    throw new Error('Organizer not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  console.log('Generated OTP:', otp); // Debug log

  // Save OTP to organizer document
  organizer.otp = {
    code: otp,
    expiresAt: otpExpiry
  };
  
  try {
    await organizer.save();
    console.log('OTP saved to database'); // Debug log
  } catch (error) {
    console.error('Error saving OTP:', error);
    res.status(500);
    throw new Error('Failed to save OTP');
  }

  // Send OTP email
  try {
    const emailSent = await sendOTP(email, otp);
    console.log('Email sending result:', emailSent); // Debug log
    
    if (!emailSent) {
      res.status(500);
      throw new Error('Failed to send OTP email');
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500);
    throw new Error('Failed to send OTP email');
  }

  res.json({ message: 'OTP sent successfully' });
});

const loginOrganizer = asyncHandler(async (req, res) => {
  const { email, password, otp } = req.body;

  console.log('Login attempt:', { email, password: '***', otp }); // Debug log

  // Validate required fields
  if (!email || !password || !otp) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const organizer = await Organizer.findOne({ email });

  if (!organizer) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await organizer.matchPassword(password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Verify OTP exists
  if (!organizer.otp || !organizer.otp.code) {
    res.status(401);
    throw new Error('No OTP found. Please request a new OTP');
  }

  // Ensure both OTPs are strings and trim whitespace
  const storedOTP = String(organizer.otp.code).trim();
  const receivedOTP = String(otp).trim();

  console.log('OTP comparison:', {
    stored: storedOTP,
    received: receivedOTP,
    matches: storedOTP === receivedOTP
  });

  // Check if OTP matches
  if (storedOTP !== receivedOTP) {
    res.status(401);
    throw new Error('Invalid OTP');
  }

  // Check if OTP has expired
  if (new Date() > new Date(organizer.otp.expiresAt)) {
    res.status(401);
    throw new Error('OTP has expired');
  }

  // Clear OTP after successful verification
  organizer.otp = undefined;
  await organizer.save();

  res.json({
    _id: organizer._id,
    name: organizer.name,
    email: organizer.email,
    token: generateToken(organizer._id),
  });
});

// @desc    Get organizer profile
// @route   GET /api/organizers/profile
// @access  Private
const getOrganizerProfile = asyncHandler(async (req, res) => {
  const organizer = await Organizer.findById(req.user._id);

  if (organizer) {
    res.json({
      _id: organizer._id,
      name: organizer.name,
      email: organizer.email,
    });
  } else {
    res.status(404);
    throw new Error('Organizer not found');
  }
});

module.exports = {
  registerOrganizer,
  sendLoginOTP,
  loginOrganizer,
  getOrganizerProfile,
}; 