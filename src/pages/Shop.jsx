import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronRight, Search } from 'lucide-react'
import { productService } from '../services/productService'
import api from '../utils/api'
import ProductCard from '../components/products/ProductCard'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const trending = searchParams.get('trending') || ''
  const page = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    api.get('/categories')
      .then((r) => {
        const data = r.data?.data || r.data || []
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, size: 12, sortBy: 'createdAt', sortDir: 'desc' }
    if (category) params.categorySlug = category
    if (search) params.search = search
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (trending) params.trending = true

    productService.getProducts(params)
      .then((r) => {
        // Handle multiple response shapes
        const data = r.data?.data || r.data || {}
        const content = data?.content || data?.products || (Array.isArray(data) ? data : [])
        setProducts(content)
        setTotalPages(data?.totalPages || 0)
        setTotalElements(data?.totalElements || content.length || 0)
      })
      .catch(() => {
        setProducts([])
        setTotalElements(0)
      })
      .finally(() => setLoading(false))
  }, [category, search, minPrice, maxPrice, trending, page])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    setSearchParams(params)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams)
    if (minPriceInput) params.set('minPrice', minPriceInput)
    else params.delete('minPrice')
    if (maxPriceInput) params.set('maxPrice', maxPriceInput)
    else params.delete('maxPrice')
    params.delete('page')
    setSearchParams(params)
  }

  const clearAllFilters = () => {
    setSearchParams({})
    setMinPriceInput('')
    setMaxPriceInput('')
  }

  const activeCategory = categories.find(c => c.slug === category)
  const pageTitle = search ? `"${search}"` : activeCategory?.name || 'All Products'
  const hasFilters = category || search || minPrice || maxPrice || trending

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: '80px' }}>

      {/* Hero bar */}
      <div style={{
        borderBottom: '1px solid var(--gray-3)',
        padding: '2rem 0',
        background: 'var(--black-2)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>
                  GradNexa Wear
                </span>
                <ChevronRight size={10} color='var(--accent)' />
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  {pageTitle}
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                color: 'var(--white)',
              }}>
                {pageTitle}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!loading && (
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                  {totalElements} {totalElements === 1 ? 'product' : 'products'}
                </span>
              )}
              {hasFilters && (
                <button onClick={clearAllFilters} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--accent)',
                  background: 'rgba(232,240,60,0.08)', border: '1px solid rgba(232,240,60,0.25)',
                  borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => updateFilter('category', '')}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: !category ? '1px solid var(--accent)' : '1px solid var(--gray-3)',
                background: !category ? 'var(--accent)' : 'transparent',
                color: !category ? 'var(--black)' : 'rgba(255,255,255,0.5)',
              }}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => updateFilter('category', c.slug)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: category === c.slug ? '1px solid var(--accent)' : '1px solid var(--gray-3)',
                  background: category === c.slug ? 'var(--accent)' : 'transparent',
                  color: category === c.slug ? 'var(--black)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Sidebar Filters */}
        <aside style={{
          width: '220px',
          flexShrink: 0,
          position: 'sticky',
          top: '100px',
        }} className="shop-sidebar">
          <div style={{
            background: 'var(--black-2)',
            border: '1px solid var(--gray-3)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                Filters
              </span>
              <SlidersHorizontal size={14} color="rgba(255,255,255,0.3)" />
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-3)' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>
                Price Range (₹)
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  style={{
                    flex: 1, padding: '0.6rem 0.75rem',
                    background: 'var(--black-3)', border: '1px solid var(--gray-3)',
                    borderRadius: '6px', color: 'var(--white)', fontSize: '0.8rem',
                    outline: 'none', fontFamily: 'var(--font-body)',
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  style={{
                    flex: 1, padding: '0.6rem 0.75rem',
                    background: 'var(--black-3)', border: '1px solid var(--gray-3)',
                    borderRadius: '6px', color: 'var(--white)', fontSize: '0.8rem',
                    outline: 'none', fontFamily: 'var(--font-body)',
                  }}
                />
              </div>
              <button
                onClick={applyPriceFilter}
                style={{
                  width: '100%', padding: '0.55rem',
                  background: 'var(--accent)', color: 'var(--black)',
                  border: 'none', borderRadius: '6px',
                  fontSize: '0.65rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'var(--font-display)',
                }}
              >
                Apply
              </button>
            </div>

            {/* Trending toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <div
                onClick={() => updateFilter('trending', trending ? '' : 'true')}
                style={{
                  width: '36px', height: '20px',
                  background: trending ? 'var(--accent)' : 'var(--gray-3)',
                  borderRadius: '100px', position: 'relative',
                  cursor: 'pointer', transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: '3px',
                  left: trending ? '19px' : '3px',
                  width: '14px', height: '14px',
                  background: trending ? 'var(--black)' : 'rgba(255,255,255,0.4)',
                  borderRadius: '50%', transition: 'left 0.2s',
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: trending ? 'var(--white)' : 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                Trending Only
              </span>
            </label>
          </div>
        </aside>

        {/* Products grid */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="shop-filter-mobile-btn"
            style={{
              display: 'none',
              alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              border: '1px solid var(--gray-3)',
              borderRadius: '6px',
              background: 'var(--black-2)',
              color: 'var(--white)',
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', marginBottom: '1.5rem',
            }}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: 'var(--black-2)',
                  borderRadius: 'var(--radius)',
                  aspectRatio: '3/4',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  border: '1px solid var(--gray-3)',
                }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '6rem 2rem' }}
            >
              <div style={{
                width: '80px', height: '80px', margin: '0 auto 1.5rem',
                background: 'var(--black-2)', border: '1px solid var(--gray-3)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Search size={32} color="rgba(255,255,255,0.2)" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem',
                fontWeight: 900, textTransform: 'uppercase',
                color: 'var(--white)', marginBottom: '0.5rem',
              }}>No Products Found</h3>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Try adjusting your filters or browse all products
              </p>
              <button
                onClick={clearAllFilters}
                style={{
                  padding: '0.8rem 2rem',
                  background: 'var(--accent)', color: 'var(--black)',
                  border: 'none', borderRadius: '6px',
                  fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                  fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.1em', cursor: 'pointer',
                }}
              >
                View All Products
              </button>
            </motion.div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
              }}>
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter('page', i.toString())}
                      style={{
                        width: '40px', height: '40px',
                        borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.2s',
                        border: page === i ? 'none' : '1px solid var(--gray-3)',
                        background: page === i ? 'var(--accent)' : 'var(--black-2)',
                        color: page === i ? 'var(--black)' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .shop-sidebar { display: none !important; }
          .shop-filter-mobile-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .shop-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}