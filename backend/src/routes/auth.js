const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password, phone, email } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username & password required" });

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashed, phone, email });
    
    // Don't return password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: "Registered", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid login" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid login" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Don't return password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
