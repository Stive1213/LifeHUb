const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./life_management.db', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database');
});

const createTables = () => {
  // Users table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      profile_image TEXT DEFAULT 'https://via.placeholder.com/40',
      age INTEGER NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else console.log('Users table ready');
    });

  // User Points table (includes opt_in_leaderboard from the start)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_points (
      user_id INTEGER PRIMARY KEY,
      points INTEGER DEFAULT 0,
      opt_in_leaderboard INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating user_points table:', err.message);
      else console.log('User_points table ready');
    });

  // Point Earnings table (new for recent earnings)
  db.run(`
    CREATE TABLE IF NOT EXISTS point_earnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      points INTEGER NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating point_earnings table:', err.message);
      else console.log('Point_earnings table ready');
    });

  // Badges table (new for badge gallery)
  db.run(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating badges table:', err.message);
      else console.log('Badges table ready');
    });

  // Tasks table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      deadline TEXT,
      category TEXT,
      subtasks TEXT,
      isDone INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating tasks table:', err.message);
      else console.log('Tasks table ready');
    });

  // Goals table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      target TEXT,
      deadline TEXT,
      progress INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating goals table:', err.message);
      else console.log('Goals table ready');
    });

  // Transactions table (unchanged)
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
    )`, (err) => {
      if (err) console.error('Error creating transactions table:', err.message);
      else console.log('Transactions table ready');
    });

  // Events table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      inviteLink TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating events table:', err.message);
      else console.log('Events table ready');
    });

  // Habits table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      frequency TEXT NOT NULL,
      streak INTEGER DEFAULT 0,
      completionHistory TEXT DEFAULT '[]',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating habits table:', err.message);
      else console.log('Habits table ready');
    });

  // Journal Entries table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT NOT NULL,
      text TEXT NOT NULL,
      mood TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating journal_entries table:', err.message);
      else console.log('Journal_entries table ready');
    });

  // Communities table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS communities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      admin_only_post INTEGER DEFAULT 0,
      created_by INTEGER,
      subscribers INTEGER DEFAULT 0,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating communities table:', err.message);
      else console.log('Communities table ready');
    });

  // Subscriptions table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      community_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (community_id) REFERENCES communities(id),
      UNIQUE (user_id, community_id)
    )`, (err) => {
      if (err) console.error('Error creating subscriptions table:', err.message);
      else console.log('Subscriptions table ready');
    });

  // Posts table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      community_id INTEGER,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      media TEXT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      flagged INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (community_id) REFERENCES communities(id)
    )`, (err) => {
      if (err) console.error('Error creating posts table:', err.message);
      else console.log('Posts table ready');
    });

  // Comments table (unchanged)
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      post_id INTEGER,
      content TEXT NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
    )`, (err) => {
      if (err) console.error('Error creating comments table:', err.message);
      else console.log('Comments table ready');
    });

  // Ensure opt_in_leaderboard exists for existing tables
  db.run(`
    ALTER TABLE user_points ADD COLUMN opt_in_leaderboard INTEGER DEFAULT 1
  `, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding opt_in_leaderboard column:', err.message);
    } else {
      console.log('opt_in_leaderboard column added or already exists');
    }
  });

  // Initial data setup
  db.serialize(() => {
    db.run('DELETE FROM communities'); // Remove in production
    db.run(
      'INSERT OR IGNORE INTO communities (id, name, description, admin_only_post, created_by) VALUES (?, ?, ?, ?, ?)',
      [1, 'LifeHub Tips', 'Tips and tricks for using LifeHub.', 1, 1]
    );
    db.run(
      'INSERT OR IGNORE INTO communities (id, name, description, admin_only_post, created_by) VALUES (?, ?, ?, ?, ?)',
      [2, 'Job Finder', 'Post hiring opportunities or job-seeking offers.', 0, 1]
    );

    // Ensure initial points entry for existing users
    db.run(`
      INSERT OR IGNORE INTO user_points (user_id, points, opt_in_leaderboard) 
      SELECT id, 0, 1 FROM users WHERE NOT EXISTS (SELECT 1 FROM user_points WHERE user_points.user_id = users.id)
    `);
  });
};

createTables();

module.exports = { db };