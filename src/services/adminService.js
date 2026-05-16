import api from '../utils/api'

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  getUsers: () => api.get('/admin/users'),
  toggleBlockUser: (id) => api.patch(`/admin/users/${id}/block`),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
}
