const COLORS = {
  calories: {
    bg: 'bg-orange-50',
    ring: 'ring-orange-100',
    text: 'text-orange-600',
    bar: 'bg-orange-500',
    icon: '🔥',
  },
  protein: {
    bg: 'bg-blue-50',
    ring: 'ring-blue-100',
    text: 'text-blue-600',
    bar: 'bg-blue-500',
    icon: '💪',
  },
  carbs: {
    bg: 'bg-amber-50',
    ring: 'ring-amber-100',
    text: 'text-amber-600',
    bar: 'bg-amber-500',
    icon: '🌾',
  },
  fat: {
    bg: 'bg-purple-50',
    ring: 'ring-purple-100',
    text: 'text-purple-600',
    bar: 'bg-purple-500',
    icon: '🥑',
  },
}

export default function MacroCard({ type, value, unit = 'g', subtitle }) {
  const colors = COLORS[type]

  return (
    <div className={`rounded-2xl ${colors.bg} p-5 ring-1 ${colors.ring}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{type}</p>
          <p className={`mt-1 text-3xl font-bold ${colors.text}`}>
            {value}
            <span className="ml-0.5 text-lg font-semibold">{unit}</span>
          </p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <span className="text-2xl">{colors.icon}</span>
      </div>
    </div>
  )
}

export function MacroGrid({ macros }) {
  if (!macros) return null

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MacroCard type="calories" value={macros.calories} unit="kcal" subtitle="Daily target" />
      <MacroCard type="protein" value={macros.protein} subtitle="30% of calories" />
      <MacroCard type="carbs" value={macros.carbs} subtitle="40% of calories" />
      <MacroCard type="fat" value={macros.fat} subtitle="30% of calories" />
    </div>
  )
}
