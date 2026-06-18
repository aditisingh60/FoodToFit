const { registerUser, loginUser } = require('../services/auth.service')

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const { token, user, onboardingDone } = await registerUser({ name, email, password })
    res.status(201).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email }, 
      onboardingDone,
      message: "User created successfully" 
    })
  }
  catch (error) {
    if (error.name === 'ZodError') {
      const messages = error.errors.map(e => e.message).join(', ')
      return res.status(400).json({ error: messages })
    }
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: error.message })
    }
    console.error('Register error:', error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await loginUser({ email, password })
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
      onboardingDone: result.onboardingDone
    })
  } catch (err) {
    if (err.name === 'ZodError') {
      const messages = err.errors.map(e => e.message).join(', ')
      return res.status(400).json({ error: messages })
    }
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

module.exports = { register, login }