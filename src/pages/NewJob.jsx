import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { customers, jobs } from '../services/api'

export default function NewJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [customersList, setCustomersList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(true)
  const [customer, setCustomer] = useState({ id: null, first_name: '', last_name: '', phone: '', email: '' })
  const [job, setJob] = useState({ property_address_line1: '', property_city: '', property_state: '', property_zip: '', is_insurance_job: false, claim_number: '', deductible: '' })

  useEffect(() => {
    if (searchQuery.length > 1 && !isNewCustomer) {
      customers.list({ search: searchQuery, limit: 10 }).then(res => { setCustomersList(res.data.customers || []); setShowSearch(true) }).catch(() => {})
    }
  }, [searchQuery, isNewCustomer])

  function selectCustomer(c) {
    setCustomer({ id: c.id, first_name: c.first_name, last_name: c.last_name, phone: c.phone || '', email: c.email || '' })
    setJob({ ...job, property_address_line1: c.address_line1 || '', property_city: c.city || '', property_state: c.state || '', property_zip: c.zip_code || '' })
    setSearchQuery(c.first_name + ' ' + c.last_name)
    setShowSearch(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (isNewCustomer && (!customer.first_name || !customer.last_name)) { alert('Enter customer name'); return }
    if (!isNewCustomer && !customer.id) { alert('Select a customer'); return }
    setLoading(true)
    try {
      let customerId = customer.id
      if (isNewCustomer) {
        const customerRes = await customers.create({ first_name: customer.first_name, last_name: customer.last_name, phone: customer.phone, email: customer.email, address_line1: job.property_address_line1, city: job.property_city, state: job.property_state, zip_code: job.property_zip })
        customerId = customerRes.data.id
      }
      const jobData = { customer_id: customerId, property_address_line1: job.property_address_line1, property_city: job.property_city, property_state: job.property_state, property_zip: job.property_zip, is_insurance_job: job.is_insurance_job }
      if (job.is_insurance_job) { if (job.claim_number) jobData.claim_number = job.claim_number; if (job.deductible) jobData.deductible = parseFloat(job.deductible) }
      const jobRes = await jobs.create(jobData)
      navigate('/jobs/' + jobRes.data.id)
    } catch (error) { alert(error.response?.data?.error || 'Failed to create job') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mb-6"><Link to="/jobs" className="text-blue-600 hover:underline text-sm">← Back to Jobs</Link></div>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Job</h1>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="flex gap-4 mb-4">
              <button type="button" onClick={() => { setIsNewCustomer(true); setCustomer({ id: null, first_name: '', last_name: '', phone: '', email: '' }) }} className={'px-4 py-2 rounded-lg ' + (isNewCustomer ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700')}>New Customer</button>
              <button type="button" onClick={() => setIsNewCustomer(false)} className={'px-4 py-2 rounded-lg ' + (!isNewCustomer ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700')}>Existing Customer</button>
            </div>
            {isNewCustomer ? (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-600 mb-1">First Name *</label><input type="text" value={customer.first_name} onChange={(e) => setCustomer({...customer, first_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Last Name *</label><input type="text" value={customer.last_name} onChange={(e) => setCustomer({...customer, last_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Phone</label><input type="tel" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Email</label><input type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
            ) : (
              <div className="relative">
                <input type="text" placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                {showSearch && customersList.length > 0 && <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1">{customersList.map(c => <div key={c.id} onClick={() => selectCustomer(c)} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"><p className="font-medium">{c.first_name} {c.last_name}</p><p className="text-sm text-gray-500">{c.city}, {c.state}</p></div>)}</div>}
                {customer.id && <div className="mt-2 p-3 bg-blue-50 rounded-lg"><p className="text-blue-800 font-medium">Selected: {customer.first_name} {customer.last_name}</p></div>}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Property Address</h2>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-600 mb-1">Street Address *</label><input type="text" value={job.property_address_line1} onChange={(e) => setJob({...job, property_address_line1: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm text-gray-600 mb-1">City *</label><input type="text" value={job.property_city} onChange={(e) => setJob({...job, property_city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
                <div><label className="block text-sm text-gray-600 mb-1">State *</label><input type="text" value={job.property_state} onChange={(e) => setJob({...job, property_state: e.target.value})} className="w-full px-3 py-2 border rounded-lg" maxLength={2} required /></div>
                <div><label className="block text-sm text-gray-600 mb-1">ZIP *</label><input type="text" value={job.property_zip} onChange={(e) => setJob({...job, property_zip: e.target.value})} className="w-full px-3 py-2 border rounded-lg" maxLength={5} required /></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Insurance Job</h2><label className="flex items-center cursor-pointer"><input type="checkbox" checked={job.is_insurance_job} onChange={(e) => setJob({...job, is_insurance_job: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" /><span className="ml-2 text-gray-700">Yes</span></label></div>
            {job.is_insurance_job && <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-gray-600 mb-1">Claim Number</label><input type="text" value={job.claim_number} onChange={(e) => setJob({...job, claim_number: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm text-gray-600 mb-1">Deductible ($)</label><input type="number" value={job.deductible} onChange={(e) => setJob({...job, deductible: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div></div>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Create Job'}</button>
        </form>
      </div>
    </div>
  )
}
