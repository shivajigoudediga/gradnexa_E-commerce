import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { n: '1000+', l: 'Happy Customers', desc: 'And growing every drop' },
  { n: '50+', l: 'Unique Designs', desc: 'Across all categories' },
  { n: '4.8★', l: 'Average Rating', desc: 'From verified buyers' },
]

const values = [
  { title: 'Premium Fabric', desc: '100% premium cotton, 180 GSM. Soft, durable, and built to last through every drop.' },
  { title: 'DTF Printing', desc: 'State-of-the-art Direct-to-Film printing. Vibrant colors that don\'t crack or fade.' },
  { title: 'Fast Delivery', desc: 'Ships within 3–5 business days across India via trusted courier partners.' },
  { title: 'Youth Culture', desc: 'Built for anime fans, developers, and streetwear heads. Express who you are.' },
]

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: '80px' }}>

      {/* Hero */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--gray-3)',
        padding: 'clamp(3rem, 8vw, 7rem) 2rem',
      }}>
        {/* BG accent */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(232,240,60,0.07) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span style={{
              display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: '1.5rem',
              padding: '0.25rem 0.75rem',
              border: '1px solid rgba(232,240,60,0.3)',
              borderRadius: '4px', background: 'rgba(232,240,60,0.05)',
            }}>Our Story</span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="about-hero-grid">
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  fontWeight: 900, lineHeight: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  color: 'var(--white)',
                  marginBottom: '2rem',
                }}>
                  WEAR<br />
                  YOUR<br />
                  <span style={{ color: 'var(--accent)' }}>VIBE.</span>
                </h1>
                <Link to="/shop" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.9rem 2rem',
                  background: 'var(--accent)', color: 'var(--black)',
                  fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                  fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.1em', borderRadius: '6px',
                  textDecoration: 'none', transition: 'opacity 0.2s',
                }}>
                  Shop Now →
                </Link>
              </div>

              <div>
                <p style={{
                  fontSize: '1.15rem', lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '1.5rem',
                }}>
                  GradNexa Wear is a premium custom fashion brand built for the youth who dare to express themselves.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.4)' }}>
                  We specialize in DTF printed anime tees, oversized streetwear, coding-themed apparel, and motivational quote designs — crafted with precision and shipped with pride.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderBottom: '1px solid var(--gray-3)', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '2.5rem 2rem',
                borderRight: i < 2 ? '1px solid var(--gray-3)' : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 900, color: 'var(--accent)',
                letterSpacing: '-0.02em', lineHeight: 1,
                marginBottom: '0.5rem',
              }}>{s.n}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.l}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem', borderBottom: '1px solid var(--gray-3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }} className="about-mission-grid">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              02 — Mission
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900, textTransform: 'uppercase',
              color: 'var(--white)', lineHeight: 0.95,
              marginTop: '1rem',
            }}>OUR<br /><span style={{ color: 'var(--accent)' }}>MISSION.</span></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p style={{ fontSize: '1.3rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
              To make premium custom fashion accessible to everyone. Whether you are an anime fan, a developer, or a streetwear enthusiast —
            </p>
            <p style={{ fontSize: '1.3rem', lineHeight: 1.65, color: 'var(--accent)', fontWeight: 700, marginTop: '1rem' }}>
              wear your vibe with GradNexa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values grid */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              03 — What We Stand For
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900, textTransform: 'uppercase',
              color: 'var(--white)', lineHeight: 0.95, marginTop: '1rem',
            }}>WHY<br /><span style={{ color: 'var(--accent)' }}>GRADNEXA.</span></h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', border: '1px solid var(--gray-3)', borderRadius: '12px', overflow: 'hidden' }} className="about-values-grid">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '2.5rem',
                  background: 'var(--black-2)',
                  borderRight: i % 2 === 0 ? '1px solid var(--gray-3)' : 'none',
                  borderBottom: i < 2 ? '1px solid var(--gray-3)' : 'none',
                  transition: 'background 0.2s',
                }}
                whileHover={{ background: 'var(--black-3)' }}
              >
                <div style={{
                  width: '36px', height: '3px',
                  background: 'var(--accent)', borderRadius: '2px',
                  marginBottom: '1.25rem',
                }} />
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                  fontWeight: 900, textTransform: 'uppercase',
                  color: 'var(--white)', letterSpacing: '0.02em',
                  marginBottom: '0.75rem',
                }}>{v.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 2rem 4rem',
        maxWidth: '1200px',
        marginLeft: 'auto', marginRight: 'auto',
        padding: '4rem 3rem',
        background: 'var(--accent)',
        borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '2rem',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900, textTransform: 'uppercase',
            color: 'var(--black)', lineHeight: 0.95,
          }}>READY TO<br />DROP?</h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', marginTop: '0.75rem', fontWeight: 500 }}>
            Browse our latest collection and find your vibe.
          </p>
        </div>
        <Link to="/shop" style={{
          padding: '1rem 2.5rem',
          background: 'var(--black)', color: 'var(--accent)',
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '0.1em', borderRadius: '8px',
          textDecoration: 'none', whiteSpace: 'nowrap',
          transition: 'opacity 0.2s',
        }}>
          Shop Collection →
        </Link>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .about-mission-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}