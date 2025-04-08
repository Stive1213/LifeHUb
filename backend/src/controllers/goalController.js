const { db } = require('../config/db');

const getGoals = (req, res) => {
  db.all('SELECT * FROM goals WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const createGoal = (req, res) => {
  const { title, target, deadline, progress } = req.body;
  db.run(
    'INSERT INTO goals (user_id, title, target, deadline, progress) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, title, target, deadline, progress || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run('UPDATE user_points SET points = points + 15 WHERE user_id = ?', [req.user.id]);
      res.status(201).json({ id: this.lastID, title, target, deadline, progress: progress || 0 });
    }
  );
};

const updateGoal = (req, res) => {
  const { title, target, deadline, progress } = req.body;
  db.run(
    'UPDATE goals SET title = ?, target = ?, deadline = ?, progress = ? WHERE id = ? AND user_id = ?',
    [title, target, deadline, progress, req.params.id, req.user.id],
    function (err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Goal not found' });
      res.json({ message: 'Goal updated' });
    }
  );
};

module.exports = { getGoals, createGoal, updateGoal };