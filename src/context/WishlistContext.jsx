import { createContext, useContext, useState, useCallback } from 'react'
import { wishlistService } from '../services/wishlistService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const { user } = useAuth()

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return }
    try {
      const res = await wishlistService.getWishlist()
      if (res.data.success) setItems(res.data.data || [])
    } catch { setItems([]) }
  }, [user])

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error('Please login first'); return }
    const exists = items.some((p) => p.id === productId)
    try {
      if (exists) {
        await wishlistService.remove(productId)
        setItems((prev) => prev.filter((p) => p.id !== productId))
        toast.success('Removed from wishlist')
      } else {
        await wishlistService.add(productId)
        await fetchWishlist()
        toast.success('Added to wishlist!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist update failed')
    }
  }

  const isInWishlist = (productId) => items.some((p) => p.id === productId)

  return (
    <WishlistContext.Provider value={{ items, fetchWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
