const { db } = require('../config/db');

const getUserPoints = (req, res) => {
  const userId = req.user.id;
  db.get(
    'SELECT COALESCE(points, 0) as totalPoints FROM user_points WHERE user_id = ?',
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
      res.json({ totalPoints: row ? row.totalPoints : 0 });
    }
  );
};

const getRecentEarnings = (req, res) => {
  const userId = req.user.id;
  // Mocking some earnings data (replace with actual logic based on your app)
  db.all(
    `SELECT id, description, points, date(timestamp) as date 
     FROM point_earnings 
     WHERE user_id = ? 
     ORDER BY timestamp DESC 
     LIMIT 10`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
      res.json(rows || []);
    }
  );
};

const getBadges = (req, res) => {
  const userId = req.user.id;
  // Mocking badges (replace with actual badge logic)
  db.all(
    `SELECT id, name, icon 
     FROM badges 
     WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
      res.json(rows || []);
    }
  );
};

const getLeaderboard = (req, res) => {
  const userId = req.user.id;
  const { optIn } = req.query; // Boolean to include user in leaderboard

  if (optIn === 'true') {
    db.all(
      `SELECT u.id, u.username as name, COALESCE(up.points, 0) as points 
       FROM users u 
       LEFT JOIN user_points up ON u.id = up.user_id 
       ORDER BY points DESC 
       LIMIT 10`,
      (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
        res.json(rows.map(row => ({
          id: row.id.toString(),
          name: row.id === userId ? 'You' : row.name,
          points: row.points,
        })));
      }
    );
  } else {
    db.all(
      `SELECT u.id, u.username as name, COALESCE(up.points, 0) as points 
       FROM users u 
       LEFT JOIN user_points up ON u.id = up.user_id 
       WHERE u.id != ? 
       ORDER BY points DESC 
       LIMIT 10`,
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
        res.json(rows);
      }
    );
  }
};

const updateLeaderboardOptIn = (req, res) => {
  const userId = req.user.id;
  const { optIn } = req.body;

  // For simplicity, we'll assume opt-in is stored in user_points (add a column if needed)
  db.run(
    'UPDATE user_points SET opt_in_leaderboard = ? WHERE user_id = ?',
    [optIn ? 1 : 0, userId],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
      res.json({ message: 'Leaderboard opt-in updated' });
    }
  );
};

module.exports = { getUserPoints, getRecentEarnings, getBadges, getLeaderboard, updateLeaderboardOptIn };