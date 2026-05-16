import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'support@gradnexa.com', sub: 'We reply within 24 hours' },
  { icon: Phone, label: 'Call Us', value: '+91 7036585943', sub: ' 24/7 IST' },
  { icon: MapPin, label: 'Based In', value: 'India', sub: 'Shipping pan-India' },
  { icon: Clock, label: 'Business Hours', value: 'Mon – Sun', sub: '24/7 PM IST' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [focused, setFocused] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.9rem 1.1rem',
    background: focused === field ? 'rgba(232,240,60,0.04)' : 'var(--black-3)',
    border: `1px solid ${focused === field ? 'var(--accent)' : 'var(--gray-3)'}`,
    borderRadius: '8px',
    color: 'var(--white)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  })

  const labelStyle = (field) => ({
    display: 'block',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: focused === field ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
    marginBottom: '0.5rem',
    transition: 'color 0.2s',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: '80px' }}>

      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--gray-3)',
        padding: 'clamp(3rem, 6vw, 5rem) 2rem',
        background: 'var(--black-2)',
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <div style={{
          position: 'absolute', bottom: '-120px', right: '-60px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span style={{
              display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: '1rem',
              padding: '0.25rem 0.75rem',
              border: '1px solid rgba(232,240,60,0.3)',
              borderRadius: '4px', background: 'rgba(232,240,60,0.05)',
            }}>Get In Touch</span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 900, lineHeight: 0.9,
              textTransform: 'uppercase',
              color: 'var(--white)',
            }}>
              LET'S<br />
              <span style={{ color: 'var(--accent)' }}>TALK.</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', marginTop: '1.5rem', maxWidth: '480px', lineHeight: 1.7 }}>
              Questions about your order, custom designs, or just want to say hi? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }} className="contact-grid">

          {/* Left — Info */}
          <div>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                fontWeight: 900, textTransform: 'uppercase',
                color: 'var(--white)', marginBottom: '2rem',
              }}>Contact Info</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contactInfo.map(({ icon: Icon, label, value, sub }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '1.25rem',
                      background: 'var(--black-2)',
                      border: '1px solid var(--gray-3)',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', flexShrink: 0,
                      background: 'rgba(232,240,60,0.08)',
                      border: '1px solid rgba(232,240,60,0.2)',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color="var(--accent)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>{label}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.15rem' }}>{value}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div style={{
              background: 'var(--black-2)',
              border: '1px solid var(--gray-3)',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                fontWeight: 900, textTransform: 'uppercase',
                color: 'var(--white)', marginBottom: '0.5rem',
              }}>Send a Message</h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem' }}>
                Fill in the form and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="contact-name-email">
                  <div>
                    <label style={labelStyle('name')}>Your Name</label>
                    <input
                      type="text"
                      placeholder="Shivaji"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      required
                      style={inputStyle('name')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle('email')}>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      required
                      style={inputStyle('email')}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={labelStyle('subject')}>Subject</label>
                  <input
                    type="text"
                    placeholder="Order inquiry, custom design, etc."
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('subject')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle('message')}>Message</label>
                  <textarea
                    placeholder="Tell us what's on your mind..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    required
                    rows={5}
                    style={{ ...inputStyle('message'), resize: 'none' }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  style={{
                    width: '100%', padding: '1rem',
                    background: loading ? 'rgba(232,240,60,0.5)' : 'var(--accent)',
                    color: 'var(--black)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem', fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    borderRadius: '8px', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '0.5rem',
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 16, height: 16,
                          border: '2px solid rgba(0,0,0,0.3)',
                          borderTopColor: 'var(--black)',
                          borderRadius: '50%', display: 'inline-block',
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 500px) {
          .contact-name-email { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}