const Session = require('../models/Session');
const Question = require('../models/Question');

// POST /api/interview/start
const startSession = async (req, res) => {
  try {
    const { role, totalQuestions = 8 } = req.body;

    const questions = await Question.aggregate([
      { $match: { role: role } },
      { $sample: { size: totalQuestions } }
    ]);

    const session = await Session.create({
      user: req.user.id,
      role,
      totalQuestions: questions.length,
      answers: questions.map(q => ({
        question: q._id,
        questionText: q.text,
      }))
    });


    res.json({
      session,
      questions  
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/interview/answer
const saveAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer, aiFeedback } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

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