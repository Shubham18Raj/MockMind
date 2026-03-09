const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MockMind API is running!' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const questionRoutes = require('./routes/questionRoutes');
app.use('/api/questions', questionRoutes);

const sessionRoutes = require('./routes/sessionRoutes');
app.use('/api/interview', sessionRoutes);
app.use('/api/sessions', sessionRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log('MongoDB error:', err));