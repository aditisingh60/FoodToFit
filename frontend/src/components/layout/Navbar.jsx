import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-lg">🥗</span>
            </div>
            <span className="text-lg font-bold text-slate-900">FoodToFit</span>
          </Link>
          <nav className="flex gap-4 border-l border-slate-200 pl-6">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tracker"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              Tracker
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              Blog
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            Account
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
