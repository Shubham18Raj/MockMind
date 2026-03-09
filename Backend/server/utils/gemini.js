const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const evaluateAnswer = async (question, answer) => {
  try {
    // If user left answer empty
    if (!answer || answer.trim() === '') {
      return {
        score: 0,
        strengths: [],
        improvements: ['You did not attempt this question'],
        idealAnswer: 'No answer was provided.'
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a senior technical interviewer at a top product company like Google or Microsoft.
Evaluate the following interview answer strictly and fairly.
Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown, no backticks:
{
  "score": <number between 0 and 10>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "idealAnswer": "A concise ideal answer in 3-4 sentences"
}

Question: ${question}
Candidate Answer: ${answer}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean response — remove any markdown backticks if present
    const cleaned = text.replace(/```json|```/g, '').trim();

    const feedback = JSON.parse(cleaned);
    return feedback;

  } catch (err) {
    console.error('Gemini error:', err.message);
    // Return default feedback if AI fails
    return {
      score: 5,
      strengths: ['Answer was submitted'],
      improvements: ['Could not evaluate — please try again'],
      idealAnswer: 'AI evaluation failed. Please retry.'
    };
  }
};

module.exports = { evaluateAnswer };