const { registerUser, loginUser } = require('../services/auth.service')

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const { token, user } = registerUser({ name, email, password })
    res.status(201).json({ token, userName: user.name, userId: user.id, userEmail: user.email, message: "User created successfully" })
  }
  catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const result = loginUser({ email, password })
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
      onboardingDone: result.onboardingDone
    })
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

module.exports = { register, login }