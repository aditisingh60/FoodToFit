import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { checkServerHealth, login, register } from '../api/auth.api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
)

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
)

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
)

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const EyeOffIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

const MODES = {
  signin: 'signin',
  signup: 'signup',
}

const Login = () => {
  const navigate = useNavigate()
  const { login: authLogin, onboardingDone, user, loading: authLoading } = useAuth()
  const [mode, setMode] = useState(MODES.signup)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverOnline, setServerOnline] = useState(true)

  useEffect(() => {
    checkServerHealth()
      .then(() => setServerOnline(true))
      .catch(() => setServerOnline(false))
  }, [])

  const isSignUp = mode === MODES.signup

  const validate = () => {
    const errors = {}

    if (isSignUp && !name.trim()) {
      errors.name = 'Name is required'
    }

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      const result = isSignUp
        ? await register({ name: name.trim(), email: email.trim(), password })
        : await login({ email: email.trim(), password })

      authLogin(result)
      navigate(result.onboardingDone ? '/home' : '/onboarding')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setFieldErrors({})
  }

  if (!authLoading && user) {
    return <Navigate to={onboardingDone ? '/home' : '/onboarding'} replace />
  }

  return (
    <div className="flex min-h-svh bg-slate-50">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-400" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-14 xl:px-20">
          <div className="mb-8 inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-xl">🥗</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FoodToFit</span>
          </div>

          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Eat smarter.
            <br />
            Live better.
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-emerald-100">
            Track meals, hit your macros, and reach your fitness goals — all in one place.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { value: '10k+', label: 'Foods tracked' },
              { value: '98%', label: 'Goal accuracy' },
              { value: 'Free', label: 'To get started' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 px-14 pb-8 text-sm text-emerald-200/80 xl:px-20">
          Your nutrition journey starts here.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-lg">🥗</span>
            </div>
            <span className="text-lg font-bold text-slate-900">FoodToFit</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                {isSignUp
                  ? 'Start tracking your nutrition today'
                  : 'Sign in to continue your journey'}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              {[
                { key: MODES.signup, label: 'Sign Up' },
                { key: MODES.signin, label: 'Sign In' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchMode(key)}
                  className={[
                    'flex-1 rounded-lg py-2 text-sm font-semibold transition',
                    mode === key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            {!serverOnline && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Backend server is offline. Run{' '}
                <code className="rounded bg-amber-100 px-1">cd backend && npm run dev</code>{' '}
                in a terminal first.
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignUp && (
                <Input
                  id="name"
                  label="Full name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={fieldErrors.name}
                  icon={UserIcon}
                  autoComplete="name"
                  required
                />
              )}

              <Input
                id="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                icon={MailIcon}
                autoComplete="email"
                required
              />

              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                icon={LockIcon}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="rounded-lg p-1 text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isSignUp ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : (
                  isSignUp ? 'Create account' : 'Sign in'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? MODES.signin : MODES.signup)}
                className="font-semibold text-brand-600 hover:text-brand-700 focus:outline-none focus-visible:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
