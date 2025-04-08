const { db } = require('../config/db');

const getHabits = (req, res) => {
  db.all('SELECT * FROM habits WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const habits = rows.map((habit) => ({
      ...habit,
      completionHistory: JSON.parse(habit.completionHistory || '[]'),
    }));
    res.json(habits);
  });
};

const createHabit = (req, res) => {
  const { name, frequency } = req.body;
  if (!name || !frequency) {
    return res.status(400).json({ error: 'Missing required fields (name, frequency)' });
  }

  const completionHistory = JSON.stringify([]);
  db.run(
    'INSERT INTO habits (user_id, name, frequency, streak, completionHistory) VALUES (?, ?, ?, 0, ?)',
    [req.user.id, name, frequency, completionHistory],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // Add points for habit creation (e.g., 10 points)
      db.run('UPDATE user_points SET points = points + 10 WHERE user_id = ?', [req.user.id]);
      res.status(201).json({
        id: this.lastID,
        name,
        frequency,
        streak: 0,
        completionHistory: [],
      });
    }
  );
};

const updateHabit = (req, res) => {
  const { streak, completionHistory } = req.body;
  if (streak === undefined || !completionHistory) {
    return res.status(400).json({ error: 'Missing required fields (streak, completionHistory)' });
  }

  const completionHistoryJson = JSON.stringify(completionHistory);
  db.run(
    'UPDATE habits SET streak = ?, completionHistory = ? WHERE id = ? AND user_id = ?',
    [streak, completionHistoryJson, req.params.id, req.user.id],
    function (err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Habit not found' });
      // Add points for habit update (e.g., 5 points per streak increment)
      if (streak > 0) {
        db.run('UPDATE user_points SET points = points + 5 WHERE user_id = ?', [req.user.id]);
      }
      res.json({ message: 'Habit updated' });
    }
  );
};

module.exports = { getHabits, createHabit, updateHabit };