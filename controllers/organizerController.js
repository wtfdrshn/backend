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
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('Received OTP request for:', email);

    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Generated OTP:', otp); // Debug log

    // Save OTP to organizer document
    organizer.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    
    await organizer.save();
    console.log('OTP saved to database');

    // Send OTP email
    try {
      const emailSent = await sendOTP(email, otp);
      console.log('Email sending result:', emailSent);
      
      if (!emailSent) {
        return res.status(500).json({ message: 'Failed to send OTP email' });
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send OTP email',
        error: emailError.message 
      });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('SendLoginOTP error:', error);
    res.status(500).json({ 
      message: 'Server error while processing OTP',
      error: error.message 
    });
  }
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

// Add new controller function
const verifyCredentials = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await organizer.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Credentials verified' });
  } catch (error) {
    console.error('Verify credentials error:', error);
    res.status(500).json({ 
      message: 'Server error while verifying credentials',
      error: error.message 
    });
  }
});

module.exports = {
  registerOrganizer,
  verifyCredentials,
  sendLoginOTP,
  loginOrganizer,
  getOrganizerProfile,
}; 