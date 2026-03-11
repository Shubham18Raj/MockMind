import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Leaderboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLeaderboard()
        setLeaderboard(res.data)
        const rank = res.data.findIndex(e => e.name === user?.name)
        setUserRank(rank + 1)
      } catch (err) {
        console.error('Leaderboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return null
  }

  const getScoreColor = (score) => {
    if (score >= 7) return '#22c55e'
    if (score >= 5) return '#f59e0b'
    return '#ef4444'
  }

  const getRankColor = (index) => {
    if (index === 0) return { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.15)' }
    if (index === 1) return { bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.25)', glow: 'rgba(156,163,175,0.1)' }
    if (index === 2) return { bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.25)', glow: 'rgba(180,83,9,0.1)' }
    return { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.07)', glow: 'transparent' }
  }

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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
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
          max-width: 800px; margin: 0 auto;
          padding: 40px 24px;
          position: relative; z-index: 1;
        }

        .hero {
          text-align: center;
          margin-bottom: 48px;
          animation: fadeUp 0.4s ease forwards;
        }

        .podium {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 12px;
          margin-bottom: 48px;
          animation: fadeUp 0.5s ease forwards;
        }

        .podium-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .podium-avatar {
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          position: relative;
        }

        .podium-base {
          border-radius: 12px 12px 0 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 800;
          color: rgba(255,255,255,0.5);
          width: 100px;
        }

        .lb-row {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 10px;
          transition: transform 0.2s, border-color 0.2s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .lb-row:hover { transform: translateX(4px); }

        .lb-rank-num {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 800;
          flex-shrink: 0;
        }

        .lb-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 15px;
          flex-shrink: 0;
        }

        .score-ring {
          width: 48px; height: 48px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          flex-shrink: 0;
        }

        .shimmer-row {
          height: 72px;
          border-radius: 16px;
          margin-bottom: 10px;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0.03) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .btn-primary {
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 12px;
          color: white; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.7);
          font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08); color: white;
        }

        .you-badge {
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.4);
          color: #a5b4fc;
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-left: 8px;
        }

        @media (max-width: 768px) {
          .main { padding: 24px 16px; }
          .topbar { padding: 0 16px; }
          .podium-base { width: 80px; }
        }
      `}</style>

      <div className="grid-bg" />

      {/* Glow orbs */}
      <div style={{
        position: 'fixed', top: '-100px', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

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
            onClick={() => navigate('/interview?role=fullstack')}>
            Start Interview
          </button>
        </div>
      </div>

      <div className="main">

        {/* Hero */}
        <div className="hero">
          <div style={{
            fontSize: '56px', marginBottom: '16px',
            animation: 'float 3s ease-in-out infinite'
          }}>🏆</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '36px', fontWeight: '800',
            marginBottom: '8px'
          }}>Leaderboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px' }}>
            Top performers ranked by average interview score
          </p>

          {/* Your rank badge */}
          {userRank > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '100px', padding: '8px 20px',
              marginTop: '16px', fontSize: '14px',
              color: '#a5b4fc'
            }}>
              🎯 You are ranked <strong style={{ color: 'white' }}>#{userRank}</strong> out of {leaderboard.length} users
            </div>
          )}
        </div>

        {/* Podium — Top 3 */}
        {!loading && leaderboard.length >= 3 && (
          <div className="podium">

            {/* 2nd place */}
            <div className="podium-item">
              <div style={{
                fontSize: '28px',
                animation: 'float 3.2s ease-in-out infinite'
              }}>🥈</div>
              <div className="podium-avatar" style={{
                width: '56px', height: '56px',
                background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
                fontSize: '20px', color: 'white',
                boxShadow: '0 0 20px rgba(156,163,175,0.3)'
              }}>
                {leaderboard[1]?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '13px', fontWeight: '700',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '80px', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{leaderboard[1]?.name}</div>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700' }}>
                {leaderboard[1]?.avgScore}/10
              </div>
              <div className="podium-base" style={{
                height: '80px',
                background: 'linear-gradient(180deg, rgba(156,163,175,0.15), rgba(156,163,175,0.05))',
                border: '1px solid rgba(156,163,175,0.2)',
              }}>2</div>
            </div>

            {/* 1st place */}
            <div className="podium-item">
              <div style={{
                fontSize: '36px',
                animation: 'float 2.8s ease-in-out infinite'
              }}>🥇</div>
              <div className="podium-avatar" style={{
                width: '72px', height: '72px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                fontSize: '26px', color: 'white',
                boxShadow: '0 0 30px rgba(251,191,36,0.4)'
              }}>
                {leaderboard[0]?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '14px', fontWeight: '700',
                color: 'white',
                maxWidth: '90px', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{leaderboard[0]?.name}</div>
              <div style={{ color: '#fbbf24', fontSize: '15px', fontWeight: '800',
                fontFamily: "'Syne', sans-serif" }}>
                {leaderboard[0]?.avgScore}/10
              </div>
              <div className="podium-base" style={{
                height: '110px',
                background: 'linear-gradient(180deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
                border: '1px solid rgba(251,191,36,0.3)',
              }}>1</div>
            </div>

            {/* 3rd place */}
            <div className="podium-item">
              <div style={{
                fontSize: '28px',
                animation: 'float 3.5s ease-in-out infinite'
              }}>🥉</div>
              <div className="podium-avatar" style={{
                width: '56px', height: '56px',
                background: 'linear-gradient(135deg, #b45309, #92400e)',
                fontSize: '20px', color: 'white',
                boxShadow: '0 0 20px rgba(180,83,9,0.3)'
              }}>
                {leaderboard[2]?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '13px', fontWeight: '700',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '80px', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{leaderboard[2]?.name}</div>
              <div style={{ color: '#b45309', fontSize: '13px', fontWeight: '700' }}>
                {leaderboard[2]?.avgScore}/10
              </div>
              <div className="podium-base" style={{
                height: '60px',
                background: 'linear-gradient(180deg, rgba(180,83,9,0.15), rgba(180,83,9,0.05))',
                border: '1px solid rgba(180,83,9,0.2)',
              }}>3</div>
            </div>

          </div>
        )}

        {/* Full Rankings */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '8px',
          animation: 'fadeUp 0.6s ease forwards'
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '8px'
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '16px', fontWeight: '700'
            }}>All Rankings</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              {leaderboard.length} participants
            </div>
          </div>

          {/* Loading */}
          {loading && (
            [1,2,3,4,5].map(i => (
              <div key={i} className="shimmer-row" />
            ))
          )}

          {/* Empty */}
          {!loading && leaderboard.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              color: 'rgba(255,255,255,0.25)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
              <div style={{ fontSize: '16px', marginBottom: '6px', color: 'rgba(255,255,255,0.4)' }}>
                No rankings yet
              </div>
              <div style={{ fontSize: '13px', marginBottom: '20px' }}>
                Complete an interview to appear here!
              </div>
              <button className="btn-primary"
                onClick={() => navigate('/interview?role=fullstack')}>
                Start Interview
              </button>
            </div>
          )}

          {/* Rows */}
          {!loading && leaderboard.map((entry, i) => {
            const colors = getRankColor(i)
            const isUser = entry.name === user?.name
            const medal = getMedal(i)
            const scoreColor = getScoreColor(entry.avgScore)
            const avatarColors = [
              'linear-gradient(135deg, #6366f1, #8b5cf6)',
              'linear-gradient(135deg, #06b6d4, #0891b2)',
              'linear-gradient(135deg, #f59e0b, #d97706)',
              'linear-gradient(135deg, #22c55e, #16a34a)',
              'linear-gradient(135deg, #ef4444, #dc2626)',
            ]

            return (
              <div
                key={i}
                className="lb-row"
                style={{
                  background: isUser
                    ? 'rgba(99,102,241,0.08)'
                    : colors.bg,
                  border: `1px solid ${isUser ? 'rgba(99,102,241,0.3)' : colors.border}`,
                  animation: `slideIn 0.3s ease ${i * 0.05}s both`
                }}
              >
                {/* Rank */}
                <div className="lb-rank-num" style={{
                  background: i < 3
                    ? ['rgba(251,191,36,0.15)', 'rgba(156,163,175,0.15)', 'rgba(180,83,9,0.15)'][i]
                    : 'rgba(255,255,255,0.05)',
                  color: i < 3
                    ? ['#fbbf24', '#9ca3af', '#b45309'][i]
                    : 'rgba(255,255,255,0.3)'
                }}>
                  {medal || `#${i + 1}`}
                </div>

                {/* Avatar */}
                <div className="lb-avatar" style={{
                  background: avatarColors[i % avatarColors.length],
                  boxShadow: i < 3 ? `0 0 12px ${colors.glow}` : 'none'
                }}>
                  {entry.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '6px', marginBottom: '3px'
                  }}>
                    <span style={{
                      fontWeight: '600', fontSize: '15px',
                      color: isUser ? '#a5b4fc' : 'white',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {entry.name}
                    </span>
                    {isUser && <span className="you-badge">You</span>}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '12px',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {entry.college || 'Student'} • {entry.totalSessions} session{entry.totalSessions !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '20px', fontWeight: '800',
                    color: scoreColor
                  }}>
                    {entry.avgScore}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.25)'
                  }}>avg score</div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '32px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: '20px',
          animation: 'fadeUp 0.7s ease forwards'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '20px', fontWeight: '700',
            marginBottom: '8px'
          }}>Ready to climb the ranks?</h3>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '14px', marginBottom: '20px'
          }}>
            Practice more interviews to improve your score!
          </p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Leaderboard