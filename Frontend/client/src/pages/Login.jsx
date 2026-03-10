import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(formData)
      login(res.data, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .orb1 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: float1 12s ease-in-out infinite;
          pointer-events: none;
        }
        .orb2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: float2 10s ease-in-out infinite;
          pointer-events: none;
        }
        .orb3 {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: float1 15s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .card {
          animation: slideIn 0.6s ease forwards;
        }
        .input-wrap {
          position: relative;
          margin-bottom: 16px;
        }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px 16px 16px 48px;
          color: white;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          font-size: 18px;
          pointer-events: none;
        }
        .btn-primary {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          background-size: 200% 200%;
          color: white;
          font-size: 16px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(rgba(255,255,255,0.1), transparent);
          transform: rotate(45deg) translateY(-100%);
          transition: transform 0.4s ease;
        }
        .btn-primary:hover::after {
          transform: rotate(45deg) translateY(100%);
        }
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }
        .label {
          display: block;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse 2s ease infinite;
        }
      `}</style>

      {/* Background effects */}
      <div className="grid-bg" />
      <div className="orb1" />
      <div className="orb2" />
      <div className="orb3" />

      {/* Left Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        zIndex: 1,
        display: window.innerWidth < 768 ? 'none' : 'flex'
      }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))'
          }}>🧠</div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '52px',
            fontWeight: '800',
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            Ace every<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>interview.</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '17px',
            lineHeight: '1.7',
            marginBottom: '40px'
          }}>
            Practice with AI, get instant feedback, and land your dream job with MockMind.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { value: '501+', label: 'Questions' },
              { value: 'AI', label: 'Feedback' },
              { value: '∞', label: 'Practice' }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '28px',
                  fontWeight: '800',
                  color: 'white'
                }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="card" style={{ width: '100%' }}>

          {/* Card container */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)'
          }}>
            {/* Badge */}
            <div className="badge">
              <div className="badge-dot" />
              MockMind
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '8px'
            }}>Sign in</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '28px' }}>
              Continue your interview preparation
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>⚠️ {error}</div>
            )}

            {/* Email */}
            <label className="label">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input
                className="input-field"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
              />
            </div>

            {/* Password */}
            <label className="label">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                className="input-field"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign in →'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '24px 0'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Register link */}
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', textAlign: 'center' }}>
              New to MockMind?{' '}
              <Link to="/register" style={{
                color: '#818cf8',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Create account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login