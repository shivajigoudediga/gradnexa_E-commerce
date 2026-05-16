import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/products/ProductCard'

export default function Wishlist() {
  const { items, fetchWishlist } = useWishlist()

  useEffect(() => { fetchWishlist() }, [])

  return (
    <div className="wishlist-page">
      <style>{`
        .wishlist-page {
          min-height: 100vh;
          padding-top: 96px;
          padding-bottom: 80px;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background glow */
        .wishlist-page::before {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(220, 38, 38, 0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .wishlist-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .wishlist-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
          gap: 16px;
        }

        .wishlist-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .wishlist-heart-icon {
          width: 48px;
          height: 48px;
          background: rgba(220, 38, 38, 0.12);
          border: 1px solid rgba(220, 38, 38, 0.25);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wishlist-heart-icon svg {
          width: 22px;
          height: 22px;
          fill: #dc2626;
          color: #dc2626;
        }

        .wishlist-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .wishlist-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 100px;
          letter-spacing: 0.01em;
          font-family: 'Space Grotesk', sans-serif;
        }

        .wishlist-count-badge span {
          display: inline-block;
          width: 7px;
          height: 7px;
          background: #dc2626;
          border-radius: 50%;
        }

        .wishlist-shop-link {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.01em;
        }

        .wishlist-shop-link:hover {
          color: rgba(255,255,255,0.8);
        }

        .wishlist-shop-link svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }

        .wishlist-shop-link:hover svg {
          transform: translateX(3px);
        }

        /* Grid */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          animation: gridFadeIn 0.5s ease both;
        }

        @media (min-width: 640px) {
          .wishlist-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
        }

        @media (min-width: 1024px) {
          .wishlist-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
        }

        @keyframes gridFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Empty state */
        .wishlist-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 24px;
          text-align: center;
          animation: gridFadeIn 0.5s ease both;
        }

        .wishlist-empty-icon {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 32px;
        }

        .wishlist-empty-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(220, 38, 38, 0.15);
          animation: pulseRing 2.5s ease-in-out infinite;
        }

        .wishlist-empty-ring:nth-child(2) {
          inset: -16px;
          border-color: rgba(220, 38, 38, 0.08);
          animation-delay: 0.4s;
        }

        .wishlist-empty-ring:nth-child(3) {
          inset: -32px;
          border-color: rgba(220, 38, 38, 0.04);
          animation-delay: 0.8s;
        }

        .wishlist-empty-core {
          position: absolute;
          inset: 0;
          background: rgba(220, 38, 38, 0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .wishlist-empty-core svg {
          width: 40px;
          height: 40px;
          fill: rgba(220, 38, 38, 0.5);
        }

        @keyframes pulseRing {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.04); }
        }

        .wishlist-empty-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .wishlist-empty-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.35);
          margin: 0 0 36px;
          max-width: 320px;
          line-height: 1.6;
        }

        .wishlist-empty-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dc2626;
          color: #fff;
          text-decoration: none;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 12px;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s;
        }

        .wishlist-empty-cta:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .wishlist-empty-cta svg {
          width: 18px;
          height: 18px;
        }

        /* Bottom continue shopping bar */
        .wishlist-footer-bar {
          margin-top: 56px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .wishlist-footer-text {
          font-size: 14px;
          color: rgba(255,255,255,0.3);
          font-family: 'Space Grotesk', sans-serif;
        }

        .wishlist-continue-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f87171;
          text-decoration: none;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 20px;
          border: 1px solid rgba(220, 38, 38, 0.25);
          border-radius: 10px;
          background: rgba(220, 38, 38, 0.06);
          transition: all 0.2s;
        }

        .wishlist-continue-btn:hover {
          background: rgba(220, 38, 38, 0.12);
          border-color: rgba(220, 38, 38, 0.4);
        }

        .wishlist-continue-btn svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }

        .wishlist-continue-btn:hover svg {
          transform: translateX(3px);
        }
      `}</style>

      <div className="wishlist-container">

        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-title-group">
            <div className="wishlist-heart-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h1 className="wishlist-title">My Wishlist</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {items.length > 0 && (
              <div className="wishlist-count-badge">
                <span></span>
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </div>
            )}
            <Link to="/shop" className="wishlist-shop-link">
              Browse shop
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <div className="wishlist-empty-ring"></div>
              <div className="wishlist-empty-ring"></div>
              <div className="wishlist-empty-ring"></div>
              <div className="wishlist-empty-core">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            <h2 className="wishlist-empty-title">Nothing saved yet</h2>
            <p className="wishlist-empty-sub">
              Tap the heart on any product to save it here. Your wishlist is waiting.
            </p>
            <Link to="/shop" className="wishlist-empty-cta">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-grid">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>

            <div className="wishlist-footer-bar">
              <p className="wishlist-footer-text">
                {items.length} {items.length === 1 ? 'product' : 'products'} in your wishlist
              </p>
              <Link to="/shop" className="wishlist-continue-btn">
                Continue shopping
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}