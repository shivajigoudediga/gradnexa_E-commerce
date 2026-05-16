import { Link, useSearchParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function PaymentFailure() {
  const [params] = useSearchParams()
  const orderNumber = params.get('order')

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="text-center max-w-md">
        <XCircle size={80} className="text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-400 mb-2">Something went wrong with your payment</p>
        {orderNumber && <p className="text-gray-500 font-mono mb-8">Order: {orderNumber}</p>}
        <div className="flex gap-4 justify-center">
          <Link to="/checkout" className="btn-primary">Try Again</Link>
          <Link to="/contact" className="btn-outline">Contact Support</Link>
        </div>
      </div>
    </div>
  )
}
