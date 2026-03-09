const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions?role=frontend&difficulty=easy&category=Technical
router.get('/', async (req, res) => {
  try {
    const { role, difficulty, category } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/questions/random?role=frontend&count=8
router.get('/random', async (req, res) => {
  try {
    const { role, count = 8 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;