import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [formData, setFormData] = useState({ company_name: '', first_name: '', last_name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">RoofPro</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Company Name</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block text-gray-700 text-sm font-medium mb-2">First Name</label><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required /></div>
            <div><label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required /></div>
          </div>
          <div className="mb-4"><label className="block text-gray-700 text-sm font-medium mb-2">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required /></div>
          <div className="mb-4"><label className="block text-gray-700 text-sm font-medium mb-2">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
          <div className="mb-4"><label className="block text-gray-700 text-sm font-medium mb-2">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required minLength={6} /></div>
          <div className="mb-6"><label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required /></div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className="text-center text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
