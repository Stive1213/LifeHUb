const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register a new user
const signup = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the email already exists
  const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
  db.get(checkEmailSql, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Insert the new user into the database
      const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.run(insertSql, [email, hashedPassword], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: this.lastID, email }, process.env.JWT_SECRET, {
          expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(201).json({ message: 'User registered successfully', token });
      });
    });
  });
};

// Log in an existing user
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the user exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ message: 'Login successful', token });
    });
  });
};

module.exports = { signup, login };