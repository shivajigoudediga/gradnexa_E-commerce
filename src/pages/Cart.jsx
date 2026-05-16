import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

const SHIPPING_FEE = 99
const FREE_SHIPPING = 999

export default function Cart() {
  const { items, fetchCart, updateQuantity, removeItem, cartTotal } = useCart()

  useEffect(() => { fetchCart() }, [])

  const shipping = cartTotal >= FREE_SHIPPING ? 0 : (items.length > 0 ? SHIPPING_FEE : 0)
  const total = cartTotal + shipping
  const freeShippingProgress = Math.min((cartTotal / FREE_SHIPPING) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="cart-empty-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="cart-empty-box"
        >
          <div className="cart-empty-icon">
            <ShoppingBag size={36} />
          </div>
          <h2 className="cart-empty-title">Your cart is empty</h2>
          <p className="cart-empty-sub">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-hero-primary">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">

        {/* Header */}
        <div className="cart-header">
          <div>
            <p className="section-eyebrow">Your Bag</p>
            <h1 className="cart-title">Shopping Cart</h1>
          </div>
          <span className="cart-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        {/* Free shipping bar */}
        {cartTotal < FREE_SHIPPING && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cart-shipping-bar"
          >
            <div className="cart-shipping-bar-top">
              <Truck size={14} />
              <span>
                Add <strong>{formatPrice(FREE_SHIPPING - cartTotal)}</strong> more for free shipping
              </span>
            </div>
            <div className="cart-shipping-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="cart-shipping-fill"
              />
            </div>
          </motion.div>
        )}
        {cartTotal >= FREE_SHIPPING && (
          <div className="cart-shipping-bar cart-shipping-bar--free">
            <Truck size={14} />
            <span>🎉 You've unlocked <strong>free shipping!</strong></span>
          </div>
        )}

        <div className="cart-grid">
          {/* Items */}
          <div className="cart-items">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="cart-item"
                >
                  {/* Image */}
                  <div className="cart-item-img-wrap">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="cart-item-img"
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-body">
                    <div className="cart-item-top">
                      <div>
                        <h3 className="cart-item-name">{item.productName}</h3>
                        <div className="cart-item-meta">
                          <span className="cart-item-tag">{item.size}</span>
                          <span className="cart-item-tag">{item.color}</span>
                        </div>
                      </div>
                      <p className="cart-item-line-total">{formatPrice(item.total)}</p>
                    </div>

                    <div className="cart-item-bottom">
                      <p className="cart-item-unit-price">{formatPrice(item.price)} / each</p>
                      <div className="cart-item-actions">
                        {/* Qty */}
                        <div className="cart-qty">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="cart-qty-btn"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={13} />
                          </motion.button>
                          <span className="cart-qty-num">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="cart-qty-btn"
                          >
                            <Plus size={13} />
                          </motion.button>
                        </div>
                        {/* Remove */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="cart-remove-btn"
                        >
                          <Trash2 size={14} />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link to="/shop" className="cart-continue">
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="cart-summary-wrap">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="cart-summary"
            >
              <h3 className="cart-summary-title">Order Summary</h3>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'cart-free-label' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span>Tax</span>
                  <span className="cart-tax-note">Included</span>
                </div>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* Coupon */}
              <div className="cart-coupon">
                <Tag size={14} />
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="cart-coupon-input"
                />
                <button className="cart-coupon-btn">Apply</button>
              </div>

              <Link to="/checkout" className="btn-hero-primary cart-checkout-btn">
                Proceed to Checkout
                <ArrowRight size={17} />
              </Link>

              {/* Trust */}
              <div className="cart-trust">
                <span>🔒 Secure checkout</span>
                <span>·</span>
                <span>Easy returns</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}