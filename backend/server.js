require('dotenv').config()

const app = require('./src/app')
const PORT = process.env.PORT || 5001

const required = ['DATABASE_URL', 'JWT_SECRET']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(', ')}`)
  console.error('Copy backend/.env.example to backend/.env and fill in the values.')
  process.exit(1)
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

server.on("close", () => {
  console.log("SERVER CLOSED")
})