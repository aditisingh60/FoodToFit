import { useState } from 'react'
import {
  formatMonthYear,
  getCalendarDays,
  isSameDay,
  toDateKey,
} from '../../utils/formatDate'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MonthCalendar({ trackedDays, selectedDate, onSelectDate, onToggleTrack }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const days = getCalendarDays(year, month)

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const isTracked = (date) => trackedDays.has(toDateKey(date))
  const isFuture = (date) => date > today && !isSameDay(date, today)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Previous month"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-base font-semibold text-slate-900">{formatMonthYear(viewDate)}</h3>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Next month"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-center text-xs font-medium text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="aspect-square" />

          const key = toDateKey(date)
          const tracked = isTracked(date)
          const selected = isSameDay(date, selectedDate)
          const isToday = isSameDay(date, today)
          const future = isFuture(date)

          return (
            <button
              key={key}
              type="button"
              disabled={future}
              onClick={() => onSelectDate(date)}
              onDoubleClick={() => !future && onToggleTrack(date)}
              className={[
                'relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition',
                future && 'cursor-not-allowed opacity-30',
                selected
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : tracked
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                    : isToday
                      ? 'bg-slate-100 text-slate-900 ring-2 ring-brand-500'
                      : 'text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              {date.getDate()}
              {tracked && !selected && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-brand-500" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-brand-600" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-brand-50 ring-1 ring-brand-200" /> Tracked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-slate-100 ring-2 ring-brand-500" /> Today
        </span>
      </div>
    </div>
  )
}
