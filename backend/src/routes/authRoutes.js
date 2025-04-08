const express = require('express');
const { signup, login, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', authenticateToken, getUserProfile);
router.put('/user', authenticateToken, updateUserProfile);

module.exports = router;