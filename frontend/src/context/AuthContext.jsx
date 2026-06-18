import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getProfile } from '../api/user.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })
  const [profile, setProfile] = useState(null)
  const [macros, setMacros] = useState(null)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const data = await getProfile()
      setProfile(data.profile)
      setMacros(data.macros)
      setOnboardingDone(data.onboardingDone)
      localStorage.setItem('onboardingDone', String(data.onboardingDone))
    } catch (err) {
      if (err.message === 'Profile not found') {
        setOnboardingDone(false)
        localStorage.setItem('onboardingDone', 'false')
        setProfile(null)
        setMacros(null)
      } else {
        const cached = localStorage.getItem('profile')
        if (cached) {
          const parsed = JSON.parse(cached)
          setProfile(parsed.profile)
          setMacros(parsed.macros)
          setOnboardingDone(parsed.onboardingDone ?? true)
        } else {
          setOnboardingDone(localStorage.getItem('onboardingDone') === 'true')
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const login = (authData) => {
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData.user))
    localStorage.setItem('onboardingDone', String(authData.onboardingDone))
    setUser(authData.user)
    setOnboardingDone(authData.onboardingDone)
    if (authData.onboardingDone) {
      loadProfile()
    } else {
      setProfile(null)
      setMacros(null)
      setLoading(false)
    }
  }

  const completeOnboarding = (data) => {
    setProfile(data.profile)
    setMacros(data.macros)
    setOnboardingDone(true)
    localStorage.setItem('onboardingDone', 'true')
    localStorage.setItem('profile', JSON.stringify(data))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('onboardingDone')
    localStorage.removeItem('profile')
    setUser(null)
    setProfile(null)
    setMacros(null)
    setOnboardingDone(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        macros,
        onboardingDone,
        loading,
        login,
        logout,
        completeOnboarding,
        loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
