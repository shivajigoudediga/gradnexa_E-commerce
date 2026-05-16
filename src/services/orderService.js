import api from '../utils/api'

export const orderService = {
  checkout: (data) => api.post('/orders/checkout', data),
  getOrders: () => api.get('/orders'),
  getOrder: (orderNumber) => api.get(`/orders/${orderNumber}`),
  createPayment: (orderNumber) => api.post(`/payments/create/${orderNumber}`),
  verifyPayment: (data) => api.post('/payments/verify', data),
}
