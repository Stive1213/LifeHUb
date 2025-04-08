const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getCommunities } = require('../controllers/communityController');

router.get('/', authenticateToken, getCommunities);

module.exports = router;