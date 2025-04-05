const express = require('express');
const cors = require('cors');
const { db } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Mount routes
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});