import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const fields = [
  { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'Jordan', half: true },
  { key: 'lastName',  label: 'Last Name',  type: 'text', placeholder: 'Lee',    half: true },
  { key: 'email',    label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
  { key: 'phone',    label: 'Phone (optional)', type: 'tel', placeholder: '+91 98765 43210' },
  { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters', minLength: 6, required: true },
]

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Welcome to GradNexa.')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    if (p.length < 6) return 1
    if (p.length < 10) return 2
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return 4
    return 3
  })()

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#e03f3f', '#e8a83c', '#8bc34a', 'var(--accent)']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--black)', overflow: 'hidden', position: 'relative' }}>

      {/* Left panel */}
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
        className="register-left-panel"
      >
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div style={{
          position: 'absolute', top: '-80px', right: '-100px',
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '100px', left: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--white)'
            }}>GradNexa</span>
            <span style={{
              fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.35em',
              textTransform: 'uppercase', color: 'var(--accent)'
            }}>Wear</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
              fontWeight: 900, lineHeight: 0.92, textTransform: 'uppercase',
              letterSpacing: '-0.02em', color: 'var(--white)', marginBottom: '1.5rem'
            }}>
              JOIN<br />
              THE<br />
              <span style={{ color: 'var(--accent)' }}>CREW.</span>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
              Members get exclusive drops first.
            </p>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          {[
            ['✦', 'Early access to limited drops'],
            ['✦', 'Member-only discounts'],
            ['✦', 'Order tracking & history'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{icon}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.04em' }}>{text}</span>
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
          width: '500px', flexShrink: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '3rem 3.5rem',
          overflowY: 'auto', background: 'var(--black)',
        }}
        className="register-right-panel"
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span style={{
              display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)',
              marginBottom: '0.75rem', padding: '0.25rem 0.7rem',
              border: '1px solid rgba(232,240,60,0.3)', borderRadius: '4px',
              background: 'rgba(232,240,60,0.05)'
            }}>New Member</span>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1,
              color: 'var(--white)', marginTop: '0.75rem'
            }}>
              CREATE<br />ACCOUNT.
            </h1>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}
          >
            {['firstName', 'lastName'].map((key, i) => {
              const f = fields.find(x => x.key === key)
              return (
                <div key={key}>
                  <label style={{
                    display: 'block', fontSize: '0.62rem', fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: focused === key ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
                    marginBottom: '0.4rem', transition: 'color 0.2s'
                  }}>{f.label}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    placeholder={f.placeholder}
                    required
                    style={{
                      width: '100%', padding: '0.85rem 1rem',
                      background: focused === key ? 'rgba(232,240,60,0.04)' : 'var(--black-3)',
                      border: `1px solid ${focused === key ? 'var(--accent)' : 'var(--gray-3)'}`,
                      borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                      fontSize: '0.88rem', outline: 'none', transition: 'all 0.2s',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
              )
            })}
          </motion.div>

          {/* Other fields */}
          {['email', 'phone'].map((key, i) => {
            const f = fields.find(x => x.key === key)
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                style={{ marginBottom: '0.85rem' }}
              >
                <label style={{
                  display: 'block', fontSize: '0.62rem', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: focused === key ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
                  marginBottom: '0.4rem', transition: 'color 0.2s'
                }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  placeholder={f.placeholder}
                  required={key !== 'phone'}
                  style={{
                    width: '100%', padding: '0.85rem 1rem',
                    background: focused === key ? 'rgba(232,240,60,0.04)' : 'var(--black-3)',
                    border: `1px solid ${focused === key ? 'var(--accent)' : 'var(--gray-3)'}`,
                    borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                    fontSize: '0.88rem', outline: 'none', transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </motion.div>
            )
          })}

          {/* Password field */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}
            style={{ marginBottom: '0.5rem' }}
          >
            <label style={{
              display: 'block', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: focused === 'password' ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
              marginBottom: '0.4rem', transition: 'color 0.2s'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '0.85rem 3.5rem 0.85rem 1rem',
                  background: focused === 'password' ? 'rgba(232,240,60,0.04)' : 'var(--black-3)',
                  border: `1px solid ${focused === 'password' ? 'var(--accent)' : 'var(--gray-3)'}`,
                  borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                  fontSize: '0.88rem', outline: 'none', transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  transition: 'color 0.2s', fontFamily: 'var(--font-body)'
                }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Strength meter */}
            {form.password && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: i <= strength ? strengthColors[strength] : 'var(--gray-3)',
                      transition: 'background 0.3s'
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.65rem', color: strengthColors[strength], fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {strengthLabels[strength]}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.76 }} style={{ marginTop: '1.25rem' }}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              style={{
                width: '100%', padding: '1rem',
                background: loading ? 'rgba(232,240,60,0.5)' : 'var(--accent)',
                color: 'var(--black)', fontFamily: 'var(--font-display)',
                fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.1em', borderRadius: 'var(--radius-sm)',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)',
                      borderTopColor: 'var(--black)', borderRadius: '50%', display: 'inline-block'
                    }}
                  />
                  Creating Account...
                </>
              ) : 'Create Account →'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', marginTop: '1.5rem' }}
        >
          Already a member?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--white)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '1px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
          >
            Sign in
          </Link>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', marginTop: '1.25rem', lineHeight: 1.6, letterSpacing: '0.03em' }}
        >
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .register-left-panel { display: none !important; }
          .register-right-panel { width: 100% !important; padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}