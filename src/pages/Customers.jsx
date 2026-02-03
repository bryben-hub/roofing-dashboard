import { useState, useEffect } from 'react'
import { customers } from '../services/api'

export default function Customers() {
  const [customersList, setCustomersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', address_line1: '', city: '', state: '', zip_code: '' })

  useEffect(() => { fetchCustomers() }, [])

  async function fetchCustomers() {
    try { const params = search ? { search } : {}; const response = await customers.list(params); setCustomersList(response.data.customers || []) }
    catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try { await customers.create(formData); setShowModal(false); setFormData({ first_name: '', last_name: '', email: '', phone: '', address_line1: '', city: '', state: '', zip_code: '' }); fetchCustomers() }
    catch (error) { alert(error.response?.data?.error || 'Failed to create customer') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-gray-900">Customers</h1><button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ New Customer</button></div>
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b"><div className="flex gap-4"><input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={fetchCustomers} className="bg-gray-100 px-4 py-2 rounded-lg">Search</button></div></div>
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : customersList.length === 0 ? <div className="p-8 text-center text-gray-500">No customers found</div> : (
          <div className="divide-y">{customersList.map(c => <div key={c.id} className="p-4 hover:bg-gray-50"><p className="font-medium text-gray-900">{c.first_name} {c.last_name}</p>{c.phone && <p className="text-sm text-gray-500">{c.phone}</p>}{c.email && <p className="text-sm text-gray-500">{c.email}</p>}{c.city && <p className="text-sm text-gray-500">{c.city}, {c.state}</p>}</div>)}</div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4"><input type="text" placeholder="First Name *" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="px-3 py-2 border rounded-lg" required /><input type="text" placeholder="Last Name *" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="px-3 py-2 border rounded-lg" required /></div>
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-4" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-4" />
              <input type="text" placeholder="Address" value={formData.address_line1} onChange={(e) => setFormData({...formData, address_line1: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-4" />
              <div className="grid grid-cols-3 gap-4 mb-4"><input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="px-3 py-2 border rounded-lg" /><input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="px-3 py-2 border rounded-lg" maxLength={2} /><input type="text" placeholder="ZIP" value={formData.zip_code} onChange={(e) => setFormData({...formData, zip_code: e.target.value})} className="px-3 py-2 border rounded-lg" maxLength={5} /></div>
              <div className="flex gap-2"><button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Save</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
