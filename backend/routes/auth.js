const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  // Check if user exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: 'Email already used' });
  }
  
  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  
  const token = signToken(user);
  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  
  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

module.exports = router;
