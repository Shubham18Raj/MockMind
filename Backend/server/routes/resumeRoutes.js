const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');
const { uploadResume, analyzeResume } = require('../controllers/resumeController');

// POST /api/resume/upload — upload PDF and get personalized questions
router.post('/upload', protect, upload.single('resume'), uploadResume);

// POST /api/resume/analyze 
router.post('/analyze', protect, upload.single('resume'), analyzeResume);

module.exports = router;