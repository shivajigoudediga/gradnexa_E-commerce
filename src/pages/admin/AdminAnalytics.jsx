import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { adminService } from '../../services/adminService'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    adminService.getDashboard().then((r) => setStats(r.data.data)).catch(() => {})
  }, [])

  if (!stats) return <div className="animate-pulse h-64 bg-[#141414] rounded-2xl" />

  const salesData = stats.monthlySales?.map((m) => ({
    month: m.month?.substring(0, 3),
    revenue: parseFloat(m.revenue || 0),
    orders: m.orders,
  })) || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-dark p-6">
          <h3 className="font-semibold mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#141414', border: '1px solid #262626' }} />
              <Bar dataKey="revenue" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-dark p-6">
          <h3 className="font-semibold mb-6">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#141414', border: '1px solid #262626' }} />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
