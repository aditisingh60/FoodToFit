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
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),

  name: z
    .string()
    .min(1, { message: "Name is required" })
})

// ── Register ──────────────────────────────────────
const registerUser = async ({ name, email, password }) => {
  let userData = { name, email, password }
  const validatedData = registerSchema.parse(userData);
  const existingUser = await prisma.user.findUnique({
    where: {
      email, // Must be flagged @unique in schema
    }
  })
  if (existingUser) {
    throw new Error("User already exists")
  }
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      passwordHash: hashedPassword
    },
    include: { profile: { select: { onboardingDone: true } } }
  });
  console.log('Created User:', user);
  const onboardingDone = user.profile?.onboardingDone ?? false
  const token = signToken(user.id)
  return { token, user, onboardingDone }
}

// ── Login ─────────────────────────────────────────
const loginUser = async ({ email, password }) => {
  let userData = { email, password }
  const validatedData = loginSchema.parse(userData)
  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
    include: { profile: { select: { onboardingDone: true } } }
  })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  // 2. Compare password with stored hash
  const valid = await bcrypt.compare(validatedData.password, user.passwordHash)
  if (!valid) throw new Error('INVALID_CREDENTIALS')

  // 3. Sign JWT
  const token = signToken(user.id)

  const onboardingDone = user.profile?.onboardingDone ?? false

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
    onboardingDone
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