import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { adminService } from '../../services/adminService'
import api from '../../utils/api'
import { formatPrice } from '../../utils/format'
import toast from 'react-hot-toast'

const emptyProduct = {
  name: '', description: '', price: '', compareAtPrice: '', categoryId: '',
  images: [''], sizes: ['S','M','L','XL'], colors: ['Black'],
  fabric: '100% Premium Cotton', shippingInfo: 'Ships in 3-5 days',
  stockQuantity: 10, trending: false, featured: false, active: true,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyProduct)
  const [editId, setEditId] = useState(null)

  const load = () => {
    adminService.getProducts({ size: 50 }).then((r) => setProducts(r.data.data?.content || []))
    api.get('/categories').then((r) => setCategories(r.data.data || []))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyProduct); setEditId(null); setModal(true) }
  const openEdit = (p) => {
    setForm({ ...p, price: p.price, categoryId: p.categoryId, images: p.images?.length ? p.images : [''] })
    setEditId(p.id); setModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const res = await adminService.uploadImage(file)
      setForm({ ...form, images: [res.data.data, ...form.images.filter(Boolean)] })
      toast.success('Image uploaded')
    } catch { toast.error('Upload failed - check Cloudinary config') }
  }

  const handleSave = async () => {
    const data = { ...form, price: parseFloat(form.price), categoryId: parseInt(form.categoryId) }
    try {
      if (editId) await adminService.updateProduct(editId, data)
      else await adminService.createProduct(data)
      toast.success('Product saved')
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await adminService.deleteProduct(id)
    toast.success('Deleted'); load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Product</button>
      </div>
      <div className="card-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#262626]">
            <tr className="text-gray-400">
              <th className="p-4 text-left">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#262626]/50 hover:bg-[#1a1a1a]">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded object-cover" />
                  <span>{p.name}</span>
                </td>
                <td className="p-4 text-center">{formatPrice(p.price)}</td>
                <td className="p-4 text-center">{p.stockQuantity}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => openEdit(p)} className="p-2 hover:text-purple-400"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-red-400"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-dark p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit' : 'Add'} Product</h2>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-dark h-20" />
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-dark" />
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-dark">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="number" placeholder="Stock" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) })} className="input-dark" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-400" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Trending</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="btn-primary flex-1">Save</button>
              <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
