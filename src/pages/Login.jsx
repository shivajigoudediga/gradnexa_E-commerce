import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success('Welcome back!')
      navigate(isAdmin || user.role === 'ROLE_ADMIN' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--black)', overflow: 'hidden', position: 'relative' }}>

      {/* Left panel — brand visual */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex: '1 1 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem',
          position: 'relative',
          background: 'var(--black-2)',
          borderRight: '1px solid var(--gray-3)',
          overflow: 'hidden',
        }}
        className="login-left-panel"
      >
        {/* Grid background */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

        {/* Accent blobs */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '0', left: '-100px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.07) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--white)'
            }}>GradNexa</span>
            <span style={{
              fontSize: '0.5rem',
              fontWeight: 700,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--accent)'
            }}>Wear</span>
          </div>
        </div>

        {/* Center tagline */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: 'var(--white)',
              marginBottom: '1.5rem'
            }}>
              WEAR<br />
              <span style={{ color: 'var(--accent)' }}>YOUR</span><br />
              VIBE.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
              Premium streetwear. Delivered.
            </p>
          </motion.div>
        </div>

        {/* Bottom stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '2.5rem' }}
        >
          {[['10K+', 'Styles'], ['50+', 'Brands'], ['Free', 'Returns']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>{num}</div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '480px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem 3.5rem',
          position: 'relative',
          background: 'var(--black)',
        }}
        className="login-right-panel"
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span style={{
              display: 'inline-block',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.75rem',
              padding: '0.25rem 0.7rem',
              border: '1px solid rgba(232,240,60,0.3)',
              borderRadius: '4px',
              background: 'rgba(232,240,60,0.05)'
            }}>Member Access</span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              color: 'var(--white)',
              marginTop: '0.75rem'
            }}>
              SIGN<br />IN.
            </h1>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Email field */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ position: 'relative' }}
          >
            <label style={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: focused === 'email' ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
              marginBottom: '0.5rem',
              transition: 'color 0.2s'
            }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '0.9rem 1.1rem',
                background: focused === 'email' ? 'rgba(232,240,60,0.04)' : 'var(--black-3)',
                border: `1px solid ${focused === 'email' ? 'var(--accent)' : 'var(--gray-3)'}`,
                borderRadius: 'var(--radius-sm)',
                color: 'var(--white)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
              }}
            />
          </motion.div>

          {/* Password field */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ position: 'relative' }}
          >
            <label style={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: focused === 'password' ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
              marginBottom: '0.5rem',
              transition: 'color 0.2s'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.9rem 3rem 0.9rem 1.1rem',
                  background: focused === 'password' ? 'rgba(232,240,60,0.04)' : 'var(--black-3)',
                  border: `1px solid ${focused === 'password' ? 'var(--accent)' : 'var(--gray-3)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--white)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  transition: 'color 0.2s', fontFamily: 'var(--font-body)'
                }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: '0.5rem' }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? 'rgba(232,240,60,0.5)' : 'var(--accent)',
                color: 'var(--black)',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'var(--black)', borderRadius: '50%', display: 'inline-block' }}
                  />
                  Signing In...
                </>
              ) : 'Sign In →'}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--gray-3)' }} />
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-3)' }} />
        </motion.div>

        {/* Register link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}
        >
          New here?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--white)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '1px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
          >
            Create an account
          </Link>
        </motion.p>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{
            marginTop: '2rem',
            padding: '0.9rem 1.1rem',
            background: 'var(--black-3)',
            border: '1px solid var(--gray-3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace',
            letterSpacing: '0.02em'
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-body)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.6rem' }}>Demo</span>
          <br />
          user@gradnexa.com · user123
        </motion.div>
      </motion.div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}