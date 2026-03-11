const axios = require('axios');

const MODELS = [
  'google/gemma-3-27b-it:free',
  'google/gemma-3-12b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
];

const callOpenRouter = async (prompt, modelIndex = 0) => {
  if (modelIndex >= MODELS.length) {
    throw new Error('All models failed');
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODELS[modelIndex],
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'MockMind'
        },
        timeout: 30000
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    const status = err.response?.status
    const isRateLimit = status === 429
    const isUnavailable = status === 503 || status === 502

    if (isRateLimit || isUnavailable) {
      console.log(`⚠️ Model ${MODELS[modelIndex]} rate limited, trying next...`)
      // Wait 2 seconds then try next model
      await new Promise(resolve => setTimeout(resolve, 2000))
      return callOpenRouter(prompt, modelIndex + 1)
    }

    throw err
  }
}

const evaluateWithAI = async (question, answer) => {
  try {
    if (!answer || answer.trim() === '') {
      return {
        score: 0,
        strengths: ['No answer provided'],
        improvements: ['Please attempt to answer the question'],
        idealAnswer: 'An answer was not provided for this question.'
      };
    }

    const prompt = `You are a senior technical interviewer. Evaluate this interview answer strictly and fairly.

Question: ${question}
Answer: ${answer}

Respond ONLY with valid JSON, no extra text, no markdown, no backticks:
{
  "score": <number 0-10>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "idealAnswer": "A concise ideal answer here"
}`;

    const content = await callOpenRouter(prompt)

    // Clean and parse response
    const cleaned = content.replace(/```json|```/g, '').trim()

    // Find JSON in response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const feedback = JSON.parse(jsonMatch[0])

    // Validate score
    if (typeof feedback.score !== 'number') {
      feedback.score = parseInt(feedback.score) || 5
    }
    feedback.score = Math.min(10, Math.max(0, feedback.score))

    console.log(`✅ AI evaluated — Score: ${feedback.score}/10`)
    return feedback

  } catch (err) {
    console.error('❌ AI evaluation error:', err.message);
    return {
      score: 5,
      strengths: ['Answer was submitted'],
      improvements: ['Could not evaluate — please try again'],
      idealAnswer: 'AI evaluation failed. Please retry.'
    };
  }
};

module.exports = { evaluateWithAI };