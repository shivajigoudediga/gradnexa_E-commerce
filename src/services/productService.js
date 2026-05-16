import api from '../utils/api'

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getRelated: (id, categoryId) => api.get(`/products/${id}/related`, { params: { categoryId } }),
  getSuggestions: (q) => api.get('/products/search/suggestions', { params: { q } }),
}
