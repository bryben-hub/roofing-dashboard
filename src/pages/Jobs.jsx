import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../services/api'

const statusColors = { lead: 'bg-gray-100 text-gray-600', measuring: 'bg-blue-100 text-blue-600', estimating: 'bg-yellow-100 text-yellow-600', proposal_sent: 'bg-purple-100 text-purple-600', sold: 'bg-green-100 text-green-600', complete: 'bg-emerald-100 text-emerald-600', cancelled: 'bg-red-100 text-red-600' }

export default function Jobs() {
  const [jobsList, setJobsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('active')

  useEffect(() => { fetchJobs() }, [filter])

  async function fetchJobs() {
    setLoading(true)
    try {
      const params = { status: filter, limit: 100 }
      if (search) params.search = search
      const response = await jobs.list(params)
      setJobsList(response.data.jobs || [])
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-gray-900">Jobs</h1><Link to="/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ New Job</Link></div>
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={(e) => { e.preventDefault(); fetchJobs() }} className="flex gap-4">
            <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg"><option value="active">Active</option><option value="all">All</option><option value="lead">Lead</option><option value="measuring">Measuring</option><option value="estimating">Estimating</option><option value="sold">Sold</option><option value="complete">Complete</option></select>
            <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">Search</button>
          </form>
        </div>
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : jobsList.length === 0 ? <div className="p-8 text-center text-gray-500">No jobs found</div> : (
          <div className="divide-y divide-gray-200">
            {jobsList.map(job => (
              <Link key={job.id} to={'/jobs/' + job.id} className="block p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <div><p className="font-medium text-blue-600">{job.job_number}</p><p className="text-gray-900">{job.customer_first_name} {job.customer_last_name}</p><p className="text-gray-500 text-sm">{job.property_address_line1}, {job.property_city}</p></div>
                  <div className="text-right"><span className={'px-3 py-1 rounded-full text-xs font-medium ' + (statusColors[job.status] || 'bg-gray-100')}>{job.status.replace('_', ' ')}</span>{job.total_estimate > 0 && <p className="text-gray-900 font-medium mt-2">${Number(job.total_estimate).toLocaleString()}</p>}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
