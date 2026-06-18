const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const { getProfile, saveOnboarding } = require('../controllers/user.controller')

const router = express.Router()

router.use(authMiddleware)

router.get('/profile', getProfile)
router.post('/onboarding', saveOnboarding)

module.exports = router
