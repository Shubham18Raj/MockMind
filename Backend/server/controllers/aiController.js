const { evaluateWithAI } = require('../utils/gemini');

const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const feedback = await evaluateWithAI(question, answer);
    res.json({ feedback });

  } catch (err) {
    res.status(500).json({ message: 'Evaluation failed', error: err.message });
  }
};

module.exports = { evaluateAnswer };