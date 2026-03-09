const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { evaluate } = require('../controllers/aiController');

// Protected — only logged in users can use AI evaluation
router.post('/evaluate', protect, evaluate);

module.exports = router;