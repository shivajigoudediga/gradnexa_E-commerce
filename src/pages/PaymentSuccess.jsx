import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const orderNumber = params.get('order')

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
        <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-2">Thank you for your order</p>
        {orderNumber && <p className="text-purple-400 font-mono mb-8">Order: {orderNumber}</p>}
        <div className="flex gap-4 justify-center">
          <Link to="/orders" className="btn-primary">View Orders</Link>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  )
}
