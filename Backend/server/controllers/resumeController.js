const { extractTextFromPDF } = require('../utils/pdfParser');
const { evaluateAnswer } = require('../utils/gemini');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Extract text from PDF buffer
    console.log('Extracting text from PDF...');
    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({ message: 'Could not extract text from PDF. Make sure it is not a scanned image.' });
    }

    const trimmedText = resumeText.substring(0, 3000);

    // Send to Gemini to generate personalized questions
    console.log('Generating questions from resume...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a senior technical interviewer at a top product company.
Based on the following resume, generate exactly 8 interview questions.
Focus on the candidate's specific skills, projects, and experience mentioned.
Make the questions specific to what is written — not generic questions.
Respond ONLY with a valid JSON array in this exact format, no extra text, no markdown, no backticks:
[
  {
    "text": "question here",
    "category": "Technical or Behavioral or HR",
    "difficulty": "easy or medium or hard"
  }
]

Resume:
${trimmedText}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean response
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);

    res.json({
      message: 'Resume parsed successfully!',
      resumeTextLength: resumeText.length,
      questions
    });

  } catch (err) {
    console.error('Resume upload error:', err.message);
    res.status(500).json({ message: 'Resume processing failed', error: err.message });
  }
};

// POST /api/resume/analyze

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);

    res.json({
      message: 'Text extracted successfully!',
      characterCount: resumeText.length,
      preview: resumeText.substring(0, 500) + '...'
    });

  } catch (err) {
    res.status(500).json({ message: 'Text extraction failed', error: err.message });
  }
};

module.exports = { uploadResume, analyzeResume };