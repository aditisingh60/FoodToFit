const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const foodRoutes = require('./routes/food.routes')
const mealRoutes = require('./routes/meal.routes')
const waterRoutes = require('./routes/water.routes')
const analyticsRoutes = require('./routes/analytics.routes')

const app = express()

// ── Security middleware ───────────────────────────
app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

// ── Rate limit on auth endpoints (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,                   // max 20 requests per window
    message: { error: 'Too many attempts. Please try again in 15 minutes.' }
})

// ── Body parsing ──────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Request logging (dev only) ────────────────────

app.use(morgan('dev'))


// ── Routes ────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/meal', mealRoutes)
app.use('/api/water', waterRoutes)
app.use('/api/analytics', analyticsRoutes)

// ── Health check ──────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Global error handler ──────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
})

module.exports = app
