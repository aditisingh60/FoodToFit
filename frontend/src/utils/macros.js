export const ACTIVITY_LEVELS = [
  {
    value: 1.2,
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise, desk job',
  },
  {
    value: 1.375,
    id: 'light',
    label: 'Lightly active',
    description: 'Light exercise 1–3 days per week',
  },
  {
    value: 1.55,
    id: 'moderate',
    label: 'Moderately active',
    description: 'Moderate exercise 3–5 days per week',
  },
  {
    value: 1.725,
    id: 'active',
    label: 'Very active',
    description: 'Hard exercise 6–7 days per week',
  },
  {
    value: 1.9,
    id: 'extra',
    label: 'Extra active',
    description: 'Athlete or physically demanding job',
  },
]

export const GOALS = [
  { id: 'lose', label: 'Lose weight', description: 'Calorie deficit (~500 kcal/day)' },
  { id: 'maintain', label: 'Maintain weight', description: 'Stay at current weight' },
  { id: 'gain', label: 'Build muscle', description: 'Calorie surplus (~300 kcal/day)' },
]

export const SEX_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
]

export function calculateMacros(calories) {
  return {
    calories,
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9),
  }
}

export function previewMetrics({ age, sex, weightKg, heightCm, activityFactor, goal }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  const bmr = Math.round(sex === 'female' ? base - 161 : base + 5)
  const tdee = Math.round(bmr * activityFactor)
  const adjustment = goal === 'lose' ? -500 : goal === 'gain' ? 300 : 0
  const dailyCalorieGoal = Math.max(1200, tdee + adjustment)
  const heightM = heightCm / 100
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10

  return {
    bmr,
    tdee,
    bmi,
    dailyCalorieGoal,
    macros: calculateMacros(dailyCalorieGoal),
  }
}
