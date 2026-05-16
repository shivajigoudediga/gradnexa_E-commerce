import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { formatPrice, formatDate } from '../utils/format'

const statusColors = {
  PENDING: 'text-yellow-400', CONFIRMED: 'text-blue-400', PROCESSING: 'text-purple-400',
  SHIPPED: 'text-cyan-400', DELIVERED: 'text-green-400', CANCELLED: 'text-red-400',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getOrders()
      .then((r) => setOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold font-[Space_Grotesk] mb-8">My Orders</h1>
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card-dark h-24 animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-4">No orders yet</p>
            <Link to="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card-dark p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.total)}</p>
                    <p className={`text-sm ${statusColors[order.status]}`}>{order.status}</p>
                    <p className="text-xs text-gray-500">Payment: {order.paymentStatus}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-gray-400">
                      <img src={item.productImage} alt="" className="w-10 h-10 rounded object-cover" />
                      <span>{item.productName} x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                {order.trackingNumber && (
                  <p className="text-sm text-purple-400 mt-3">Tracking: {order.trackingNumber}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
