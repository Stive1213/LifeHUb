const { db } = require('../config/db');

const getEvents = (req, res) => {
  db.all('SELECT * FROM events WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const createEvent = (req, res) => {
  const { title, date, time, inviteLink } = req.body;
  if (!title || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields (title, date, time)' });
  }

  db.run(
    'INSERT INTO events (user_id, title, date, time, inviteLink) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, title, date, time, inviteLink || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // Add points for event creation (e.g., 10 points)
      db.run('UPDATE user_points SET points = points + 10 WHERE user_id = ?', [req.user.id]);
      res.status(201).json({
        id: this.lastID,
        title,
        date,
        time,
        inviteLink: inviteLink || '',
      });
    }
  );
};

module.exports = { getEvents, createEvent };