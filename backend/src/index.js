const express = require('express');
const cors = require('cors');
const { db } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Server startup error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try a different port.`);
  }
});