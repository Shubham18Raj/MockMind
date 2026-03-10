import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { startSession, saveAnswer, finishSession, evaluateAnswer } from '../services/api'

const Interview = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') || 'fullstack'

  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [phase, setPhase] = useState('answering') // answering | feedback
  const [answeredCount, setAnsweredCount] = useState(0)
  const [timer, setTimer] = useState(120)
  const [timerActive, setTimerActive] = useState(false)
  const [listening, setListening] = useState(false)
  const timerRef = useRef(null)
  const recognitionRef = useRef(null)

  // Start session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await startSession({ role, totalQuestions: 8 })
        setSessionId(res.data.session._id)
        setQuestions(res.data.questions)
        setTimerActive(true)
      } catch (err) {
        console.error('Failed to start session:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000)
    } else if (timer === 0 && timerActive) {
      handleSubmitAnswer(true)
    }
    return () => clearTimeout(timerRef.current)
  }, [timer, timerActive])

  // Reset timer on new question
  useEffect(() => {
    setTimer(120)
    setTimerActive(phase === 'answering')
  }, [currentIndex, phase])

  // Voice input setup
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Try Chrome!')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript).join('')
      setAnswer(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const handleSubmitAnswer = async (timedOut = false) => {
    if (submitting) return
    setTimerActive(false)
    setSubmitting(true)

    const finalAnswer = timedOut ? (answer || 'No answer provided') : answer

    try {
      // Get AI feedback
      const aiRes = await evaluateAnswer({
        question: questions[currentIndex]?.text,
        answer: finalAnswer
      })

      const aiFeedback = aiRes.data.feedback

      // Save answer to session
      await saveAnswer({
        sessionId,
        questionId: questions[currentIndex]?._id,
        userAnswer: finalAnswer,
        aiFeedback
      })

      setFeedback(aiFeedback)
      setAnsweredCount(prev => prev + 1)
      setPhase('feedback')
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setAnswer('')
      setFeedback(null)
      setPhase('answering')
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setFinishing(true)
    try {
      await finishSession({ sessionId })
      navigate(`/results/${sessionId}`)
    } catch (err) {
      console.error('Finish error:', err)
    }
  }

  const getTimerColor = () => {
    if (timer > 60) return '#22c55e'
    if (timer > 30) return '#f59e0b'
    return '#ef4444'
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", flexDirection: 'column', gap: '16px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=Syne:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>
        Preparing your interview...
      </div>
    </div>
  )

  const currentQuestion = questions[currentIndex]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Sans', sans-serif",
      color: 'white'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none; z-index: 0;
        }

        .topbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,10,15,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 32px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .progress-bar-bg {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: rgba(255,255,255,0.05);
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          transition: width 0.5s ease;
        }

        .main {
          max-width: 800px; margin: 0 auto;
          padding: 40px 24px;
          position: relative; z-index: 1;
        }

        .question-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          animation: fadeUp 0.4s ease forwards;
        }

        .answer-area {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          color: white;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          resize: vertical;
          min-height: 160px;
          outline: none;
          transition: all 0.3s;
          line-height: 1.6;
        }
        .answer-area:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.04);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .answer-area::placeholder { color: rgba(255,255,255,0.2); }

        .btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 12px;
          color: white; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .btn-primary:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none;
        }

        .btn-secondary {
          padding: 13px 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.7);
          font-size: 15px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .voice-btn {
          padding: 13px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .voice-btn.active {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          color: #fca5a5;
          animation: pulse 1.5s ease infinite;
        }

        .feedback-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          animation: slideIn 0.4s ease forwards;
        }

        .score-circle {
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 800;
        }

        .feedback-section {
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .feedback-tag {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 6px;
        }

        .feedback-point {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 14px; line-height: 1.5;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
        }
      `}</style>

      <div className="grid-bg" />

      {/* Top Bar */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            onClick={() => navigate('/dashboard')}
          >
            ← Exit
          </button>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '16px', fontWeight: '700'
          }}>
            🧠 Mock Interview
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Question counter */}
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            <span style={{ color: 'white', fontWeight: '600' }}>{currentIndex + 1}</span>
            /{questions.length}
          </div>

          {/* Timer */}
          {phase === 'answering' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: `${getTimerColor()}15`,
              border: `1px solid ${getTimerColor()}40`,
              borderRadius: '100px',
              padding: '6px 14px'
            }}>
              <span style={{ fontSize: '14px' }}>⏱</span>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '16px', fontWeight: '700',
                color: getTimerColor()
              }}>
                {formatTime(timer)}
              </span>
            </div>
          )}

          {/* Role badge */}
          <div style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
            padding: '6px 14px', borderRadius: '100px',
            fontSize: '13px', fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {role}
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="main">

        {/* Question */}
        <div className="question-card">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc',
              width: '32px', height: '32px',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px', fontWeight: '800'
            }}>
              {currentIndex + 1}
            </div>
            <div style={{
              fontSize: '12px', fontWeight: '600',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              {currentQuestion?.category} • {currentQuestion?.difficulty}
            </div>
          </div>

          <p style={{
            fontSize: '20px', fontWeight: '500',
            lineHeight: '1.6', color: 'rgba(255,255,255,0.9)'
          }}>
            {currentQuestion?.text}
          </p>
        </div>

        {/* Answer Phase */}
        {phase === 'answering' && (
          <div style={{ animation: 'fadeUp 0.3s ease forwards' }}>
            <textarea
              className="answer-area"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here... or use the voice button below to speak your answer 🎤"
            />

            <div style={{
              display: 'flex', gap: '12px',
              marginTop: '16px', flexWrap: 'wrap'
            }}>
              <button
                className="btn-primary"
                onClick={() => handleSubmitAnswer(false)}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? '⏳ Evaluating...' : 'Submit Answer →'}
              </button>

              <button
                className={`voice-btn ${listening ? 'active' : ''}`}
                onClick={listening ? stopListening : startListening}
              >
                {listening ? (
                  <>
                    <span style={{ animation: 'blink 1s infinite' }}>🔴</span>
                    Stop Recording
                  </>
                ) : (
                  <>🎤 Voice Input</>
                )}
              </button>

              <button
                className="btn-secondary"
                onClick={() => handleSubmitAnswer(true)}
                disabled={submitting}
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Feedback Phase */}
        {phase === 'feedback' && feedback && (
          <div className="feedback-card">

            {/* Score header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '20px', marginBottom: '24px'
            }}>
              <div className="score-circle" style={{
                background: `${feedback.score >= 7 ? '#22c55e' : feedback.score >= 5 ? '#f59e0b' : '#ef4444'}15`,
                border: `2px solid ${feedback.score >= 7 ? '#22c55e' : feedback.score >= 5 ? '#f59e0b' : '#ef4444'}40`,
                color: feedback.score >= 7 ? '#22c55e' : feedback.score >= 5 ? '#f59e0b' : '#ef4444'
              }}>
                <span>{feedback.score}</span>
                <span style={{ fontSize: '11px', fontWeight: '400', opacity: 0.7 }}>/10</span>
              </div>
              <div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '20px', fontWeight: '700', marginBottom: '4px'
                }}>
                  {feedback.score >= 8 ? '🔥 Excellent!' :
                   feedback.score >= 6 ? '👍 Good Answer' :
                   feedback.score >= 4 ? '📚 Needs Work' : '💪 Keep Practicing'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                  AI Feedback • Question {currentIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Strengths */}
            {feedback.strengths?.length > 0 && (
              <div className="feedback-section" style={{ borderLeft: '3px solid #22c55e' }}>
                <div className="feedback-tag" style={{ color: '#22c55e' }}>
                  ✅ Strengths
                </div>
                {feedback.strengths.map((s, i) => (
                  <div key={i} className="feedback-point">
                    <span style={{ color: '#22c55e', marginTop: '2px' }}>•</span>
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements?.length > 0 && (
              <div className="feedback-section" style={{ borderLeft: '3px solid #f59e0b' }}>
                <div className="feedback-tag" style={{ color: '#f59e0b' }}>
                  📈 Improvements
                </div>
                {feedback.improvements.map((imp, i) => (
                  <div key={i} className="feedback-point">
                    <span style={{ color: '#f59e0b', marginTop: '2px' }}>•</span>
                    {imp}
                  </div>
                ))}
              </div>
            )}

            {/* Ideal Answer */}
            {feedback.idealAnswer && (
              <div className="feedback-section" style={{ borderLeft: '3px solid #6366f1' }}>
                <div className="feedback-tag" style={{ color: '#a5b4fc' }}>
                  💡 Ideal Answer
                </div>
                <div style={{
                  fontSize: '14px', lineHeight: '1.7',
                  color: 'rgba(255,255,255,0.65)'
                }}>
                  {feedback.idealAnswer}
                </div>
              </div>
            )}

            {/* Next button */}
            <div style={{ marginTop: '24px' }}>
              <button className="btn-primary" onClick={handleNext}>
                {currentIndex < questions.length - 1
                  ? `Next Question →`
                  : '🎉 Finish & See Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Interview