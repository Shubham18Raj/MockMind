import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSessionById } from '../services/api'

const Results = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSessionById(id)
        setSession(res.data)
      } catch (err) {
        console.error('Failed to fetch session:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const getScoreColor = (score) => {
    if (score >= 7) return '#22c55e'
    if (score >= 5) return '#f59e0b'
    return '#ef4444'
  }

  const getGrade = (score) => {
    if (score >= 9) return { grade: 'S', label: 'Outstanding', color: '#a855f7' }
    if (score >= 8) return { grade: 'A', label: 'Excellent', color: '#22c55e' }
    if (score >= 6) return { grade: 'B', label: 'Good', color: '#06b6d4' }
    if (score >= 4) return { grade: 'C', label: 'Average', color: '#f59e0b' }
    return { grade: 'D', label: 'Needs Work', color: '#ef4444' }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", flexDirection: 'column', gap: '16px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Loading results...</div>
    </div>
  )

  if (!session) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: "'DM Sans', sans-serif"
    }}>
      Session not found.
    </div>
  )

  const grade = getGrade(session.averageScore)
  const answeredCount = session.answers.filter(a => a.userAnswer).length

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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
          padding: 0 32px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .main {
          max-width: 900px; margin: 0 auto;
          padding: 40px 24px;
          position: relative; z-index: 1;
        }

        .hero-card {
          background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08));
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 32px;
          text-align: center;
          animation: fadeUp 0.4s ease forwards;
          position: relative; overflow: hidden;
        }
        .hero-card::before {
          content: '';
          position: absolute; top: -100px; left: 50%;
          transform: translateX(-50%);
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .grade-badge {
          width: 100px; height: 100px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 42px; font-weight: 800;
          margin: 0 auto 20px;
          animation: scaleIn 0.5s ease 0.2s both;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          animation: fadeUp 0.4s ease forwards;
          transition: border-color 0.2s;
        }
        .stat-box:hover { border-color: rgba(99,102,241,0.3); }

        .tabs {
          display: flex; gap: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          width: fit-content;
        }

        .tab {
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab.active {
          background: rgba(99,102,241,0.2);
          color: #a5b4fc;
          font-weight: 600;
        }

        .answer-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 16px;
          animation: fadeUp 0.4s ease forwards;
          transition: border-color 0.2s;
        }
        .answer-card:hover { border-color: rgba(255,255,255,0.12); }

        .answer-header {
          padding: 20px 24px;
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 16px;
          cursor: pointer;
          user-select: none;
        }

        .answer-body {
          padding: 0 24px 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .score-bar-bg {
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
          margin-top: 8px;
        }
        .score-bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 1s ease;
        }

        .feedback-chip {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; line-height: 1.5;
          color: rgba(255,255,255,0.65);
          margin-bottom: 6px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }

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
          background: rgba(255,255,255,0.08); color: white;
        }

        .chart-bar-wrap {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 12px;
        }
        .chart-bar-label {
          width: 24px;
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }
        .chart-bar-bg {
          flex: 1; height: 32px;
          background: rgba(255,255,255,0.04);
          border-radius: 8px; overflow: hidden;
          position: relative;
        }
        .chart-bar-fill {
          height: 100%; border-radius: 8px;
          display: flex; align-items: center;
          padding-left: 12px;
          font-size: 13px; font-weight: 600;
          transition: width 1s ease;
        }

        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .main { padding: 24px 16px; }
          .topbar { padding: 0 16px; }
          .hero-card { padding: 28px 20px; }
        }
      `}</style>

      <div className="grid-bg" />

      {/* Topbar */}
      <div className="topbar">
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '18px', fontWeight: '700'
        }}>
          🧠 MockMind
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <button className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            onClick={() => navigate(`/interview?role=${session.role}`)}>
            Retry Same Role
          </button>
        </div>
      </div>

      <div className="main">

        {/* Hero Score Card */}
        <div className="hero-card">
          <div className="grade-badge" style={{
            background: `${grade.color}20`,
            border: `3px solid ${grade.color}50`,
            color: grade.color
          }}>
            {grade.grade}
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '32px', fontWeight: '800',
            marginBottom: '8px'
          }}>
            {grade.label}!
          </h1>

          <div style={{
            fontSize: '56px', fontWeight: '800',
            fontFamily: "'Syne', sans-serif",
            color: getScoreColor(session.averageScore),
            lineHeight: 1, marginBottom: '8px',
            animation: 'countUp 0.5s ease 0.3s both'
          }}>
            {session.averageScore}
            <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>/10</span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
            Average Score • {session.role.charAt(0).toUpperCase() + session.role.slice(1)} Interview
          </p>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {[
            { icon: '✅', label: 'Answered', value: answeredCount, sub: `of ${session.totalQuestions}` },
            { icon: '🏆', label: 'Total Score', value: session.totalScore, sub: `of ${session.totalQuestions * 10}` },
            { icon: '📈', label: 'Avg Score', value: session.averageScore, sub: 'out of 10' },
            { icon: '🎯', label: 'Role', value: session.role.charAt(0).toUpperCase() + session.role.slice(1), sub: 'interview type' },
          ].map((stat, i) => (
            <div key={i} className="stat-box" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '24px', fontWeight: '800',
                color: 'white', marginBottom: '2px'
              }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{stat.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Score Chart */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '24px',
          marginBottom: '32px',
          animation: 'fadeUp 0.5s ease forwards'
        }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '16px', fontWeight: '700',
            marginBottom: '20px'
          }}>📊 Score Per Question</h3>

          {session.answers.map((ans, i) => {
            const score = ans.aiFeedback?.score || 0
            const color = getScoreColor(score)
            return (
              <div key={i} className="chart-bar-wrap">
                <div className="chart-bar-label">Q{i + 1}</div>
                <div className="chart-bar-bg">
                  <div className="chart-bar-fill" style={{
                    width: `${score * 10}%`,
                    background: `linear-gradient(90deg, ${color}40, ${color}80)`,
                    color: color
                  }}>
                    {score > 0 ? `${score}/10` : ''}
                  </div>
                </div>
                <div style={{
                  width: '40px', textAlign: 'right',
                  fontSize: '13px', fontWeight: '700',
                  color: color, flexShrink: 0
                }}>{score}</div>
              </div>
            )
          })}
        </div>

        {/* Detailed Answers */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '20px'
          }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '18px', fontWeight: '700'
            }}>💬 Detailed Feedback</h3>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              Click any question to expand
            </div>
          </div>

          {session.answers.map((ans, i) => (
            <AnswerCard key={i} ans={ans} index={i} getScoreColor={getScoreColor} />
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{
          display: 'flex', gap: '12px',
          marginTop: '40px', flexWrap: 'wrap'
        }}>
          <button className="btn-primary"
            onClick={() => navigate(`/interview?role=${session.role}`)}>
            🔄 Practice Again
          </button>
          <button className="btn-secondary"
            onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <button className="btn-secondary"
            onClick={() => navigate('/leaderboard')}>
            🏆 View Leaderboard
          </button>
        </div>

      </div>
    </div>
  )
}

// Expandable Answer Card Component
const AnswerCard = ({ ans, index, getScoreColor }) => {
  const [expanded, setExpanded] = useState(false)
  const score = ans.aiFeedback?.score || 0
  const color = getScoreColor(score)

  return (
    <div className="answer-card">
      <div className="answer-header" onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '8px'
          }}>
            <span style={{
              background: 'rgba(99,102,241,0.15)',
              color: '#a5b4fc',
              fontSize: '11px', fontWeight: '700',
              padding: '3px 10px', borderRadius: '100px',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>Q{index + 1}</span>
            <span style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              {ans.aiFeedback?.category || ''} • {ans.questionText ? ans.questionText.substring(0, 60) + '...' : 'Question'}
            </span>
          </div>
          <p style={{
            fontSize: '15px', fontWeight: '500',
            color: 'rgba(255,255,255,0.85)', lineHeight: '1.5'
          }}>
            {ans.questionText}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '20px', fontWeight: '800',
            color: color
          }}>{score}/10</div>
          <div style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '18px',
            transition: 'transform 0.3s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>▾</div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ padding: '0 24px 16px' }}>
        <div className="score-bar-bg">
          <div className="score-bar-fill" style={{
            width: `${score * 10}%`,
            background: `linear-gradient(90deg, ${color}60, ${color})`
          }} />
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="answer-body">

          {/* Your Answer */}
          {ans.userAnswer && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>Your Answer</div>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '14px',
                fontSize: '14px', lineHeight: '1.6',
                color: 'rgba(255,255,255,0.6)'
              }}>
                {ans.userAnswer}
              </div>
            </div>
          )}

          {/* Strengths */}
          {ans.aiFeedback?.strengths?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600',
                color: '#22c55e',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>✅ Strengths</div>
              {ans.aiFeedback.strengths.map((s, i) => (
                <div key={i} className="feedback-chip">
                  <span style={{ color: '#22c55e', marginTop: '1px' }}>•</span> {s}
                </div>
              ))}
            </div>
          )}

          {/* Improvements */}
          {ans.aiFeedback?.improvements?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600',
                color: '#f59e0b',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>📈 Improvements</div>
              {ans.aiFeedback.improvements.map((imp, i) => (
                <div key={i} className="feedback-chip">
                  <span style={{ color: '#f59e0b', marginTop: '1px' }}>•</span> {imp}
                </div>
              ))}
            </div>
          )}

          {/* Ideal Answer */}
          {ans.aiFeedback?.idealAnswer && (
            <div>
              <div style={{
                fontSize: '11px', fontWeight: '600',
                color: '#a5b4fc',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>💡 Ideal Answer</div>
              <div style={{
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: '10px', padding: '14px',
                fontSize: '14px', lineHeight: '1.7',
                color: 'rgba(255,255,255,0.65)'
              }}>
                {ans.aiFeedback.idealAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Results