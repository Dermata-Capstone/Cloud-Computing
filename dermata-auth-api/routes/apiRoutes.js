const express = require('express');
const { register, login } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST route example
router.post('/login', authMiddleware, (req, res) => {
    // Your login logic here
    res.send('Login route');
  });

module.exports = router;