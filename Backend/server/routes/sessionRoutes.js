const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  startSession,
  saveAnswer,
  finishSession,
  getMySessions,
  getSessionById,
  getLeaderboard
} = require('../controllers/sessionController');

// All routes are protected (need JWT token)
router.post('/start', protect, startSession);
router.post('/answer', protect, saveAnswer);
router.post('/finish', protect, finishSession);
router.get('/me', protect, getMySessions);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', protect, getSessionById);

module.exports = router;