const { evaluateAnswer } = require('../utils/gemini');

// POST /api/ai/evaluate
const evaluate = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    console.log('Evaluating answer with Gemini...');
    const feedback = await evaluateAnswer(question, answer);

    res.json({ feedback });

  } catch (err) {
    res.status(500).json({ message: 'AI evaluation failed', error: err.message });
  }
};

module.exports = { evaluate };