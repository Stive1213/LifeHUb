const { db } = require('../config/db');

const getTransactions = (req, res) => {
  db.all('SELECT * FROM transactions WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const createTransaction = (req, res) => {
  const { type, amount, category, date, description } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO transactions (user_id, type, amount, category, date, description) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, type, amount, category, date, description || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // Add points for transaction logging (e.g., 5 points)
      db.run('UPDATE user_points SET points = points + 5 WHERE user_id = ?', [req.user.id]);
      res.status(201).json({
        id: this.lastID,
        type,
        amount,
        category,
        date,
        description: description || '',
      });
    }
  );
};

module.exports = { getTransactions, createTransaction };