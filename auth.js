const express = require('express');
const router = express.Router();
const User = require('./User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/register', async (req, res) => {
  console.log("Trying to register")
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("Registration Error: ", error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  console.log("Trying to login")
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate access token
    const accessToken = generateAccessToken(user.toJSON())

    // Generate refresh token
    const refreshToken = generateRefreshToken(user.toJSON())

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log("Login Error: ", error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
router.post('/refresh-token', (req, res) => {
  console.log("Trying to get Refresh-token")
  try {
    const { refreshToken } = req.body;

    // Check if refresh token is valid
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new access token
      const accessToken = generateAccessToken(user);

      res.json({ accessToken });
    });
  } catch (error) {
    console.log("Refresh-token error:", error)
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/', async (req, res) => {
    res.send("Hello World!!!!")
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;