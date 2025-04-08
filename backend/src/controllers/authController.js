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
  const profileImage = req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/40';

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
        // Initialize points for new user
        db.run('INSERT INTO user_points (user_id, points) VALUES (?, 0)', [this.lastID]);
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

const getUserProfile = (req, res) => {
  db.get(`
    SELECT u.id, u.username, u.first_name, u.last_name, u.profile_image, u.age, u.email, COALESCE(up.points, 0) as points
    FROM users u
    LEFT JOIN user_points up ON u.id = up.user_id
    WHERE u.id = ?
  `, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImage: user.profile_image,
      age: user.age,
      email: user.email,
      totalPoints: user.points,
      joinedDate: '2025-01-01', // Replace with actual join date if stored
    });
  });
};

const updateUserProfile = async (req, res) => {
  console.log('Update request body:', req.body);
  console.log('Update request file:', req.file);

  const { username, firstName, lastName, age, email, password } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : req.body.profileImage;

  const updates = {};
  if (username) updates.username = username;
  if (firstName) updates.first_name = firstName;
  if (lastName) updates.last_name = lastName;
  if (age) updates.age = age;
  if (email) updates.email = email;
  if (profileImage) updates.profile_image = profileImage;
  if (password) updates.password = await bcrypt.hash(password, 10);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), req.user.id];

  db.run(
    `UPDATE users SET ${setClause} WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'Profile updated successfully' });
    }
  );
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

const updateWithUpload = [
  upload.single('profileImage'),
  (req, res, next) => {
    if (req.fileValidationError) {
      console.error('File upload error:', req.fileValidationError);
      return res.status(400).json({ error: 'Invalid file upload' });
    }
    next();
  },
  updateUserProfile,
];

module.exports = { signup: signupWithUpload, login, getUserProfile, updateUserProfile: updateWithUpload };