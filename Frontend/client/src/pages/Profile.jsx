import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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
          max-width: 600px; margin: 0 auto;
          padding: 40px 24px;
          position: relative; z-index: 1;
        }
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 16px;
          animation: fadeUp 0.4s ease forwards;
        }
        .info-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .info-row:last-child { border-bottom: none; }
        .btn-primary {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 12px;
          color: white; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.3s;
          margin-bottom: 10px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .btn-danger {
          width: 100%; padding: 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 12px;
          color: #fca5a5; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-danger:hover {
          background: rgba(239,68,68,0.2);
        }
        .btn-secondary {
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.08); color: white; }
      `}</style>

      <div className="grid-bg" />

      {/* Topbar */}
      <div className="topbar">
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '18px', fontWeight: '700'
        }}>🧠 MockMind</div>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </div>

      <div className="main">

        {/* Avatar + Name */}
        <div className="card" style={{ textAlign: 'center', animationDelay: '0s' }}>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif",
            fontSize: '32px', fontWeight: '800',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '24px', fontWeight: '800',
            marginBottom: '4px'
          }}>{user?.name}</h2>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            {user?.email}
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
            padding: '4px 14px', borderRadius: '100px',
            fontSize: '12px', fontWeight: '600',
            marginTop: '12px', textTransform: 'capitalize'
          }}>
            🎯 {user?.targetRole || 'fullstack'} Developer
          </div>
        </div>

        {/* Info */}
        <div className="card" style={{ animationDelay: '0.1s' }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '15px', fontWeight: '700',
            marginBottom: '4px', color: 'rgba(255,255,255,0.6)'
          }}>Account Info</h3>

          {[
            { label: 'Full Name', value: user?.name, icon: '👤' },
            { label: 'Email', value: user?.email, icon: '✉️' },
            { label: 'College', value: user?.college || 'Not set', icon: '🎓' },
            { label: 'Target Role', value: user?.targetRole || 'Fullstack', icon: '🎯' },
          ].map((item, i) => (
            <div key={i} className="info-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                  {item.label}
                </span>
              </div>
              <span style={{
                color: 'white', fontSize: '14px', fontWeight: '500',
                textTransform: item.label === 'Target Role' ? 'capitalize' : 'none'
              }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ animationDelay: '0.2s' }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '15px', fontWeight: '700',
            marginBottom: '16px', color: 'rgba(255,255,255,0.6)'
          }}>Quick Actions</h3>

          <button className="btn-primary"
            onClick={() => navigate('/interview?role=' + (user?.targetRole || 'fullstack'))}>
            🎯 Start Interview
          </button>

          <button className="btn-primary"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => navigate('/leaderboard')}>
            🏆 View Leaderboard
          </button>

          <button className="btn-danger" onClick={() => {
            logout()
            navigate('/login')
          }}>
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile