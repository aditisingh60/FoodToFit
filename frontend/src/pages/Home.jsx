import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MonthCalendar from '../components/calendar/MonthCalendar'
import { MacroGrid } from '../components/dashboard/MacroCard'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { formatDayLabel, getGreeting, toDateKey } from '../utils/formatDate'

function loadTrackedDays(userId) {
  try {
    const raw = localStorage.getItem(`trackedDays:${userId}`)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveTrackedDays(userId, days) {
  localStorage.setItem(`trackedDays:${userId}`, JSON.stringify([...days]))
}

export default function Home() {
  const navigate = useNavigate()
  const { user, macros, profile, logout } = useAuth()
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [trackedDays, setTrackedDays] = useState(() =>
    loadTrackedDays(user?.id || 'guest')
  )

  const firstName = user?.name?.split(' ')[0] || 'there'

  const toggleTrack = useCallback(
    (date) => {
      const key = toDateKey(date)
      setTrackedDays((prev) => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        saveTrackedDays(user?.id || 'guest', next)
        return next
      })
    },
    [user?.id]
  )

  const selectedKey = toDateKey(selectedDate)
  const isSelectedTracked = trackedDays.has(selectedKey)
  const trackedCount = trackedDays.size

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-svh bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-lg">🥗</span>
            </div>
            <span className="text-lg font-bold text-slate-900">FoodToFit</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="mt-1 text-slate-500">
            Welcome back — let&apos;s keep your nutrition on track today.
          </p>
        </div>

        {/* Macro targets */}
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Your daily targets
          </h2>
          <MacroGrid macros={macros} />
        </section>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Calendar */}
          <section className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Tracking calendar
              </h2>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {trackedCount} day{trackedCount !== 1 ? 's' : ''} tracked
              </span>
            </div>
            <MonthCalendar
              trackedDays={trackedDays}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onToggleTrack={toggleTrack}
            />
          </section>

          {/* Day panel */}
          <section className="lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Selected day
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                {formatDayLabel(selectedDate)}
              </p>

              <div
                className={[
                  'mt-4 rounded-xl px-4 py-3 text-sm',
                  isSelectedTracked
                    ? 'bg-brand-50 text-brand-800'
                    : 'bg-slate-50 text-slate-600',
                ].join(' ')}
              >
                {isSelectedTracked
                  ? '✓ You tracked nutrition on this day. Great job!'
                  : 'No tracking logged yet for this day.'}
              </div>

              <Button
                className="mt-5"
                onClick={() => toggleTrack(selectedDate)}
              >
                {isSelectedTracked ? 'Remove tracking' : 'Mark as tracked'}
              </Button>

              {profile && (
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-500">
                  <p>
                    <span className="font-medium text-slate-700">Profile:</span>{' '}
                    {profile.age} yrs · {profile.sex} · {profile.weightKg} kg ·{' '}
                    {profile.heightCm} cm
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Goal:</span>{' '}
                    {profile.goal === 'lose'
                      ? 'Lose weight'
                      : profile.goal === 'gain'
                        ? 'Build muscle'
                        : 'Maintain weight'}
                  </p>
                </div>
              )}
            </div>

            {/* Quick tips */}
            <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
              <p className="text-sm font-semibold text-brand-800">💡 Tip</p>
              <p className="mt-1 text-sm text-brand-700/80">
                Click a day to select it, then tap &ldquo;Mark as tracked&rdquo; when you&apos;ve
                logged your meals. Double-click a day to toggle tracking quickly.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
