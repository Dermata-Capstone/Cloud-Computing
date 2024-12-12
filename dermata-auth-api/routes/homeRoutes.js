// homeRoutes.js
const express = require('express');
const router = express.Router();
const { homePage } = require('../controllers/homeController');  // Pastikan path ini benar

// Definisikan route yang benar
router.get('/home/:username', homePage);  // /home/:username

module.exports = router;
