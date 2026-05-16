import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, RefreshCw,
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { formatPrice } from '../../utils/format'

/* ── tiny sparkline svg ── */
function Sparkline({ data = [], color = '#e8f03c' }) {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 32
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── status badge ── */
function StatusBadge({ status }) {
  const map = {
    PENDING:    { label: 'Pending',    color: '#e8a23c', bg: 'rgba(232,162,60,0.1)',  icon: Clock },
    CONFIRMED:  { label: 'Confirmed',  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  icon: AlertCircle },
    SHIPPED:    { label: 'Shipped',    color: '#a855f7', bg: 'rgba(168,85,247,0.1)',  icon: ArrowUpRight },
    DELIVERED:  { label: 'Delivered',  color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   icon: CheckCircle },
    CANCELLED:  { label: 'Cancelled',  color: '#e03f3f', bg: 'rgba(224,63,63,0.1)',   icon: XCircle },
  }
  const s = map[status] || { label: status, color: '#888', bg: 'rgba(136,136,136,0.1)', icon: Clock }
  const Icon = s.icon
  return (
    <span className="adm-status-badge" style={{ color: s.color, background: s.bg }}>
      <Icon size={10} />
      {s.label}
    </span>
  )
}

/* ── mini bar chart ── */
function MiniBarChart({ data = [], color = '#e8f03c' }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="adm-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="adm-bar-col">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="adm-bar"
            style={{
              height: `${Math.max((d.value / max) * 100, 4)}%`,
              background: color,
              opacity: 0.3 + (d.value / max) * 0.7,
              transformOrigin: 'bottom'
            }}
          />
          <span className="adm-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const r = await adminService.getDashboard()
      setStats(r.data.data)
      setLastUpdated(new Date())
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // auto-refresh every 30s
    const interval = setInterval(() => fetchStats(true), 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  if (loading) {
    return (
      <div className="adm-loading">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="adm-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    )
  }

  // build sparkline mock from stats (real data would come from API)
  const revSparkline = [40, 55, 35, 70, 45, 90, stats?.monthlyRevenue > 0 ? 100 : 60]
  const orderSparkline = [3, 7, 5, 12, 8, 15, stats?.totalOrders || 8]

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      sub: 'All time',
      icon: TrendingUp,
      color: '#e8f03c',
      sparkline: revSparkline,
      trend: '+12.5%',
      up: true,
    },
    {
      label: 'Monthly Revenue',
      value: formatPrice(stats?.monthlyRevenue || 0),
      sub: 'This month',
      icon: TrendingUp,
      color: '#22c55e',
      sparkline: revSparkline.map(v => v * 0.6),
      trend: '+8.2%',
      up: true,
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      sub: 'All time',
      icon: ShoppingCart,
      color: '#3b82f6',
      sparkline: orderSparkline,
      trend: '+5.1%',
      up: true,
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      sub: 'Registered',
      icon: Users,
      color: '#a855f7',
      sparkline: [1, 2, 2, 3, 3, 4, stats?.totalUsers || 4],
      trend: '+2.3%',
      up: true,
    },
    {
      label: 'Products',
      value: stats?.totalProducts ?? 0,
      sub: 'In catalogue',
      icon: Package,
      color: '#e8a23c',
      sparkline: [5, 8, 8, 10, 12, 12, stats?.totalProducts || 12],
      trend: 'Active',
      up: null,
    },
  ]

  // monthly bar data (mock — swap with real API data when available)
  const monthlyBars = [
    { label: 'Jan', value: 32 }, { label: 'Feb', value: 48 },
    { label: 'Mar', value: 41 }, { label: 'Apr', value: 65 },
    { label: 'May', value: 58 }, { label: 'Jun', value: 72 },
    { label: 'Jul', value: 55 }, { label: 'Aug', value: 80 },
    { label: 'Sep', value: 62 }, { label: 'Oct', value: 91 },
    { label: 'Nov', value: 78 }, { label: 'Dec', value: 95 },
  ]

  const recentOrders = stats?.recentOrders || []
  const topProducts  = stats?.topProducts  || []

  return (
    <div className="adm-dashboard">
      {/* Header row */}
      <div className="adm-dash-header">
        <div>
          <h1 className="adm-dash-title">Dashboard</h1>
          {lastUpdated && (
            <p className="adm-dash-updated">
              Last updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchStats(true)}
          className={`adm-refresh-btn ${refreshing ? 'adm-refresh-btn--spinning' : ''}`}
          disabled={refreshing}
        >
          <RefreshCw size={15} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="adm-stat-grid">
        {statCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="adm-stat-card"
            style={{ '--accent-color': c.color }}
          >
            <div className="adm-stat-top">
              <div className="adm-stat-icon-wrap" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                <c.icon size={16} style={{ color: c.color }} />
              </div>
              {c.up !== null ? (
                <span className={`adm-trend ${c.up ? 'adm-trend--up' : 'adm-trend--down'}`}>
                  {c.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {c.trend}
                </span>
              ) : (
                <span className="adm-trend adm-trend--neutral">{c.trend}</span>
              )}
            </div>
            <div className="adm-stat-value">{c.value}</div>
            <div className="adm-stat-label">{c.label}</div>
            <div className="adm-stat-sub">{c.sub}</div>
            <div className="adm-stat-sparkline">
              <Sparkline data={c.sparkline} color={c.color} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + tables row */}
      <div className="adm-mid-grid">
        {/* Revenue bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="adm-card adm-card--chart"
        >
          <div className="adm-card-header">
            <div>
              <h3 className="adm-card-title">Revenue Overview</h3>
              <p className="adm-card-sub">Monthly performance</p>
            </div>
            <span className="adm-card-badge">2026</span>
          </div>
          <MiniBarChart data={monthlyBars} color="#e8f03c" />
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.55 }}
          className="adm-card"
        >
          <div className="adm-card-header">
            <div>
              <h3 className="adm-card-title">Top Products</h3>
              <p className="adm-card-sub">By units sold</p>
            </div>
          </div>
          {topProducts.length === 0 ? (
            <div className="adm-empty">No product data yet</div>
          ) : (
            <div className="adm-top-products">
              {topProducts.map((p, i) => {
                const maxSold = topProducts[0]?.soldCount || 1
                return (
                  <div key={i} className="adm-top-product-row">
                    <span className="adm-top-product-rank">#{i + 1}</span>
                    <div className="adm-top-product-info">
                      <p className="adm-top-product-name">{p.name}</p>
                      <div className="adm-top-product-bar-wrap">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.soldCount / maxSold) * 100}%` }}
                          transition={{ delay: 0.6 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="adm-top-product-bar"
                        />
                      </div>
                    </div>
                    <span className="adm-top-product-count">{p.soldCount} sold</span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.55 }}
        className="adm-card"
      >
        <div className="adm-card-header">
          <div>
            <h3 className="adm-card-title">Recent Orders</h3>
            <p className="adm-card-sub">Latest transactions</p>
          </div>
          <a href="/admin/orders" className="adm-view-all">View all →</a>
        </div>
        {recentOrders.length === 0 ? (
          <div className="adm-empty">No orders yet — share your store link!</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.05 }}
                  >
                    <td className="adm-order-num">{o.orderNumber || `#ORD-${String(i + 1).padStart(4, '0')}`}</td>
                    <td className="adm-order-customer">{o.customerName || o.customer || '—'}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="adm-order-date">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                    </td>
                    <td className="adm-order-amount">{formatPrice(o.total || 0)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}