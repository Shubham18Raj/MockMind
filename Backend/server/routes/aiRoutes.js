const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { evaluateAnswer } = require('../controllers/aiController');

router.post('/evaluate', protect, evaluateAnswer);

module.exports = router;