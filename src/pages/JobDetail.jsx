import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobs, estimates } from '../services/api'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [measurements, setMeasurements] = useState({ total_roof_sqft: '', ridges_lf: '', valleys_lf: '', drip_edge_lf: '', step_flashing_lf: '', ridge_cap_lf: '', starter_lf: '', pitch_predominant: '', stories: '1', pipe_collars_count: '0', chimneys_count: '0', skylights_count: '0', passive_vents_count: '0', power_vents_count: '0', satellites_count: '0', existing_layers: '1' })

  useEffect(() => { fetchJob() }, [id])

  async function fetchJob() {
    try {
      const response = await jobs.get(id)
      setJob(response.data)
      if (response.data.measurements) {
        const m = response.data.measurements
        setMeasurements({ total_roof_sqft: m.total_roof_sqft?.toString() || '', ridges_lf: m.ridges_lf?.toString() || '', valleys_lf: m.valleys_lf?.toString() || '', drip_edge_lf: m.drip_edge_lf?.toString() || '', step_flashing_lf: m.step_flashing_lf?.toString() || '', ridge_cap_lf: m.ridge_cap_lf?.toString() || '', starter_lf: m.starter_lf?.toString() || '', pitch_predominant: m.pitch_predominant || '', stories: m.stories?.toString() || '1', pipe_collars_count: m.pipe_collars_count?.toString() || '0', chimneys_count: m.chimneys_count?.toString() || '0', skylights_count: m.skylights_count?.toString() || '0', passive_vents_count: m.passive_vents_count?.toString() || '0', power_vents_count: m.power_vents_count?.toString() || '0', satellites_count: m.satellites_count?.toString() || '0', existing_layers: m.existing_layers?.toString() || '1' })
      }
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  async function handleSaveMeasurements(e) {
    e.preventDefault()
    setSaving(true)
    try { await jobs.saveMeasurements(id, measurements); await fetchJob(); setShowMeasurements(false) }
    catch (error) { alert('Failed to save measurements') }
    finally { setSaving(false) }
  }

  async function handleGenerateEstimate() {
    setGenerating(true)
    try { await estimates.generate(id, { name: 'Estimate' }); await fetchJob() }
    catch (error) { alert(error.response?.data?.error || 'Failed to generate estimate') }
    finally { setGenerating(false) }
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>
  if (!job) return <div className="text-center py-8 text-gray-500">Job not found</div>

  return (
    <div>
      <div className="mb-6"><Link to="/jobs" className="text-blue-600 hover:underline text-sm">← Back to Jobs</Link></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div><h1 className="text-2xl font-bold text-blue-600">{job.job_number}</h1><p className="text-gray-500">{job.customer_first_name} {job.customer_last_name}</p></div>
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-600">{job.status.replace('_', ' ')}</span>
            </div>
            <p className="text-gray-700">{job.property_address_line1}</p>
            <p className="text-gray-700">{job.property_city}, {job.property_state} {job.property_zip}</p>
            {job.total_estimate > 0 && <div className="mt-4 pt-4 border-t"><p className="text-gray-500 text-sm">Estimate Total</p><p className="text-3xl font-bold text-gray-900">${Number(job.total_estimate).toLocaleString()}</p></div>}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Measurements</h2><button onClick={() => setShowMeasurements(!showMeasurements)} className="text-blue-600 hover:underline text-sm">{job.measurements ? 'Edit' : 'Add Measurements'}</button></div>
            {showMeasurements ? (
              <form onSubmit={handleSaveMeasurements}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {Object.entries({ 'Total Sqft *': 'total_roof_sqft', 'Ridges (LF)': 'ridges_lf', 'Valleys (LF)': 'valleys_lf', 'Drip Edge (LF)': 'drip_edge_lf', 'Ridge Cap (LF)': 'ridge_cap_lf', 'Starter (LF)': 'starter_lf', 'Step Flashing (LF)': 'step_flashing_lf', 'Pitch': 'pitch_predominant', 'Stories': 'stories', 'Pipe Collars': 'pipe_collars_count', 'Chimneys': 'chimneys_count', 'Skylights': 'skylights_count', 'Passive Vents': 'passive_vents_count', 'Power Vents': 'power_vents_count', 'Satellites': 'satellites_count', 'Existing Layers': 'existing_layers' }).map(([label, field]) => (
                    <div key={field}><label className="block text-sm text-gray-600 mb-1">{label}</label><input type={field === 'pitch_predominant' ? 'text' : 'number'} value={measurements[field]} onChange={(e) => setMeasurements({...measurements, [field]: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required={field === 'total_roof_sqft'} /></div>
                  ))}
                </div>
                <div className="flex gap-2"><button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button><button type="button" onClick={() => setShowMeasurements(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Cancel</button></div>
              </form>
            ) : job.measurements ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-2xl font-bold">{Number(job.measurements.total_roof_sqft).toLocaleString()}</p><p className="text-sm text-gray-500">Total Sqft</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-2xl font-bold">{job.measurements.pitch_predominant || '-'}</p><p className="text-sm text-gray-500">Pitch</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-2xl font-bold">{job.measurements.stories || 1}</p><p className="text-sm text-gray-500">Stories</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-2xl font-bold">{job.measurements.existing_layers || 1}</p><p className="text-sm text-gray-500">Layers</p></div>
              </div>
            ) : <p className="text-gray-500">No measurements recorded</p>}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Estimates</h2>{job.measurements && <button onClick={handleGenerateEstimate} disabled={generating} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{generating ? 'Generating...' : 'Generate Estimate'}</button>}</div>
            {job.estimates?.length > 0 ? (
              <div className="space-y-3">{job.estimates.map(est => <div key={est.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"><div><p className="font-medium">{est.name}</p><p className="text-sm text-gray-500">v{est.version}</p></div><p className="text-xl font-bold">${Number(est.subtotal).toLocaleString()}</p></div>)}</div>
            ) : <p className="text-gray-500">{job.measurements ? 'Click "Generate Estimate" to create one.' : 'Add measurements first.'}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Customer</h3>
            <p className="text-gray-900">{job.customer_first_name} {job.customer_last_name}</p>
            {job.customer_phone && <a href={'tel:' + job.customer_phone} className="text-blue-600 hover:underline block mt-2">{job.customer_phone}</a>}
            {job.customer_email && <a href={'mailto:' + job.customer_email} className="text-blue-600 hover:underline block mt-1">{job.customer_email}</a>}
          </div>
        </div>
      </div>
    </div>
  )
}
