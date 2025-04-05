const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db'); // Changed from '../index'

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) return res.status(400).json({ error: 'Email already exists' });
        res.status(201).json({ message: 'Signup successful' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
  });
};

module.exports = { signup, login };