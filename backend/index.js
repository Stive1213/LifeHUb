const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./life_management.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`, (err) => {
  if (err) console.error('Error creating users table:', err);
  else console.log('Users table ready');
});
// Tasks table
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      deadline TEXT,
      category TEXT,
      subtasks TEXT, -- Store as JSON string
      isDone INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating tasks table:', err);
    else console.log('Tasks table ready');
  });
  
  // Goals table
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      target TEXT,
      deadline TEXT,
      progress INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating goals table:', err);
    else console.log('Goals table ready');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating transactions table:', err);
    else console.log('Transactions table ready');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      inviteLink TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating events table:', err);
    else console.log('Events table ready');
  });

  const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"
    if (!token) return res.status(401).json({ error: 'No token provided' });
  
    jwt.verify(token, 'your-secret-key', (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user; // Attach user info (id, email) to request
      next();
    });
  };
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/api/auth/signup', async (req, res) => {
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
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', {
      expiresIn: '1h',
    });
    res.json({ token });
  });
});
// Get all tasks for the logged-in user
app.get('/api/tasks', authenticateToken, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      // Parse subtasks from JSON string
      const tasks = rows.map((task) => ({
        ...task,
        subtasks: JSON.parse(task.subtasks || '[]'),
        isDone: !!task.isDone,
      }));
      res.json(tasks);
    });
  });
  
  // Add a new task
  app.post('/api/tasks', authenticateToken, (req, res) => {
    const { title, deadline, category, subtasks } = req.body;
    const subtasksJson = JSON.stringify(subtasks || []);
    db.run(
      'INSERT INTO tasks (user_id, title, deadline, category, subtasks, isDone) VALUES (?, ?, ?, ?, ?, 0)',
      [req.user.id, title, deadline, category, subtasksJson],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, deadline, category, subtasks, isDone: false });
      }
    );
  });
  
  // Update task status
  app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    const { isDone } = req.body;
    db.run(
      'UPDATE tasks SET isDone = ? WHERE id = ? AND user_id = ?',
      [isDone ? 1 : 0, req.params.id, req.user.id],
      function (err) {
        if (err || this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task updated' });
      }
    );
  });
  // Get all goals for the logged-in user
app.get('/api/goals', authenticateToken, (req, res) => {
    db.all('SELECT * FROM goals WHERE user_id = ?', [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  
  // Add a new goal
  app.post('/api/goals', authenticateToken, (req, res) => {
    const { title, target, deadline, progress } = req.body;
    db.run(
      'INSERT INTO goals (user_id, title, target, deadline, progress) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, target, deadline, progress || 0],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, target, deadline, progress: progress || 0 });
      }
    );
  });
  
  // Update a goal
  app.put('/api/goals/:id', authenticateToken, (req, res) => {
    const { title, target, deadline, progress } = req.body;
    db.run(
      'UPDATE goals SET title = ?, target = ?, deadline = ?, progress = ? WHERE id = ? AND user_id = ?',
      [title, target, deadline, progress, req.params.id, req.user.id],
      function (err) {
        if (err || this.changes === 0) return res.status(404).json({ error: 'Goal not found' });
        res.json({ message: 'Goal updated' });
      }
    );
  });
  
// Get all transactions for the logged-in user
app.get('/api/transactions', authenticateToken, (req, res) => {
    db.all('SELECT * FROM transactions WHERE user_id = ?', [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  
  // Add a new transaction
  app.post('/api/transactions', authenticateToken, (req, res) => {
    const { type, amount, category, date, description } = req.body;
    db.run(
      'INSERT INTO transactions (user_id, type, amount, category, date, description) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, type, amount, category, date, description || ''],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, type, amount, category, date, description: description || '' });
      }
    );
  });

  // Get all events for the logged-in user
app.get('/api/events', authenticateToken, (req, res) => {
    db.all('SELECT * FROM events WHERE user_id = ?', [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  
  // Add a new event
  app.post('/api/events', authenticateToken, (req, res) => {
    const { title, date, time, inviteLink } = req.body;
    db.run(
      'INSERT INTO events (user_id, title, date, time, inviteLink) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, date, time, inviteLink || ''],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, date, time, inviteLink: inviteLink || '' });
      }
    );
  });
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});