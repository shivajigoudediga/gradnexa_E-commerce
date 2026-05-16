import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { productService } from '../../services/productService'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Anime', path: '/shop?category=anime' },
  { label: 'Coding', path: '/shop?category=coding' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { user, logout, isAdmin } = useAuth()
  const { cartCount, fetchCart } = useCart()
  const { items: wishlistItems, fetchWishlist } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) { fetchCart(); fetchWishlist() }
  }, [user])

  useEffect(() => {
    if (searchQuery.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const res = await productService.getSuggestions(searchQuery)
          setSuggestions(res.data.data || [])
        } catch { setSuggestions([]) }
      }, 300)
      return () => clearTimeout(timer)
    } else setSuggestions([])
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname + location.search === path

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`navbar ${scrolled ? 'navbar--scrolled' : 'navbar--transparent'}`}
      >
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-main">GradNexa</span>
            <span className="navbar-logo-sub">WEAR</span>
          </Link>

          {/* Desktop nav */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'navbar-link--active' : ''}`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="navbar-link-bar"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="nav-icon-btn"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <Link to="/wishlist" className="nav-icon-btn nav-icon-badge-wrap" aria-label="Wishlist">
              <Heart size={19} />
              {wishlistItems.length > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="nav-badge">
                  {wishlistItems.length}
                </motion.span>
              )}
            </Link>

            <Link to="/cart" className="nav-icon-btn nav-icon-badge-wrap" aria-label="Cart">
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="nav-badge">
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="nav-user-wrap">
                <button className="nav-icon-btn nav-user-btn">
                  <User size={19} />
                </button>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <p className="nav-dropdown-name">{user.firstName}</p>
                    <p className="nav-dropdown-email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="nav-dropdown-item">Profile <ChevronRight size={14} /></Link>
                  <Link to="/orders" className="nav-dropdown-item">Orders <ChevronRight size={14} /></Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-dropdown-item nav-dropdown-item--accent">
                      Admin Panel <ChevronRight size={14} />
                    </Link>
                  )}
                  <button onClick={logout} className="nav-dropdown-item nav-dropdown-item--danger">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-nav-login">Login</Link>
            )}

            <button
              className="nav-icon-btn lg-hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Search panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="navbar-search-panel"
            >
              <form onSubmit={handleSearch} className="navbar-search-form">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime tees, hoodies, dev merch…"
                  className="navbar-search-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="search-close-btn"
                >
                  <X size={18} />
                </button>
              </form>
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="search-suggestions"
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(`/shop?search=${encodeURIComponent(s)}`)
                          setSearchOpen(false)
                        }}
                        className="search-suggestion-item"
                      >
                        <Search size={13} />
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="mobile-overlay"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="mobile-drawer"
            >
              <div className="mobile-drawer-head">
                <span className="navbar-logo-main" style={{ fontSize: '1.25rem' }}>GradNexa</span>
                <button onClick={() => setMenuOpen(false)} className="nav-icon-btn">
                  <X size={22} />
                </button>
              </div>
              <nav className="mobile-nav">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`mobile-nav-link ${isActive(link.path) ? 'mobile-nav-link--active' : ''}`}
                    >
                      {link.label}
                      <ChevronRight size={18} />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              {!user && (
                <div className="mobile-drawer-footer">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-hero-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Login / Register
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}