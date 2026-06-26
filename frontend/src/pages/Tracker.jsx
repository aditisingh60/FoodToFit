import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { toDateKey, formatDayLabel } from '../utils/formatDate'
import Navbar from '../components/layout/Navbar'
import { searchFood, createCustomFood } from '../api/food.api'
import { getMeals, logMeal, deleteMeal, resetMeals } from '../api/meal.api'
import { getWater, logWater, resetWater } from '../api/water.api'
import { getWeeklyHistory } from '../api/analytics.api'
import Button from '../components/ui/Button'
import Footer from '../components/layout/Footer'

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Uncategorized']

// Standard daily target values for vitamins and minerals
const VITAMIN_TARGETS = {
  vitaminA: { name: 'Vitamin A', target: 900, unit: 'mcg' },
  vitaminC: { name: 'Vitamin C', target: 90, unit: 'mg' },
  vitaminD: { name: 'Vitamin D', target: 20, unit: 'mcg' },
  calcium: { name: 'Calcium', target: 1000, unit: 'mg' },
  iron: { name: 'Iron', target: 18, unit: 'mg' },
}

export default function Tracker() {
  const { user, macros } = useAuth()
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [meals, setMeals] = useState([])
  const [waterMl, setWaterMl] = useState(0)
  const [loading, setLoading] = useState(true)

  // Weekly history states
  const [weeklyHistory, setWeeklyHistory] = useState([])
  const [weeklyCalorieGoal, setWeeklyCalorieGoal] = useState(2000)
  const [weeklyProteinGoal, setWeeklyProteinGoal] = useState(104)

  // Search and log meal modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [targetMealType, setTargetMealType] = useState('Breakfast')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [isEditingFood, setIsEditingFood] = useState(false)

  // Serving unit selection states
  const [unitType, setUnitType] = useState('servings') // 'servings' or 'grams'
  const [quantity, setQuantity] = useState(1) // servings/items count
  const [grams, setGrams] = useState(100) // grams input

  // Custom food modal state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [customFoodForm, setCustomFoodForm] = useState({
    name: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    vitaminA: '',
    vitaminC: '',
    vitaminD: '',
    calcium: '',
    iron: '',
    servingUnit: 'serving',
    servingWeight: '100',
  })

  const dateKey = toDateKey(selectedDate)

  // Fetch weekly tracking history data
  const fetchWeeklyData = useCallback(async () => {
    try {
      const data = await getWeeklyHistory()
      setWeeklyHistory(data.history)
      setWeeklyCalorieGoal(data.calorieGoal)
      setWeeklyProteinGoal(data.proteinGoal)
    } catch (err) {
      console.error('Error fetching weekly data:', err)
    }
  }, [])

  // Fetch meals and water data for the selected date
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [mealsData, waterData] = await Promise.all([
        getMeals(dateKey),
        getWater(dateKey),
      ])
      setMeals(mealsData)
      setWaterMl(waterData.totalMl)
      await fetchWeeklyData()
    } catch (err) {
      console.error('Error fetching tracker data:', err)
    } finally {
      setLoading(false)
    }
  }, [dateKey, fetchWeeklyData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle date change
  const adjustDate = (days) => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(selectedDate.getDate() + days)
    setSelectedDate(nextDate)
  }

  // Handle selecting food from search list
  const handleSelectFood = (food) => {
    setSelectedFood(food)
    setIsEditingFood(false)
    // Default to servings if a custom serving unit is defined and is not generic 'serving'
    const hasCustomServing = food.servingUnit && food.servingUnit !== 'serving'
    setUnitType(hasCustomServing ? 'servings' : 'grams')
    setQuantity(1)
    setGrams(food.servingWeight || 100)
  }

  // Handle meal logging
  const handleLogMealSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFood) return
    const gramsToLog = unitType === 'servings'
      ? quantity * (selectedFood.servingWeight || 100)
      : grams

    try {
      await logMeal({
        foodId: selectedFood.id,
        grams: gramsToLog,
        mealType: targetMealType,
        date: dateKey,
      })
      setIsAddModalOpen(false)
      setSelectedFood(null)
      setSearchQuery('')
      setSearchResults([])
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to log meal')
    }
  }

  // Handle meal delete
  const handleDeleteMeal = async (id) => {
    if (!confirm('Are you sure you want to remove this entry?')) return
    try {
      await deleteMeal(id)
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to delete meal')
    }
  }

  // Handle resetting all meals for the day
  const handleResetMeals = async () => {
    if (!confirm('Are you sure you want to clear all logged meals for this day?')) return
    try {
      await resetMeals(dateKey)
      fetchData()
    } catch (err) {
      alert(err.message || 'Failed to reset meals')
    }
  }

  // Handle custom food creation
  const handleCustomFoodSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: customFoodForm.name,
        calories: parseFloat(customFoodForm.calories) || 0,
        carbs: parseFloat(customFoodForm.carbs) || 0,
        protein: parseFloat(customFoodForm.protein) || 0,
        fat: parseFloat(customFoodForm.fat) || 0,
        servingUnit: customFoodForm.servingUnit || 'serving',
        servingWeight: parseFloat(customFoodForm.servingWeight) || 100,
        vitamins: {
          vitaminA: parseFloat(customFoodForm.vitaminA) || 0,
          vitaminC: parseFloat(customFoodForm.vitaminC) || 0,
          vitaminD: parseFloat(customFoodForm.vitaminD) || 0,
          calcium: parseFloat(customFoodForm.calcium) || 0,
          iron: parseFloat(customFoodForm.iron) || 0,
        },
      }
      const newFood = await createCustomFood(payload)
      handleSelectFood(newFood)
      setIsCustomModalOpen(false)
      // reset form
      setCustomFoodForm({
        name: '',
        calories: '',
        carbs: '',
        protein: '',
        fat: '',
        vitaminA: '',
        vitaminC: '',
        vitaminD: '',
        calcium: '',
        iron: '',
        servingUnit: 'serving',
        servingWeight: '100',
      })
    } catch (err) {
      alert(err.message || 'Failed to create custom food')
    }
  }

  // Search food
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const results = await searchFood(searchQuery)
      setSearchResults(results)
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  // Handle water logging
  const handleLogWater = async (amount) => {
    try {
      await logWater({ amountMl: amount, date: dateKey })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleResetWater = async () => {
    try {
      await resetWater(dateKey)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  // Calculate accumulated nutrition
  const totalNutrition = meals.reduce(
    (acc, meal) => {
      const factor = meal.grams / 100.0
      const food = meal.food
      acc.calories += food.calories * factor
      acc.carbs += food.carbs * factor
      acc.protein += food.protein * factor
      acc.fat += food.fat * factor

      if (food.vitamins) {
        const vits = food.vitamins
        acc.vitaminA += (parseFloat(vits.vitaminA) || 0) * factor
        acc.vitaminC += (parseFloat(vits.vitaminC) || 0) * factor
        acc.vitaminD += (parseFloat(vits.vitaminD) || 0) * factor
        acc.calcium += (parseFloat(vits.calcium) || 0) * factor
        acc.iron += (parseFloat(vits.iron) || 0) * factor
      }
      return acc
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 0, iron: 0 }
  )

  const calorieGoal = macros?.calories || 2000
  const carbGoal = macros?.carbs || 187
  const proteinGoal = macros?.protein || 104
  const fatGoal = macros?.fat || 55

  const calConsumed = Math.round(totalNutrition.calories)
  const calRemaining = Math.max(0, calorieGoal - calConsumed)

  const waterTargetMl = 2000 // 2 Liters (approx 8 cups of 250ml)
  const waterProgressCups = Math.min(8, Math.floor(waterMl / 250))

  // Calculated portion size for nutrients preview inside Add Food modal
  const effectiveGrams = selectedFood
    ? (unitType === 'servings' ? quantity * (selectedFood.servingWeight || 100) : grams)
    : 100

  return (
    <div className="min-h-svh bg-transparent">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Date Selector */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            onClick={() => adjustDate(-1)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            ◀
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-900">
              {isSameDay(selectedDate, new Date()) ? 'Today' : formatDayLabel(selectedDate)}
            </h2>
            <p className="text-xs text-slate-400">{dateKey}</p>
          </div>
          <button
            onClick={() => adjustDate(1)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            ▶
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column: Diary categories */}
              <div className="space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">Your Diary</h3>
                  <div className="flex items-center gap-4">
                    {meals.length > 0 && (
                      <button
                        onClick={handleResetMeals}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
                      >
                        Reset Diary
                      </button>
                    )}
                    <span className="text-sm font-medium text-slate-500">
                      {meals.length} items logged
                    </span>
                  </div>
                </div>

                {MEAL_TYPES.map((type) => {
                  const typeMeals = meals.filter((m) => m.mealType === type)
                  const typeCalories = Math.round(
                    typeMeals.reduce((sum, m) => sum + m.caloriesConsumed, 0)
                  )

                  return (
                    <div
                      key={type}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 px-4 sm:px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{type}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-slate-700">
                            {typeCalories} kcal
                          </span>
                          <button
                            onClick={() => {
                              setTargetMealType(type)
                              setIsAddModalOpen(true)
                            }}
                            className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition"
                          >
                            + Add Food
                          </button>
                        </div>
                      </div>

                      {typeMeals.length === 0 ? (
                        <p className="px-6 py-5 text-sm italic text-slate-400">
                          No food logged for {type.toLowerCase()} yet.
                        </p>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {typeMeals.map((meal) => {
                            const factor = meal.grams / 100
                            const hasServing = meal.food.servingUnit && meal.food.servingUnit !== 'serving'
                            const servingCount = Math.round((meal.grams / (meal.food.servingWeight || 100)) * 10) / 10

                            return (
                              <div
                                key={meal.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition group"
                              >
                                <div>
                                  <h4 className="font-medium text-slate-800">{meal.food.name}</h4>
                                  <p className="text-xs text-slate-400">
                                    {hasServing ? `${servingCount} ${meal.food.servingUnit}${servingCount !== 1 ? 's' : ''} (${meal.grams}g)` : `${meal.grams}g`} · C: {Math.round(meal.food.carbs * factor)}g · P:{' '}
                                    {Math.round(meal.food.protein * factor)}g · F:{' '}
                                    {Math.round(meal.food.fat * factor)}g
                                  </p>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                  <span className="text-sm font-semibold text-slate-700">
                                    {Math.round(meal.caloriesConsumed)} kcal
                                  </span>
                                  <button
                                    onClick={() => handleDeleteMeal(meal.id)}
                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete log"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Right Column: Nutrition summaries, Water tracking */}
              <div className="space-y-6">
                {/* Energy summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Energy Summary
                  </h3>

                  <div className="flex flex-col items-center">
                    {/* Circular energy graphic */}
                    <div className="relative flex h-36 w-36 items-center justify-center">
                      {/* Ring filled based on target */}
                      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 144 144">
                        <circle
                          cx="72"
                          cy="72"
                          r="58"
                          fill="transparent"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="58"
                          fill="transparent"
                          stroke="var(--color-brand-600, #059669)"
                          strokeWidth="8"
                          strokeDasharray={364.4}
                          strokeDashoffset={Math.max(0, 364.4 - (calConsumed / calorieGoal) * 364.4)}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="text-center z-10 px-2">
                        <span className="text-3xl font-extrabold text-slate-800 block leading-none">{calConsumed}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mt-1.5 whitespace-nowrap">
                          kcal consumed
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 w-full text-center border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Daily Target</span>
                        <p className="text-lg font-bold text-slate-800">{calorieGoal} kcal</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Remaining</span>
                        <p className="text-lg font-bold text-brand-600">{calRemaining} kcal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macros Summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Macronutrients
                  </h3>
                  <div className="space-y-4">
                    {/* Protein */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Protein</span>
                        <span className="text-slate-800">
                          {Math.round(totalNutrition.protein)} / {proteinGoal}g
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#8E6549] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalNutrition.protein / proteinGoal) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Carbs */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Net Carbs</span>
                        <span className="text-slate-800">
                          {Math.round(totalNutrition.carbs)} / {carbGoal}g
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#8E6549] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalNutrition.carbs / carbGoal) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Fat */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Fat</span>
                        <span className="text-slate-800">
                          {Math.round(totalNutrition.fat)} / {fatGoal}g
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#8E6549] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalNutrition.fat / fatGoal) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Water Tracker */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Water Tracker
                    </h3>
                    <button
                      onClick={handleResetWater}
                      className="text-xs font-medium text-red-500 hover:text-red-700 transition"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-extrabold text-slate-800">
                        {waterMl}
                        <span className="text-lg font-normal text-slate-500"> / {waterTargetMl} ml</span>
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {waterProgressCups} / 8 glasses finished
                      </p>
                    </div>

                    {/* Glass row (8 glasses) */}
                    <div className="flex gap-1.5 justify-center mb-6">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const isFilled = idx < waterProgressCups
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (isFilled) {
                                const targetAmount = idx * 250
                                const difference = targetAmount - waterMl
                                handleLogWater(difference)
                              } else {
                                const targetAmount = (idx + 1) * 250
                                const difference = targetAmount - waterMl
                                handleLogWater(difference)
                              }
                            }}
                            className={[
                              'h-12 w-8 border-2 rounded-b-lg rounded-t-sm transition-all relative overflow-hidden flex items-end justify-center',
                              isFilled
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-300 hover:border-blue-400 bg-white',
                            ].join(' ')}
                            title={`Glass ${idx + 1} (250ml)`}
                          >
                            {isFilled && (
                              <div className="absolute inset-0 bg-blue-500/70 animate-pulse flex items-center justify-center">
                                <span className="text-[10px] text-white select-none">💧</span>
                              </div>
                            )}
                            {!isFilled && (
                              <span className="text-slate-300 text-xs font-bold select-none">+</span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleLogWater(250)}
                        className="flex-1 rounded-xl border border-blue-200 bg-blue-50/50 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                      >
                        + 250ml Glass
                      </button>
                      <button
                        onClick={() => handleLogWater(500)}
                        className="flex-1 rounded-xl border border-blue-200 bg-blue-50/50 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                      >
                        + 500ml Bottle
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vitamins & Minerals breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Vitamins & Minerals
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {Object.entries(VITAMIN_TARGETS).map(([key, info]) => {
                      const consumed = totalNutrition[key] || 0
                      const percent = Math.min(100, Math.round((consumed / info.target) * 100))

                      return (
                        <div key={key} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600">{info.name}</span>
                            <span className="text-slate-500">
                              {Math.round(consumed * 10) / 10} / {info.target} {info.unit} ({percent}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Progress Graph */}
            {weeklyHistory.length > 0 && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Weekly Progress</h3>
                    <p className="text-sm text-slate-500">Compare your daily calorie and protein intakes against your targets</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" /> Calories (Target: {weeklyCalorieGoal} kcal)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-500" /> Protein (Target: {weeklyProteinGoal}g)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="relative flex h-56 w-full min-w-[450px] items-end gap-2 border-b border-slate-105 pb-2">
                    {/* Y Axis reference lines */}
                    <div className="absolute left-0 top-0 bottom-2 right-0 flex flex-col justify-between pointer-events-none">
                      <div className="w-full border-t border-slate-100 text-[10px] text-slate-355 pt-1">100% Target</div>
                      <div className="w-full border-t border-slate-100/50 text-[10px] text-slate-300 pt-1">50% Target</div>
                      <div className="w-full border-t border-slate-100/20 text-[10px] text-slate-300 pt-1">0%</div>
                    </div>

                  {/* SVG Line Graph */}
                  <svg 
                    className="absolute left-0 right-0 pointer-events-none z-0" 
                    style={{ top: '1.5rem', bottom: '0.5rem', height: 'calc(100% - 2rem)', width: '100%' }}
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                  >
                    {/* Calories Line */}
                    <polyline
                      points={weeklyHistory.map((day, i) => `${(i + 0.5) * (100 / 7)},${100 - Math.min(100, Math.round((day.calories / (weeklyCalorieGoal || 2000)) * 100))}`).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* Protein Line */}
                    <polyline
                      points={weeklyHistory.map((day, i) => `${(i + 0.5) * (100 / 7)},${100 - Math.min(100, Math.round((day.protein / (weeklyProteinGoal || 100)) * 100))}`).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="flex-1 flex justify-around h-full pt-6 relative z-10">
                    {weeklyHistory.map((day) => {
                      const calPercent = Math.min(100, Math.round((day.calories / (weeklyCalorieGoal || 2000)) * 100))
                      const protPercent = Math.min(100, Math.round((day.protein / (weeklyProteinGoal || 100)) * 100))

                      return (
                        <div key={day.dateKey} className="flex flex-col items-center justify-end h-full w-16 group relative">
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-lg z-20 pointer-events-none transition-all w-28">
                            <span className="font-bold text-slate-400 mb-0.5">{day.dateKey}</span>
                            <span className={day.calories > (weeklyCalorieGoal || 2000) ? "text-red-400 font-bold animate-pulse" : "text-emerald-400"}>
                              🔥 {day.calories} kcal ({Math.round((day.calories / (weeklyCalorieGoal || 2000)) * 100)}%)
                            </span>
                            <span className="text-blue-400">💪 {day.protein}g ({protPercent}%)</span>
                          </div>

                          <div className="relative h-full w-full flex justify-center">
                            {/* Hover interaction area */}
                            <div className="absolute inset-y-0 w-full bg-slate-100/0 group-hover:bg-slate-100/50 rounded-md transition-colors cursor-pointer" />
                            
                            {/* Calories Dot */}
                            <div 
                              className={`absolute w-2.5 h-2.5 rounded-full ${day.calories > (weeklyCalorieGoal || 2000) ? 'bg-red-500' : 'bg-emerald-500'} -ml-[5px] transition-transform group-hover:scale-150 ring-2 ring-white`}
                              style={{ bottom: `calc(${calPercent}% - 5px)`, left: '50%' }}
                            />
                            
                            {/* Protein Dot */}
                            <div 
                              className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 -ml-[5px] transition-transform group-hover:scale-150 ring-2 ring-white"
                              style={{ bottom: `calc(${protPercent}% - 5px)`, left: '50%' }}
                            />
                          </div>

                          <span className="mt-2 text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{day.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h3 className="text-lg font-bold text-slate-800">
                Log Food to {targetMealType}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setSelectedFood(null)
                  setSearchQuery('')
                  setSearchResults([])
                  setIsEditingFood(false)
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {!selectedFood ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search foods (e.g. roti, whey, almonds...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      onClick={handleSearch}
                      className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
                    >
                      Search
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Can't find it?</span>
                    <button
                      onClick={() => setIsCustomModalOpen(true)}
                      className="font-bold text-brand-600 hover:text-brand-800 transition"
                    >
                      + Create Custom Food
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-150 divide-y divide-slate-100">
                    {searching ? (
                      <div className="py-8 text-center text-slate-400 text-sm">Searching...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        {searchQuery ? 'No results found. Try creating custom food.' : 'Search for a food item above'}
                      </div>
                    ) : (
                      searchResults.map((food) => (
                        <button
                          key={food.id}
                          onClick={() => handleSelectFood(food)}
                          className="w-full text-left px-4 py-3 hover:bg-brand-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 transition"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 block">{food.name}</span>
                            <span className="text-xs text-slate-400 font-medium text-slate-500">
                              Serving: 1 {food.servingUnit || 'serving'} ({food.servingWeight || 100}g) · {food.calories} kcal
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400">
                            C: {food.carbs}g · P: {food.protein}g · F: {food.fat}g
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogMealSubmit} className="space-y-5">
                  <div className="rounded-2xl bg-brand-50/50 border border-brand-100 p-4 relative group">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-brand-800 uppercase tracking-wide">Selected Food</span>
                      <button 
                        type="button"
                        onClick={() => setIsEditingFood(!isEditingFood)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
                      >
                        {isEditingFood ? 'Done' : 'Edit'}
                      </button>
                    </div>
                    
                    {isEditingFood ? (
                      <div className="mt-2 space-y-3">
                         <div>
                           <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                           <input 
                             type="text" 
                             value={selectedFood.name}
                             onChange={(e) => setSelectedFood({...selectedFood, name: e.target.value})}
                             className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                           />
                         </div>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                           <div>
                             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kcal</label>
                             <input type="number" min="0" step="any" value={selectedFood.calories} onChange={(e) => setSelectedFood({...selectedFood, calories: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"/>
                           </div>
                           <div>
                             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Carbs</label>
                             <input type="number" min="0" step="any" value={selectedFood.carbs} onChange={(e) => setSelectedFood({...selectedFood, carbs: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"/>
                           </div>
                           <div>
                             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prot</label>
                             <input type="number" min="0" step="any" value={selectedFood.protein} onChange={(e) => setSelectedFood({...selectedFood, protein: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"/>
                           </div>
                           <div>
                             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fat</label>
                             <input type="number" min="0" step="any" value={selectedFood.fat} onChange={(e) => setSelectedFood({...selectedFood, fat: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"/>
                           </div>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           <div>
                             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Serving Unit</label>
                             <input type="text" value={selectedFood.servingUnit || 'serving'} onChange={(e) => setSelectedFood({...selectedFood, servingUnit: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"/>
                           </div>
                           <div>
                             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Unit Weight (g)</label>
                             <input type="number" min="1" step="any" value={selectedFood.servingWeight || 100} onChange={(e) => setSelectedFood({...selectedFood, servingWeight: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"/>
                           </div>
                         </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-slate-800 text-lg mt-0.5">{selectedFood.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Nutrients per 100g: {selectedFood.calories} kcal | Carbs: {selectedFood.carbs}g | Protein: {selectedFood.protein}g | Fat: {selectedFood.fat}g
                        </p>
                        {(selectedFood.servingUnit || selectedFood.servingWeight) && (
                           <p className="text-xs text-slate-500 mt-0.5">
                             Serving: 1 {selectedFood.servingUnit || 'serving'} ({selectedFood.servingWeight || 100}g)
                           </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Quantity Unit Tab selectors */}
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setUnitType('servings')}
                      className={[
                        'flex-1 rounded-lg py-2 text-xs font-semibold transition',
                        unitType === 'servings'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      ].join(' ')}
                    >
                      Servings / Items
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitType('grams')}
                      className={[
                        'flex-1 rounded-lg py-2 text-xs font-semibold transition',
                        unitType === 'grams'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      ].join(' ')}
                    >
                      Grams (g)
                    </button>
                  </div>

                  {unitType === 'servings' ? (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Number of {selectedFood.servingUnit || 'serving'}(s)
                      </label>
                      <input
                        type="number"
                        required
                        min="0.1"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value) || 0))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Calculated weight: {Math.round(quantity * (selectedFood.servingWeight || 100))}g (1 {selectedFood.servingUnit || 'serving'} = {selectedFood.servingWeight || 100}g)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Amount in Grams
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={grams}
                        onChange={(e) => setGrams(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-100 p-4 space-y-2 bg-slate-50 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Portion Calories</span>
                      <span className="font-bold text-slate-800">
                        {Math.round((selectedFood.calories * effectiveGrams) / 100)} kcal
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Portion Protein</span>
                      <span className="font-semibold text-slate-800">
                        {Math.round(((selectedFood.protein * effectiveGrams) / 100) * 10) / 10}g
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Portion Carbs</span>
                      <span className="font-semibold text-slate-800">
                        {Math.round(((selectedFood.carbs * effectiveGrams) / 100) * 10) / 10}g
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Portion Fat</span>
                      <span className="font-semibold text-slate-800">
                        {Math.round(((selectedFood.fat * effectiveGrams) / 100) * 10) / 10}g
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedFood(null)}
                      className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Back
                    </button>
                    <Button type="submit" className="flex-1">
                      Log Food
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Creation Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h3 className="text-lg font-bold text-slate-800">Create Custom Food</h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomFoodSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandma's Oatmeal Cookies"
                  value={customFoodForm.name}
                  onChange={(e) => setCustomFoodForm({ ...customFoodForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Calories (kcal / 100g)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={customFoodForm.calories}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, calories: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Protein (g / 100g)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={customFoodForm.protein}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, protein: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Carbs (g / 100g)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={customFoodForm.carbs}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, carbs: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Fat (g / 100g)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={customFoodForm.fat}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, fat: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Custom servings setup */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Serving Unit Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scoop, Chapati, Piece"
                    value={customFoodForm.servingUnit}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, servingUnit: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Weight per serving (g)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="100"
                    value={customFoodForm.servingWeight}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, servingWeight: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Vitamins & Minerals (Optional, per 100g)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Vitamin A (mcg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={customFoodForm.vitaminA}
                      onChange={(e) => setCustomFoodForm({ ...customFoodForm, vitaminA: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Vitamin C (mg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={customFoodForm.vitaminC}
                      onChange={(e) => setCustomFoodForm({ ...customFoodForm, vitaminC: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Vitamin D (mcg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={customFoodForm.vitaminD}
                      onChange={(e) => setCustomFoodForm({ ...customFoodForm, vitaminD: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Calcium (mg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={customFoodForm.calcium}
                      onChange={(e) => setCustomFoodForm({ ...customFoodForm, calcium: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Iron (mg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={customFoodForm.iron}
                      onChange={(e) => setCustomFoodForm({ ...customFoodForm, iron: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <Button type="submit" className="flex-1">
                  Save Food
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}
