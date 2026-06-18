const prisma = require('../config/db')
const { calculateMetrics, calculateMacros } = require('../services/bmi.service')

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    })

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found', onboardingDone: false })
    }

    const macros = calculateMacros(profile.dailyCalorieGoal)

    res.json({
      profile,
      macros,
      onboardingDone: profile.onboardingDone,
    })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

const saveOnboarding = async (req, res) => {
  try {
    const { age, sex, weightKg, heightCm, activityFactor, goal } = req.body

    if (!age || !sex || !weightKg || !heightCm || !activityFactor) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (age < 13 || age > 120) {
      return res.status(400).json({ error: 'Age must be between 13 and 120' })
    }

    if (weightKg < 30 || weightKg > 300) {
      return res.status(400).json({ error: 'Please enter a valid weight' })
    }

    if (heightCm < 100 || heightCm > 250) {
      return res.status(400).json({ error: 'Please enter a valid height' })
    }

    const metrics = calculateMetrics({
      age: Number(age),
      sex,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      activityFactor: Number(activityFactor),
      goal: goal || 'maintain',
    })

    const profile = await prisma.userProfile.upsert({
      where: { userId: req.userId },
      create: {
        userId: req.userId,
        ...metrics,
        onboardingDone: true,
      },
      update: {
        ...metrics,
        onboardingDone: true,
      },
    })

    const macros = calculateMacros(profile.dailyCalorieGoal)

    res.status(201).json({
      message: 'Profile saved successfully',
      profile,
      macros,
      onboardingDone: true,
    })
  } catch (err) {
    console.error('Save onboarding error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

module.exports = { getProfile, saveOnboarding }
