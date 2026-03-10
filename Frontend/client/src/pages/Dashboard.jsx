import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMySessions, getLeaderboard } from '../services/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('fullstack')
  const [showRoleModal, setShowRoleModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, leaderboardRes] = await Promise.all([
          getMySessions(),
          getLeaderboard()
        ])
        setSessions(sessionsRes.data)
        setLeaderboard(leaderboardRes.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStartInterview = () => {
    navigate(`/interview?role=${selectedRole}`)
  }

  const avgScore = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.averageScore, 0) / sessions.length).toFixed(1)
    : 0

  const bestScore = sessions.length > 0
    ? Math.max(...sessions.map(s => s.averageScore)).toFixed(1)
    : 0

  const getScoreColor = (score) => {
    if (score >= 7) return '#22c55e'
    if (score >= 5) return '#f59e0b'
    return '#ef4444'
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      frontend: '#6366f1',
      backend: '#06b6d4',
      fullstack: '#8b5cf6',
      hr: '#f59e0b'
    }
    return colors[role] || '#6366f1'
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
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
        @keyframes pulse {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none; z-index: 0;
        }

        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,10,15,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 32px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-right { display: flex; align-items: center; gap: 16px; }

        .nav-user {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 6px 14px 6px 6px;
        }

        .avatar {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
        }

        .logout-btn {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.2);
        }

        .main { max-width: 1200px; margin: 0 auto; padding: 40px 32px; position: relative; z-index: 1; }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          animation: fadeUp 0.5s ease forwards;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .start-card {
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          animation: fadeUp 0.4s ease forwards;
          position: relative;
          overflow: hidden;
        }

        .start-card::before {
          content: '';
          position: absolute;
          top: -50%; right: -20%;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .role-option {
          padding: 10px 20px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .role-option:hover {
          border-color: rgba(99,102,241,0.4);
          color: white;
        }
        .role-option.active {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.6);
          color: #a5b4fc;
          font-weight: 600;
        }

        .start-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          display: flex; align-items: center; gap: 8px;
        }
        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700;
          color: white;
          margin-bottom: 16px;
        }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

        .sessions-list {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .session-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
          cursor: pointer;
        }
        .session-item:hover { background: rgba(255,255,255,0.03); }
        .session-item:last-child { border-bottom: none; }

        .role-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .score-pill {
          font-size: 15px; font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
        }

        .leaderboard-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .lb-item {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }
        .lb-item:hover { background: rgba(255,255,255,0.03); }
        .lb-item:last-child { border-bottom: none; }

        .lb-rank {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }
        .lb-rank.gold { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .lb-rank.silver { background: rgba(156,163,175,0.15); color: #9ca3af; }
        .lb-rank.bronze { background: rgba(180,83,9,0.15); color: #b45309; }

        .empty-state {
          text-align: center;
          padding: 48px 20px;
          color: rgba(255,255,255,0.25);
        }

        .loading-shimmer {
          background: linear-gradient(90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.07) 50%,
            rgba(255,255,255,0.03) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
          height: 60px;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .two-col { grid-template-columns: 1fr; }
          .main { padding: 24px 16px; }
          .navbar { padding: 0 16px; }
        }
      `}</style>

      <div className="grid-bg" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">🧠 MockMind</div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              {user?.name}
            </span>
          </div>
          <button className="logout-btn" onClick={() => { logout(); navigate('/login') }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="main">

        {/* Welcome */}
        <div style={{ marginBottom: '32px', animation: 'fadeUp 0.3s ease forwards' }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '32px', fontWeight: '800',
            marginBottom: '6px'
          }}>
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
            {sessions.length === 0
              ? "Ready to start your interview prep? Let's go!"
              : `You've completed ${sessions.length} interview${sessions.length > 1 ? 's' : ''}. Keep it up!`}
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div style={{ marginBottom: '32px' }}>
            {[1,2,3,4].map(i => <div key={i} className="loading-shimmer" />)}
          </div>
        ) : (
          <div className="stats-grid">
            {[
              { label: 'Total Sessions', value: sessions.length, icon: '🎯', color: '#6366f1' },
              { label: 'Average Score', value: `${avgScore}/10`, icon: '📊', color: '#06b6d4' },
              { label: 'Best Score', value: `${bestScore}/10`, icon: '🏆', color: '#f59e0b' },
              { label: 'Questions Done', value: sessions.reduce((sum, s) => sum + s.totalQuestions, 0), icon: '✅', color: '#22c55e' },
            ].map((stat, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '28px', fontWeight: '800',
                  color: stat.color, marginBottom: '4px'
                }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Start Interview */}
        <div className="start-card">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px', fontWeight: '800',
              marginBottom: '6px'
            }}>Start a Mock Interview</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '20px' }}>
              Pick your role and get 8 AI-evaluated questions
            </p>

            {/* Role selector */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {[
                { value: 'frontend', label: '🎨 Frontend' },
                { value: 'backend', label: '⚙️ Backend' },
                { value: 'fullstack', label: '🚀 Full Stack' },
                { value: 'hr', label: '🤝 HR Round' },
              ].map(role => (
                <button
                  key={role.value}
                  className={`role-option ${selectedRole === role.value ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <button className="start-btn" onClick={handleStartInterview}>
              Start Interview
              <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        </div>

        {/* Sessions + Leaderboard */}
        <div className="two-col">

          {/* Recent Sessions */}
          <div>
            <div className="section-title">📋 Recent Sessions</div>
            <div className="sessions-list">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="loading-shimmer" style={{ margin: '12px' }} />)
              ) : sessions.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
                  <div style={{ fontSize: '15px', marginBottom: '6px', color: 'rgba(255,255,255,0.4)' }}>No sessions yet</div>
                  <div style={{ fontSize: '13px' }}>Start your first interview above!</div>
                </div>
              ) : (
                sessions.slice(0, 6).map((session, i) => (
                  <div
                    key={session._id}
                    className="session-item"
                    onClick={() => navigate(`/results/${session._id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>
                        {session.role === 'frontend' ? '🎨' :
                         session.role === 'backend' ? '⚙️' :
                         session.role === 'fullstack' ? '🚀' : '🤝'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="role-badge" style={{
                            background: `${getRoleBadgeColor(session.role)}20`,
                            color: getRoleBadgeColor(session.role),
                          }}>
                            {session.role}
                          </span>
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                          {formatDate(session.createdAt)} • {session.totalQuestions} questions
                        </div>
                      </div>
                    </div>
                    <div className="score-pill" style={{
                      color: getScoreColor(session.averageScore)
                    }}>
                      {session.averageScore}/10
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="section-title">🏆 Leaderboard</div>
            <div className="leaderboard-card">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="loading-shimmer" style={{ margin: '12px' }} />)
              ) : leaderboard.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
                  <div style={{ fontSize: '14px' }}>Be the first on the leaderboard!</div>
                </div>
              ) : (
                leaderboard.slice(0, 8).map((entry, i) => (
                  <div key={i} className="lb-item">
                    <div className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                        {entry.name}
                        {entry.name === user?.name && (
                          <span style={{
                            marginLeft: '6px', fontSize: '10px',
                            background: 'rgba(99,102,241,0.2)',
                            color: '#a5b4fc', padding: '2px 6px',
                            borderRadius: '100px'
                          }}>you</span>
                        )}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                        {entry.college || 'Student'} • {entry.totalSessions} sessions
                      </div>
                    </div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '16px', fontWeight: '700',
                      color: getScoreColor(entry.avgScore)
                    }}>
                      {entry.avgScore}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard