const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Created uploads directory');
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const signup = async (req, res) => {
  console.log('Signup request body:', req.body);
  console.log('Signup request file:', req.file);

  const { username, firstName, lastName, age, email, password } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!username || !firstName || !lastName || !age || !email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'All fields except profile image are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    db.run(
      'INSERT INTO users (username, first_name, last_name, profile_image, age, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, firstName, lastName, profileImage, age, email, hashedPassword],
      function (err) {
        if (err) {
          console.error('Database error during signup:', err.message);
          return res.status(400).json({ error: 'Username or email already exists: ' + err.message });
        }
        console.log('User inserted with ID:', this.lastID);
        res.status(201).json({ message: 'Signup successful' });
      }
    );
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

const login = async (req, res) => {
  console.log('Login request body:', req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    return res.status(500).json({ error: 'Server configuration error: JWT_SECRET missing' });
  }

  try {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        console.error('Database error during login:', err.message);
        return res.status(500).json({ error: 'Server error: ' + err.message });
      }
      if (!user) {
        console.log('User not found:', username);
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        console.log('Password mismatch for user:', username);
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful, token generated for:', username);
      res.json({ token });
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

const signupWithUpload = [
  upload.single('profileImage'),
  (req, res, next) => {
    if (req.fileValidationError) {
      console.error('File upload error:', req.fileValidationError);
      return res.status(400).json({ error: 'Invalid file upload' });
    }
    next();
  },
  signup,
];

module.exports = { signup: signupWithUpload, login };