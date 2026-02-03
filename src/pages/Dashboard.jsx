import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../services/api'
import { useAuth } from '../context/AuthContext'

const statusColors = { lead: 'bg-gray-100 text-gray-600', measuring: 'bg-blue-100 text-blue-600', estimating: 'bg-yellow-100 text-yellow-600', proposal_sent: 'bg-purple-100 text-purple-600', sold: 'bg-green-100 text-green-600', complete: 'bg-emerald-100 text-emerald-600', cancelled: 'bg-red-100 text-red-600' }

export default function Dashboard() {
  const { organization } = useAuth()
  const [recentJobs, setRecentJobs] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, value: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const response = await jobs.list({ limit: 10 })
      const jobsList = response.data.jobs || []
      setRecentJobs(jobsList)
      const active = jobsList.filter(j => !['complete', 'cancelled'].includes(j.status)).length
      const value = jobsList.reduce((sum, j) => sum + (parseFloat(j.total_estimate) || 0), 0)
      setStats({ total: jobsList.length, active, value })
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1><p className="text-gray-500">{organization?.name}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500 text-sm">Total Jobs</p><p className="text-3xl font-bold text-gray-900">{stats.total}</p></div>
        <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500 text-sm">Active Jobs</p><p className="text-3xl font-bold text-blue-600">{stats.active}</p></div>
        <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500 text-sm">Pipeline Value</p><p className="text-3xl font-bold text-green-600">${stats.value.toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center"><h2 className="text-lg font-semibold">Recent Jobs</h2><Link to="/jobs" className="text-blue-600 hover:underline text-sm">View all</Link></div>
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : recentJobs.length === 0 ? <div className="p-8 text-center text-gray-500">No jobs yet. <Link to="/jobs/new" className="text-blue-600 hover:underline">Create your first job</Link></div> : (
          <div className="divide-y divide-gray-200">
            {recentJobs.map(job => (
              <Link key={job.id} to={'/jobs/' + job.id} className="block p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <div><p className="font-medium text-blue-600">{job.job_number}</p><p className="text-gray-900">{job.customer_first_name} {job.customer_last_name}</p><p className="text-gray-500 text-sm">{job.property_address_line1}</p></div>
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
