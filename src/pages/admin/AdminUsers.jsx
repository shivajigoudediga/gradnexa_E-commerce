import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    adminService.getUsers().then((r) => setUsers(r.data.data || []))
  }, [])

  const toggleBlock = async (id) => {
    try {
      await adminService.toggleBlockUser(id)
      toast.success('User updated')
      const res = await adminService.getUsers()
      setUsers(res.data.data || [])
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Users</h1>
      <div className="card-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#262626]">
            <tr className="text-gray-400">
              <th className="p-4 text-left">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#262626]/50">
                <td className="p-4">{u.firstName} {u.lastName}</td>
                <td className="p-4 text-center text-gray-400">{u.email}</td>
                <td className="p-4 text-center">{u.role}</td>
                <td className="p-4 text-center">
                  <span className={u.blocked ? 'text-red-400' : 'text-green-400'}>{u.blocked ? 'Blocked' : 'Active'}</span>
                </td>
                <td className="p-4 text-center">
                  {u.role !== 'ROLE_ADMIN' && (
                    <button onClick={() => toggleBlock(u.id)} className="text-sm text-purple-400 hover:underline">
                      {u.blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
