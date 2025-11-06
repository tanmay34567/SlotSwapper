import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Calendar, ArrowLeftRight, Bell, LogOut } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 animate-fade-in">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <ArrowLeftRight className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SlotSwapper</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center space-x-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">My Events</span>
              </NavLink>

              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <ArrowLeftRight className="w-5 h-5" />
                <span className="font-medium">Marketplace</span>
              </NavLink>

              <NavLink
                to="/requests"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium">Requests</span>
              </NavLink>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
