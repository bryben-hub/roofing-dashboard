import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/jobs', label: 'Jobs', icon: '📋' },
  { path: '/customers', label: 'Customers', icon: '👥' }
]

export default function Layout() {
  const { user, organization, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6 border-b"><h1 className="text-xl font-bold text-blue-600">RoofPro</h1><p className="text-sm text-gray-500 truncate">{organization?.name}</p></div>
        <nav className="p-4">{navItems.map(item => <Link key={item.path} to={item.path} className={'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 ' + (location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50')}><span>{item.icon}</span><span>{item.label}</span></Link>)}</nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t"><div className="flex items-center justify-between"><div><p className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</p><p className="text-sm text-gray-500">{user?.role}</p></div><button onClick={logout} className="text-gray-500 hover:text-gray-700" title="Sign out">🚪</button></div></div>
      </div>
      <div className="ml-64 p-8"><Outlet /></div>
    </div>
  )
}
