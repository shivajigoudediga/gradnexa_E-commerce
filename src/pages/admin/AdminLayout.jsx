import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  BarChart3, Menu, X, LogOut, ExternalLink, Bell
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to)

  const currentPage = links.find((l) => isActive(l))?.label || 'Admin'

  const handleLogout = () => { logout(); navigate('/') }

  const SidebarContent = () => (
    <div className="adm-sidebar-inner">
      {/* Brand */}
      <div className="adm-sidebar-brand">
        <Link to="/" className="adm-brand-logo">
          <span className="adm-brand-name">GradNexa</span>
          <span className="adm-brand-tag">ADMIN</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="adm-nav">
        <p className="adm-nav-label">Main Menu</p>
        {links.map(({ to, icon: Icon, label, exact }) => {
          const active = exact ? location.pathname === to : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`adm-nav-link ${active ? 'adm-nav-link--active' : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {active && <motion.span layoutId="adm-pill" className="adm-nav-pill" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="adm-sidebar-footer">
        <Link to="/" target="_blank" className="adm-footer-link">
          <ExternalLink size={14} />
          View Store
        </Link>
        <button onClick={handleLogout} className="adm-footer-link adm-footer-link--danger">
          <LogOut size={14} />
          Logout
        </button>
        {user && (
          <div className="adm-user-chip">
            <div className="adm-user-avatar">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <p className="adm-user-name">{user.firstName} {user.lastName}</p>
              <p className="adm-user-role">Administrator</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="adm-layout">
      {/* Desktop sidebar */}
      <aside className="adm-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="adm-sidebar-overlay"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="adm-sidebar adm-sidebar--mobile"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="adm-topbar-page">{currentPage}</p>
              <p className="adm-topbar-path">
                Admin / {currentPage}
              </p>
            </div>
          </div>
          <div className="adm-topbar-right">
            <button className="adm-topbar-icon-btn">
              <Bell size={18} />
              <span className="adm-notif-dot" />
            </button>
            <div className="adm-topbar-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}