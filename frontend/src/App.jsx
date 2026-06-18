import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'

function OnboardingGate() {
  const { onboardingDone, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  if (onboardingDone) return <Navigate to="/home" replace />
  return <Onboarding />
}

function RootRedirect() {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  const done = localStorage.getItem('onboardingDone') === 'true'
  return <Navigate to={done ? '/home' : '/onboarding'} replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingGate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
