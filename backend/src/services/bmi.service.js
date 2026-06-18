const GOAL_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 300,
}

const calculateBMR = ({ sex, weightKg, heightCm, age }) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'female' ? base - 161 : base + 5
}

const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

const calculateTDEE = (bmr, activityFactor) => Math.round(bmr * activityFactor)

const calculateDailyCalorieGoal = (tdee, goal = 'maintain') => {
  const adjustment = GOAL_ADJUSTMENTS[goal] ?? 0
  return Math.max(1200, Math.round(tdee + adjustment))
}

const calculateMacros = (dailyCalories) => ({
  calories: dailyCalories,
  protein: Math.round((dailyCalories * 0.3) / 4),
  carbs: Math.round((dailyCalories * 0.4) / 4),
  fat: Math.round((dailyCalories * 0.3) / 9),
})

const calculateMetrics = ({ age, sex, weightKg, heightCm, activityFactor, goal }) => {
  const bmr = Math.round(calculateBMR({ sex, weightKg, heightCm, age }))
  const bmi = calculateBMI(weightKg, heightCm)
  const tdee = calculateTDEE(bmr, activityFactor)
  const dailyCalorieGoal = calculateDailyCalorieGoal(tdee, goal)

  return {
    age,
    sex,
    weightKg,
    heightCm,
    activityFactor,
    goal,
    bmi,
    bmr,
    tdee,
    dailyCalorieGoal,
  }
}

module.exports = {
  calculateMetrics,
  calculateMacros,
  calculateBMR,
  calculateBMI,
  calculateTDEE,
}
