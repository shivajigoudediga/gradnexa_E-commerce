import { createContext, useContext, useState, useCallback } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return }
    try {
      const res = await cartService.getCart()
      if (res.data.success) setItems(res.data.data || [])
    } catch { setItems([]) }
  }, [user])

  const addToCart = async (productId, size, color, quantity = 1) => {
    if (!user) { toast.error('Please login to add items'); return false }
    setLoading(true)
    try {
      await cartService.addToCart({ productId, size, color, quantity })
      await fetchCart()
      toast.success('Added to cart!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, quantity) => {
    try {
      await cartService.updateQuantity(id, quantity)
      await fetchCart()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const removeItem = async (id) => {
    try {
      await cartService.removeItem(id)
      await fetchCart()
      toast.success('Removed from cart')
    } catch (err) {
      toast.error('Remove failed')
    }
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0)

  return (
    <CartContext.Provider value={{
      items, loading, cartCount, cartTotal,
      fetchCart, addToCart, updateQuantity, removeItem,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
