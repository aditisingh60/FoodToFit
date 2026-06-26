import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { saveOnboarding } from '../api/user.api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../store/authStore'
import { MacroGrid } from '../components/dashboard/MacroCard'
import {
  ACTIVITY_LEVELS,
  GOALS,
  SEX_OPTIONS,
  previewMetrics,
} from '../utils/macros'

const STEPS = ['About you', 'Body stats', 'Activity', 'Your plan']

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, completeOnboarding, logout } = useAuth()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const [form, setForm] = useState({
    age: '',
    sex: '',
    heightCm: '',
    weightKg: '',
    activityFactor: '',
    goal: 'maintain',
  })

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const metrics = form.age && form.sex && form.heightCm && form.weightKg && form.activityFactor
    ? previewMetrics({
        age: Number(form.age),
        sex: form.sex,
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        activityFactor: Number(form.activityFactor),
        goal: form.goal,
      })
    : null

  const canNext = () => {
    if (step === 0) return form.age && form.sex
    if (step === 1) return form.heightCm && form.weightKg
    if (step === 2) return form.activityFactor && form.goal
    return true
  }

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        age: Number(form.age),
        sex: form.sex,
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        activityFactor: Number(form.activityFactor),
        goal: form.goal,
      }

      const data = await saveOnboarding(payload)
      completeOnboarding(data)
      navigate('/home')
    } catch (err) {
      if (metrics) {
        completeOnboarding({
          profile: {
            ...form,
            age: Number(form.age),
            heightCm: Number(form.heightCm),
            weightKg: Number(form.weightKg),
            activityFactor: Number(form.activityFactor),
            dailyCalorieGoal: metrics.dailyCalorieGoal,
            bmi: metrics.bmi,
            bmr: metrics.bmr,
            tdee: metrics.tdee,
            onboardingDone: true,
          },
          macros: metrics.macros,
          onboardingDone: true,
        })
        navigate('/home')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh relative bg-transparent px-4 py-10">
      <button
        onClick={handleLogout}
        className="absolute right-4 top-4 sm:right-8 sm:top-8 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
      >
        Log out
      </button>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-3 inline-flex items-center gap-2 hover:opacity-90 transition">
            <span className="text-2xl">🥗</span>
            <span className="text-lg font-bold text-slate-900">FoodToFit</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Hi {user?.name?.split(' ')[0] || 'there'}, let&apos;s personalize your plan
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Answer a few questions so we can calculate your daily nutrition targets
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition',
                  i <= step
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 text-slate-500',
                ].join(' ')}
              >
                {i + 1}
              </div>
              <span className="hidden text-[10px] font-medium text-slate-500 sm:block">{label}</span>
              {i < STEPS.length - 1 && (
                <div
                  className={[
                    'absolute hidden h-0.5 sm:block',
                  ].join(' ')}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">About you</h2>
              <Input
                id="age"
                label="Age"
                type="number"
                placeholder="25"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
              />
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Sex</p>
                <div className="grid grid-cols-2 gap-3">
                  {SEX_OPTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update('sex', id)}
                      className={[
                        'rounded-xl border py-3 text-sm font-semibold transition',
                        form.sex === id
                          ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">Body stats</h2>
              <Input
                id="height"
                label="Height (cm)"
                type="number"
                placeholder="170"
                value={form.heightCm}
                onChange={(e) => update('heightCm', e.target.value)}
              />
              <Input
                id="weight"
                label="Weight (kg)"
                type="number"
                placeholder="70"
                value={form.weightKg}
                onChange={(e) => update('weightKg', e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">How active are you?</h2>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('activityFactor', String(value))}
                    className={[
                      'w-full rounded-xl border px-4 py-3 text-left transition',
                      Number(form.activityFactor) === value
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300',
                    ].join(' ')}
                  >
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">{description}</p>
                  </button>
                ))}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Your goal</p>
                <div className="space-y-2">
                  {GOALS.map(({ id, label, description }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update('goal', id)}
                      className={[
                        'w-full rounded-xl border px-4 py-3 text-left transition',
                        form.goal === id
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300',
                      ].join(' ')}
                    >
                      <p className="text-sm font-semibold text-slate-900">{label}</p>
                      <p className="text-xs text-slate-500">{description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && metrics && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">Your daily nutrition plan</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Based on your age, body stats, and activity level
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
                <div>
                  <p className="text-xs text-slate-500">BMI</p>
                  <p className="text-lg font-bold text-slate-900">{metrics.bmi}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">BMR</p>
                  <p className="text-lg font-bold text-slate-900">{metrics.bmr} kcal</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">TDEE</p>
                  <p className="text-lg font-bold text-slate-900">{metrics.tdee} kcal</p>
                </div>
              </div>

              <MacroGrid macros={metrics.macros} />

              <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
                These targets are calculated using the Mifflin-St Jeor equation and a balanced
                macro split of 30% protein, 40% carbs, and 30% fat.
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack} className="!w-auto px-6">
                Back
              </Button>
            )}
            <div className="flex-1">
              {step < 3 ? (
                <Button onClick={handleNext} disabled={!canNext()}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving…' : 'Start tracking →'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
