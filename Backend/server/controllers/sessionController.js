const Session = require('../models/Session');
const Question = require('../models/Question');

// POST /api/interview/start
// Creates a new session with random questions
const startSession = async (req, res) => {
  try {
    const { role, count = 8 } = req.body;

    // Get random questions for the selected role
    const questions = await Question.aggregate([
      { $match: { role } },
      { $sample: { size: parseInt(count) } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this role' });
    }

    // Pre-fill answers array with empty answers
    const answers = questions.map(q => ({
      question: q._id,
      questionText: q.text,
      userAnswer: '',
      aiFeedback: {
        score: 0,
        strengths: [],
        improvements: [],
        idealAnswer: ''
      }
    }));

    // Create the session
    const session = await Session.create({
      user: req.user.id,
      role,
      answers,
      totalQuestions: questions.length,
      status: 'in-progress'
    });

    res.status(201).json({
      message: 'Session started!',
      sessionId: session._id,
      questions: questions.map(q => ({
        _id: q._id,
        text: q.text,
        difficulty: q.difficulty,
        category: q.category
      }))
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/interview/answer
// Saves user answer + AI feedback for one question
const saveAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer, aiFeedback } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check session belongs to this user
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the answer in session and update it
    const answerIndex = session.answers.findIndex(
      a => a.question.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({ message: 'Question not found in session' });
    }

    session.answers[answerIndex].userAnswer = userAnswer;
    session.answers[answerIndex].aiFeedback = aiFeedback;
    session.answers[answerIndex].answeredAt = new Date();

    await session.save();

    res.json({ message: 'Answer saved!', answer: session.answers[answerIndex] });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/interview/finish
// Finalizes session and calculates scores
const finishSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Calculate total and average score
    const answeredQuestions = session.answers.filter(a => a.userAnswer !== '');
    const totalScore = answeredQuestions.reduce((sum, a) => sum + a.aiFeedback.score, 0);
    const averageScore = answeredQuestions.length > 0
      ? parseFloat((totalScore / answeredQuestions.length).toFixed(1))
      : 0;

    session.totalScore = totalScore;
    session.averageScore = averageScore;
    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();

    res.json({
      message: 'Session completed!',
      sessionId: session._id,
      totalScore,
      averageScore,
      totalQuestions: session.totalQuestions,
      answeredQuestions: answeredQuestions.length
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/sessions/me
// Get all past sessions for logged-in user
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user.id,
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .select('role totalScore averageScore totalQuestions status createdAt completedAt');

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/sessions/:id
// Get detailed results of one session
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/leaderboard
// Top users ranked by average score
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Session.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$user',
          totalSessions: { $sum: 1 },
          avgScore: { $avg: '$averageScore' },
          bestScore: { $max: '$averageScore' }
        }
      },
      { $sort: { avgScore: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          name: '$userInfo.name',
          college: '$userInfo.college',
          totalSessions: 1,
          avgScore: { $round: ['$avgScore', 1] },
          bestScore: { $round: ['$bestScore', 1] }
        }
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  startSession,
  saveAnswer,
  finishSession,
  getMySessions,
  getSessionById,
  getLeaderboard
};