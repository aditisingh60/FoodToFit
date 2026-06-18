import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, onboardingDone, loading } = useAuth()
  const token = localStorage.getItem('token')
  const currentUser = user || getStoredUser()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  if (!currentUser || !token) {
    return <Navigate to="/login" replace />
  }

  if (requireOnboarding && !onboardingDone) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
