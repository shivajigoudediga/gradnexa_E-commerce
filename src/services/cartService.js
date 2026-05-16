import api from '../utils/api'

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateQuantity: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/cart/${id}`),
  getTotal: () => api.get('/cart/total'),
}
