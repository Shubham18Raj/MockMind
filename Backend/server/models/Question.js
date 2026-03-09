const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'hr'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['DSA', 'HR', 'SystemDesign', 'Behavioral', 'Technical'],
    required: true
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);