import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { formatPrice, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const statuses = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    adminService.getOrders().then((r) => setOrders(r.data.data || []))
  }, [])

  const updateStatus = async (id, status, trackingNumber = '') => {
    try {
      await adminService.updateOrderStatus(id, { status, trackingNumber })
      toast.success('Status updated')
      const res = await adminService.getOrders()
      setOrders(res.data.data || [])
    } catch { toast.error('Update failed') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card-dark p-6">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-gray-400">{order.shippingFullName} — {order.shippingPhone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                <p className="text-sm text-gray-500">Payment: {order.paymentStatus}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                className="input-dark py-2 text-sm w-auto">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input placeholder="Tracking number" defaultValue={order.trackingNumber}
                onBlur={(e) => e.target.value && updateStatus(order.id, order.status, e.target.value)}
                className="input-dark py-2 text-sm w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
