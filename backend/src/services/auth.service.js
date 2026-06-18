const z = require('zod')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/db')
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password is required" }),
});
const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email.apply({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, ({ message: "Password is required" })),

  name: z
    .string()
    .min(1, ({ message: "Name is required" }))
})

// ── Register ──────────────────────────────────────
const registerUser = async ({ name, email, password }) => {
  try {
    let userData = { name, email, password }
    const validatedData = registerSchema.parse(userData);
    const existingUser = await prisma.User.findUnique({
      where: {
        email, // Must be flagged @unique in schema
      }
    })
    if (existingUser) {
      return new Error("User already exist")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword
    const user = await prisma.User.create({
      data: {
        userData
      },
    });
    console.log('Created User:', user);
    const onboardingDone = user.profile?.onboardingDone ?? false
    const token = signToken(user.id)
    return { token, user, onboardingDone }


  } catch (error) {
    throw new Error("Error while registering user")

  }

}

// ── Login ─────────────────────────────────────────
const loginUser = async ({ email, password }) => {
  try {
    let userData = { email, password }
    const validatedData = loginSchema.parse(userData)
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: { select: { onboardingDone: true } } }
    })
    if (!user) throw new Error('INVALID_CREDENTIALS')

    // 2. Compare password with stored hash
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new Error('INVALID_CREDENTIALS')

    // 3. Sign JWT
    const token = signToken(user.id)

    const onboardingDone = user.profile?.onboardingDone ?? false

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
      onboardingDone
    }
  } catch (error) {
    throw new Error("Error while login")
  }
}

// ── Helper: create JWT ────────────────────────────
const signToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

module.exports = { registerUser, loginUser }