import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, User, Home, Building, Hash,
  Tag, Shield, Truck, ChevronRight, ArrowLeft, Lock
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/orderService'
import { formatPrice } from '../utils/format'
import toast from 'react-hot-toast'

const loadRazorpay = () => new Promise((resolve) => {
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

const FIELDS = [
  { name: 'shippingFullName',     label: 'Full Name',       icon: User,     type: 'text',  required: true,  placeholder: 'Arjun Kumar' },
  { name: 'shippingPhone',        label: 'Phone Number',    icon: Phone,    type: 'tel',   required: true,  placeholder: '+91 98765 43210' },
  { name: 'shippingAddressLine1', label: 'Address Line 1',  icon: Home,     type: 'text',  required: true,  placeholder: 'Flat / House No, Street' },
  { name: 'shippingAddressLine2', label: 'Address Line 2',  icon: Building, type: 'text',  required: false, placeholder: 'Landmark (optional)' },
  { name: 'shippingCity',         label: 'City',            icon: MapPin,   type: 'text',  required: true,  placeholder: 'Hyderabad' },
  { name: 'shippingState',        label: 'State',           icon: MapPin,   type: 'text',  required: true,  placeholder: 'Telangana' },
  { name: 'shippingPostalCode',   label: 'Postal Code',     icon: Hash,     type: 'text',  required: true,  placeholder: '500001' },
]

export default function Checkout() {
  const { items, cartTotal, fetchCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [form, setForm] = useState({
    shippingFullName: '', shippingPhone: '', shippingAddressLine1: '',
    shippingAddressLine2: '', shippingCity: '', shippingState: '',
    shippingPostalCode: '', shippingCountry: 'India',
  })

  useEffect(() => { fetchCart() }, [])

  const shipping = cartTotal >= 999 ? 0 : (items.length > 0 ? 99 : 0)
  const total = cartTotal + shipping

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCoupon = () => {
    if (!coupon.trim()) return
    toast.success('Coupon applied!')
    setCouponApplied(true)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (items.length === 0) { toast.error('Cart is empty'); return }
    setLoading(true)
    try {
      const orderRes = await orderService.checkout({ ...form, couponCode: coupon || undefined })
      const order = orderRes.data.data
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Razorpay failed to load'); return }

      const paymentRes = await orderService.createPayment(order.orderNumber)
      const { razorpayOrderId, amount, currency, keyId, orderNumber } = paymentRes.data.data

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount, currency,
        name: 'GradNexa Wear',
        description: `Order ${orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await orderService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderNumber,
            })
            navigate(`/payment/success?order=${orderNumber}`)
          } catch {
            navigate(`/payment/failure?order=${orderNumber}`)
          }
        },
        prefill: { name: form.shippingFullName, contact: form.shippingPhone },
        theme: { color: '#e8f03c' },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => navigate(`/payment/failure?order=${orderNumber}`))
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="chk-empty">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn-hero-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="chk-page">
      <div className="container">

        {/* Header */}
        <div className="chk-header">
          <Link to="/cart" className="chk-back">
            <ArrowLeft size={15} /> Back to Cart
          </Link>
          <div className="chk-brand">
            <span className="chk-brand-name">GradNexa</span>
            <span className="chk-brand-tag">WEAR</span>
          </div>
          <div className="chk-steps">
            <span className="chk-step chk-step--active">1. Delivery</span>
            <ChevronRight size={14} className="chk-step-arrow" />
            <span className="chk-step">2. Payment</span>
          </div>
        </div>

        <div className="chk-grid">
          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="chk-section-label">
              <MapPin size={16} />
              Delivery Address
            </div>

            <form onSubmit={handlePayment} className="chk-form">
              <div className="chk-fields">
                {FIELDS.map((f, i) => (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`chk-field ${f.name === 'shippingAddressLine1' || f.name === 'shippingAddressLine2' ? 'chk-field--full' : ''}`}
                  >
                    <label className="chk-label">
                      {f.label}
                      {!f.required && <span className="chk-optional"> (optional)</span>}
                    </label>
                    <div className="chk-input-wrap">
                      <f.icon size={15} className="chk-input-icon" />
                      <input
                        name={f.name}
                        type={f.type}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required={f.required}
                        className="chk-input"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Coupon */}
              <div className="chk-coupon-wrap">
                <div className="chk-section-label" style={{ marginBottom: '0.75rem' }}>
                  <Tag size={15} />
                  Coupon Code
                </div>
                <div className="chk-coupon-row">
                  <div className="chk-coupon-input-wrap">
                    <Tag size={14} className="chk-input-icon" />
                    <input
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false) }}
                      placeholder="e.g. GRADNEXA10"
                      className="chk-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCoupon}
                    className={`chk-coupon-btn ${couponApplied ? 'chk-coupon-btn--applied' : ''}`}
                  >
                    {couponApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Pay button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="chk-pay-btn"
              >
                {loading ? (
                  <span className="auth-loading">
                    <span className="auth-spinner" style={{ borderTopColor: '#000' }} />
                    Processing…
                  </span>
                ) : (
                  <>
                    <Lock size={16} />
                    Pay {formatPrice(total)} Securely
                  </>
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="chk-trust">
                <span><Shield size={12} /> 256-bit SSL</span>
                <span><Truck size={12} /> Fast delivery</span>
                <span>🔒 Razorpay secured</span>
              </div>
            </form>
          </motion.div>

          {/* Right — Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="chk-summary">
              <div className="chk-section-label">
                <Hash size={15} />
                Order Summary
                <span className="chk-item-count">{items.length} items</span>
              </div>

              {/* Items */}
              <div className="chk-items">
                {items.map((item) => (
                  <div key={item.id} className="chk-item">
                    <div className="chk-item-img-wrap">
                      <img src={item.productImage} alt={item.productName} className="chk-item-img" />
                      <span className="chk-item-qty">{item.quantity}</span>
                    </div>
                    <div className="chk-item-info">
                      <p className="chk-item-name">{item.productName}</p>
                      <p className="chk-item-meta">{item.size} · {item.color}</p>
                    </div>
                    <p className="chk-item-price">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="chk-totals">
                <div className="chk-total-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="chk-total-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'chk-free' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="chk-total-row chk-total-row--discount">
                    <span>Coupon ({coupon})</span>
                    <span>Applied ✓</span>
                  </div>
                )}
                <div className="chk-total-final">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Delivery note */}
              <div className="chk-delivery-note">
                <Truck size={14} />
                <span>Estimated delivery: <strong>3–5 business days</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}