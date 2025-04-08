const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAssistantResponse } = require('../controllers/assistantController');

router.post('/', authenticateToken, getAssistantResponse);

module.exports = router;