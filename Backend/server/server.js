const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'MockMind API is running!' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const questionRoutes = require('./routes/questionRoutes');
app.use('/api/questions', questionRoutes);

const sessionRoutes = require('./routes/sessionRoutes');
app.use('/api/interview', sessionRoutes);
app.use('/api/sessions', sessionRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);

// ─── Global Error Handler ─────────────────
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ─── 404 Handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// ─── Database + Server ────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log('MongoDB error:', err));