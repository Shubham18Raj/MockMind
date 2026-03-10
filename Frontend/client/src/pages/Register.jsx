import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', college: '', targetRole: 'fullstack'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerUser(formData)
      login(res.data, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float1 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(30px,-30px); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-30px,30px); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .reg-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px 14px 46px;
          color: white;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s;
        }
        .reg-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.2); }
        .reg-select {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s;
          cursor: pointer;
        }
        .reg-select:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .reg-select option { background: #1a1a2e; }
        .reg-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 4px;
        }
        .reg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .reg-label {
          display: block;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .input-wrap {
          position: relative;
          margin-bottom: 14px;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          pointer-events: none;
        }
        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .role-btn {
          padding: 10px 8px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .role-btn:hover {
          border-color: rgba(99,102,241,0.4);
          color: rgba(255,255,255,0.7);
        }
        .role-btn.active {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.12);
          color: #a5b4fc;
          font-weight: 600;
        }
        .grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }
        .card { animation: slideUp 0.5s ease forwards; }
        .step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }
        .step-dot.active { background: #6366f1; }
      `}</style>

      {/* Background */}
      <div className="grid-bg" />
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        top: '-150px', right: '-100px',
        animation: 'float1 12s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        bottom: '-100px', left: '-80px',
        animation: 'float2 10s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Form Card */}
      <div className="card" style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '36px',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧠</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '26px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '6px'
            }}>Join MockMind</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
              Start your interview prep journey today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
              padding: '11px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>⚠️ {error}</div>
          )}

          {/* Name */}
          <label className="reg-label">Full Name</label>
          <div className="input-wrap">
            <span className="input-icon">👤</span>
            <input className="reg-input" type="text" name="name"
              value={formData.name} onChange={handleChange} placeholder="Shubham Raj" />
          </div>

          {/* Email */}
          <label className="reg-label">Email Address</label>
          <div className="input-wrap">
            <span className="input-icon">✉️</span>
            <input className="reg-input" type="email" name="email"
              value={formData.email} onChange={handleChange} placeholder="you@email.com" />
          </div>

          {/* Password */}
          <label className="reg-label">Password</label>
          <div className="input-wrap">
            <span className="input-icon">🔒</span>
            <input className="reg-input" type="password" name="password"
              value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
          </div>

          {/* College */}
          <label className="reg-label">College Name</label>
          <div className="input-wrap">
            <span className="input-icon">🎓</span>
            <input className="reg-input" type="text" name="college"
              value={formData.college} onChange={handleChange} placeholder="Your College" />
          </div>

          {/* Target Role */}
          <label className="reg-label">Target Role</label>
          <div className="role-grid">
            {[
              { value: 'frontend', label: '🎨 Frontend' },
              { value: 'backend', label: '⚙️ Backend' },
              { value: 'fullstack', label: '🚀 Full Stack' },
              { value: 'hr', label: '🤝 HR Round' }
            ].map(role => (
              <button
                key={role.value}
                className={`role-btn ${formData.targetRole === role.value ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, targetRole: role.value })}
                type="button"
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button className="reg-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>

          {/* Login link */}
          <p style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '13px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register