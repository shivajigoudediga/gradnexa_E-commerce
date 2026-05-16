import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Truck, Shield, RefreshCw, Zap } from 'lucide-react'
import { productService } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import Marquee from '../components/ui/Marquee'

const testimonials = [
  { name: 'Arjun K.', text: 'The anime print quality is insane! Best streetwear I have bought online.', rating: 5, avatar: 'AK', tag: 'Anime Tee' },
  { name: 'Priya S.', text: 'Oversized fit is perfect. GradNexa never disappoints.', rating: 5, avatar: 'PS', tag: 'Oversized Drop' },
  { name: 'Rahul M.', text: 'Coding hoodie is my daily wear now. Premium quality fabric.', rating: 5, avatar: 'RM', tag: 'Dev Hoodie' },
]

const categories = [
  { name: 'Anime', slug: 'anime', label: 'Limited Series', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80' },
  { name: 'Streetwear', slug: 'streetwear', label: 'New Season', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80' },
  { name: 'Dev Life', slug: 'coding', label: 'Exclusive Drop', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80' },
  { name: 'Hoodies', slug: 'hoodies', label: 'Premium Blanks', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80' },
]

const gallery = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80',
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
]

function CountUp({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const num = parseInt(end)
    const step = Math.ceil(num / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 180])
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.06])

  useEffect(() => {
    productService.getFeatured().then((r) => setFeatured(r.data.data || [])).catch(() => {})
    productService.getTrending().then((r) => setTrending(r.data.data || [])).catch(() => {})
  }, [])

  return (
    <div className="home-page">

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} className="hero-section">
        <motion.div className="hero-bg-img" style={{ y: heroY, scale: heroScale }}>
          <img
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1600&q=80"
            alt=""
            className="hero-img"
          />
          <div className="hero-img-overlay" />
        </motion.div>

        <div className="hero-content-wrap">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-eyebrow"
          >
            <span className="hero-tag">New Season 2026</span>
            <span className="hero-tag-dot" />
            <span className="hero-tag-sub">DTF Premium Prints</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="hero-headline"
          >
            <span className="hero-headline-thin">Wear</span>
            <br />
            <span className="hero-headline-bold">Your</span>
            <br />
            <em className="hero-headline-italic">Vibe.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="hero-sub"
          >
            Anime tees. Dev hoodies. Streetwear that hits different.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="hero-actions"
          >
            <Link to="/shop" className="btn-hero-primary">
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link to="/shop?category=anime" className="btn-hero-ghost">
              Anime Drop
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="hero-stats"
          >
            {[
              { n: '1000', suffix: '+', l: 'Happy customers' },
              { n: '50', suffix: '+', l: 'Unique designs' },
              { n: '4.8', suffix: '★', l: 'Avg. rating' },
            ].map((s) => (
              <div key={s.l} className="hero-stat">
                <span className="hero-stat-num">
                  <CountUp end={s.n} suffix={s.suffix} />
                </span>
                <span className="hero-stat-label">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="hero-scroll-hint"
        >
          <div className="scroll-line" />
          <span>Scroll</span>
        </motion.div>
      </section>

      {/* ══════════════════ MARQUEE ══════════════════ */}
      <Marquee />

      {/* ══════════════════ CATEGORIES GRID ══════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Collections</p>
              <h2 className="section-title">Shop by Vibe</h2>
            </div>
            <Link to="/shop" className="link-arrow">
              All Collections <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="cat-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`cat-card ${i === 0 ? 'cat-card--tall' : ''}`}
              >
                <Link to={`/shop?category=${cat.slug}`} className="cat-card-inner">
                  <img src={cat.img} alt={cat.name} className="cat-img" loading="lazy" />
                  <div className="cat-overlay" />
                  <div className="cat-content">
                    <span className="cat-label">{cat.label}</span>
                    <h3 className="cat-name">{cat.name}</h3>
                    <span className="cat-cta">
                      Shop <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED PRODUCTS ══════════════════ */}
      <section className="section-pad section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Curated</p>
              <h2 className="section-title">Featured Drops</h2>
            </div>
            <Link to="/shop" className="link-arrow">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BRAND BANNER ══════════════════ */}
      <section className="brand-banner">
        <div className="brand-banner-bg">
          <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1400&q=80" alt="" />
          <div className="brand-banner-overlay" />
        </div>
        <div className="brand-banner-content container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-eyebrow" style={{ color: '#f0f0f0' }}>About GradNexa</p>
            <h2 className="brand-banner-title">
              Born to<br /><em>Express.</em>
            </h2>
            <p className="brand-banner-sub">
              Premium blanks. DTF printing that lasts. Designs that say something.
              We don't do basics — we do statements.
            </p>
            <Link to="/about" className="btn-hero-primary" style={{ marginTop: '2rem' }}>
              Our Story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ TRENDING ══════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Hot Right Now</p>
              <h2 className="section-title">Trending Drops</h2>
            </div>
            <Link to="/shop" className="link-arrow">
              See All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {trending.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TRUST BAR ══════════════════ */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: Truck, title: 'Fast Shipping', desc: 'Pan-India delivery in 3–5 days' },
              { icon: Shield, title: 'Premium Quality', desc: 'DTF prints that last 100+ washes' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day no-questions return policy' },
              { icon: Zap, title: 'Limited Drops', desc: 'Exclusive designs, small batches' },
            ].map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="trust-item"
              >
                <div className="trust-icon-wrap">
                  <f.icon size={22} />
                </div>
                <div>
                  <h4 className="trust-title">{f.title}</h4>
                  <p className="trust-desc">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="section-pad section-dark">
        <div className="container">
          <div className="section-header centered">
            <div>
              <p className="section-eyebrow">Social Proof</p>
              <h2 className="section-title">The Tribe Speaks</h2>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="testimonial-card"
              >
                <div className="testimonial-top">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <span className="testimonial-tag">{t.tag}</span>
                  </div>
                  <div className="testimonial-stars">
                    {'★'.repeat(t.rating)}
                  </div>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ GALLERY ══════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header centered">
            <div>
              <p className="section-eyebrow">Community</p>
              <h2 className="section-title">#GradNexaVibe</h2>
            </div>
          </div>
          <div className="gallery-grid">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04 }}
                className="gallery-item"
              >
                <img src={img} alt="" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ NEWSLETTER ══════════════════ */}
      <section className="newsletter-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="newsletter-box"
          >
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>Stay Connected</p>
            <h2 className="newsletter-title">Drop alerts. First access.<br />10% off your first order.</h2>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="btn-hero-primary">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}