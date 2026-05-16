import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'
  const defaultSize = product.sizes?.[0] || 'M'
  const defaultColor = product.colors?.[0] || 'Black'
  const inWishlist = isInWishlist(product.id)
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ delay: index * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="product-card"
    >
      {/* Image */}
      <div className="product-card-media">
        <Link to={`/product/${product.id}`}>
          <img
            src={image}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="product-card-badges">
          {product.trending && (
            <span className="product-badge product-badge--hot">HOT</span>
          )}
          {discount && (
            <span className="product-badge product-badge--sale">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleWishlist(product.id)}
          className={`product-wish-btn ${inWishlist ? 'product-wish-btn--active' : ''}`}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick add — slides up on hover */}
        <div className="product-quick-add">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => addToCart(product.id, defaultSize, defaultColor)}
            className="btn-quick-add"
          >
            <ShoppingBag size={15} />
            Quick Add
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card-info">
        <p className="product-card-category">{product.categoryName}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>

        <div className="product-card-rating">
          <div className="product-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="product-review-count">({product.reviewCount})</span>
        </div>

        <div className="product-card-price">
          <span className="product-price-main">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="product-price-compare">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}