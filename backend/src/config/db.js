const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./life_management.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table ready');
    });
};

createTables();

module.exports = { db };