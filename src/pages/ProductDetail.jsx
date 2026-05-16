import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star, Truck, Shield, Minus, Plus } from 'lucide-react'
import { productService } from '../services/productService'
import api from '../utils/api'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/products/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    productService.getProduct(id).then((r) => {
      const p = r.data.data
      setProduct(p)
      setSize(p.sizes?.[0] || 'M')
      setColor(p.colors?.[0] || 'Black')
      if (p.categoryId) {
        productService.getRelated(id, p.categoryId).then((res) => setRelated(res.data.data || []))
      }
    }).catch(() => navigate('/shop'))

    api.get(`/reviews/product/${id}`).then((r) => setReviews(r.data.data || [])).catch(() => {})
  }, [id])

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, size, color, quantity)
    if (success) navigate('/cart')
  }

  const handleBuyNow = async () => {
    const success = await addToCart(product.id, size, color, quantity)
    if (success) navigate('/checkout')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Login to leave a review'); return }
    try {
      await api.post(`/reviews/product/${id}`, reviewForm)
      const res = await api.get(`/reviews/product/${id}`)
      setReviews(res.data.data || [])
      setReviewForm({ rating: 5, comment: '' })
      toast.success('Review submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600']

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div>
            <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 group">
              <img src={images[selectedImage]} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-purple-500' : 'border-[#262626]'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-purple-400 text-sm mb-2">{product.categoryName}</p>
            <h1 className="text-3xl font-bold font-[Space_Grotesk] mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
              ))}</div>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">{product.description}</p>

            {/* Size */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${size === s ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-[#262626] hover:border-purple-500/50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${color === c ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-[#262626] hover:border-purple-500/50'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border border-[#262626] rounded-lg hover:border-purple-500">
                  <Minus size={16} />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 border border-[#262626] rounded-lg hover:border-purple-500">
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-500">{product.stockQuantity} in stock</span>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-outline flex-1">Buy Now</button>
              <button onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full border transition-colors ${isInWishlist(product.id) ? 'border-red-500 text-red-500' : 'border-[#262626] hover:border-purple-500'}`}>
                <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3"><Truck size={16} className="text-purple-400" /> {product.shippingInfo}</div>
              <div className="flex items-center gap-3"><Shield size={16} className="text-purple-400" /> Fabric: {product.fabric}</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Reviews ({reviews.length})</h2>
          {user && (
            <form onSubmit={submitReview} className="card-dark p-6 mb-8">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: r })}>
                    <Star size={20} className={r <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                  </button>
                ))}
              </div>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience..." className="input-dark mb-4 h-24 resize-none" required />
              <button type="submit" className="btn-primary text-sm py-2">Submit Review</button>
            </form>
          )}
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="card-dark p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{r.userName}</span>
                  <div className="flex">{[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}</div>
                </div>
                <p className="text-gray-400 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
