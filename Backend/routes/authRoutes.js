const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Test route to ensure the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

// Temporary route to insert a test user
router.post('/test-user', (req, res) => {
  const email = 'test@example.com';
  const password = 'testpassword'; // We'll hash this later
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.run(sql, [email, password], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Test user inserted', id: this.lastID });
  });
});

// Temporary route to get all users
router.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

module.exports = router;