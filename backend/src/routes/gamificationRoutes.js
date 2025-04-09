const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUserPoints, getRecentEarnings, getBadges, getLeaderboard, updateLeaderboardOptIn } = require('../controllers/gamificationController');

router.get('/points', authenticateToken, getUserPoints);
router.get('/earnings', authenticateToken, getRecentEarnings);
router.get('/badges', authenticateToken, getBadges);
router.get('/leaderboard', authenticateToken, getLeaderboard);
router.put('/leaderboard/opt-in', authenticateToken, updateLeaderboardOptIn);

module.exports = router;