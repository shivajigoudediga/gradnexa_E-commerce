import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Heart, User, LogOut, ChevronRight, ShoppingBag, Settings } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  const quickLinks = [
    {
      to: '/orders',
      icon: Package,
      label: 'Order History',
      desc: 'Track and manage your orders',
      badge: null,
    },
    {
      to: '/wishlist',
      icon: Heart,
      label: 'Wishlist',
      desc: 'Your saved products',
      badge: null,
    },
    {
      to: '/shop',
      icon: ShoppingBag,
      label: 'Browse Shop',
      desc: 'Explore latest drops',
      badge: 'New',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: '80px' }}>

      {/* Top hero bar */}
      <div style={{
        borderBottom: '1px solid var(--gray-3)',
        background: 'var(--black-2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <div style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}
          >
            {/* Avatar */}
            <div style={{
              width: '80px', height: '80px', flexShrink: 0,
              background: 'var(--accent)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem', fontWeight: 900,
              color: 'var(--black)',
              border: '3px solid rgba(232,240,60,0.3)',
            }}>
              {initials || <User size={32} color="var(--black)" />}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--accent)', display: 'block', marginBottom: '0.4rem',
              }}>Member Account</span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 900, textTransform: 'uppercase',
                color: 'var(--white)', lineHeight: 1,
                marginBottom: '0.5rem',
              }}>
                {user?.firstName} {user?.lastName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                  {user?.email}
                </span>
                {user?.phone && (
                  <>
                    <span style={{ color: 'var(--gray-3)' }}>·</span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                      {user.phone}
                    </span>
                  </>
                )}
                {joinDate && (
                  <>
                    <span style={{ color: 'var(--gray-3)' }}>·</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                      Member since {joinDate}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'rgba(224,63,63,0.08)',
                border: '1px solid rgba(224,63,63,0.25)',
                borderRadius: '8px',
                color: '#e03f3f',
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={14} /> Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Role badge */}
        {user?.role === 'ROLE_ADMIN' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              background: 'rgba(232,240,60,0.06)',
              border: '1px solid rgba(232,240,60,0.25)',
              borderRadius: '10px', marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={16} color="var(--accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)' }}>
                You have admin access
              </span>
            </div>
            <Link to="/admin" style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              Admin Panel <ChevronRight size={12} />
            </Link>
          </motion.div>
        )}

        {/* Quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {quickLinks.map(({ to, icon: Icon, label, desc, badge }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Link
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1.25rem',
                  padding: '1.5rem',
                  background: 'var(--black-2)',
                  border: '1px solid var(--gray-3)',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(232,240,60,0.3)'
                  e.currentTarget.style.background = 'var(--black-3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--gray-3)'
                  e.currentTarget.style.background = 'var(--black-2)'
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: '48px', height: '48px', flexShrink: 0,
                  background: 'rgba(232,240,60,0.08)',
                  border: '1px solid rgba(232,240,60,0.15)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="var(--accent)" />
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem', fontWeight: 900,
                      textTransform: 'uppercase', color: 'var(--white)',
                    }}>{label}</span>
                    {badge && (
                      <span style={{
                        fontSize: '0.55rem', fontWeight: 800,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        background: 'var(--accent)', color: 'var(--black)',
                        padding: '0.15rem 0.45rem', borderRadius: '3px',
                      }}>{badge}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                </div>

                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Account details card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'var(--black-2)',
            border: '1px solid var(--gray-3)',
            borderRadius: '12px',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem', fontWeight: 900,
            textTransform: 'uppercase', color: 'var(--white)',
            letterSpacing: '0.05em', marginBottom: '1.25rem',
          }}>Account Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="profile-details-grid">
            {[
              { label: 'First Name', value: user?.firstName },
              { label: 'Last Name', value: user?.lastName },
              { label: 'Email', value: user?.email },
              { label: 'Phone', value: user?.phone || '—' },
              { label: 'Role', value: user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Member' },
              { label: 'Member Since', value: joinDate || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: '0.9rem 1rem',
                background: 'var(--black-3)',
                border: '1px solid var(--gray-3)',
                borderRadius: '8px',
              }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.35rem' }}>{label}</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)' }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .profile-details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}