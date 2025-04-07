const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./life_management.db', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database');
});

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      profile_image TEXT,
      age INTEGER NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else console.log('Users table ready');
    });
};

createTables();

module.exports = { db };   