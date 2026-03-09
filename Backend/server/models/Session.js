const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  questionText: String,
  userAnswer: {
    type: String,
    default: ''
  },
  aiFeedback: {
    score: { type: Number, default: 0 },
    strengths: [String],
    improvements: [String],
    idealAnswer: { type: String, default: '' }
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'hr'],
    required: true
  },
  answers: [answerSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  totalQuestions: {
    type: Number,
    default: 8
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);