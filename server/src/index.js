import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { solveRouter } from './routes/solve.routes.js'
import { ocrRouter } from './routes/ocr.routes.js'
import { ragRouter } from './routes/rag.routes.js'
import { personalizationRouter } from './routes/personalization.routes.js'
import { questionsRouter } from './routes/questions.routes.js'
import { startWeeklyAnalyticsJob } from './jobs/weeklyAnalytics.js'
import { initDb } from './db/pg.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

initDb()
startWeeklyAnalyticsJob()

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS === '*' ? '*' : (process.env.CORS_ORIGIN || 'http://localhost:5173'),
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mistral: process.env.MISTRAL_API_KEY ? 'configured' : 'missing',
      groq: process.env.GROQ_API_KEY ? 'configured' : 'missing',
      supabase: process.env.SUPABASE_URL ? 'configured' : 'missing',
    }
  })
})

// Routes
import { billingRouter } from './routes/billing.routes.js'
import { voiceRouter } from './routes/voice.routes.js'
import { enterpriseRouter } from './routes/enterprise.routes.js'
import { videoWorkerRouter } from './jobs/manimWorker.js'
import { authRouter } from './routes/auth.routes.js'

app.use('/api/solve', solveRouter)
app.use('/api/ocr', ocrRouter)
app.use('/api/rag', ragRouter)
app.use('/api/personalization', personalizationRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/billing', billingRouter)
app.use('/api/voice', voiceRouter)
app.use('/api/enterprise', enterpriseRouter)
app.use('/api/video', videoWorkerRouter)
app.use('/api/auth', authRouter)

// Error handler

app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`\n⚡ VibeAsk Server running on http://localhost:${PORT}`)
  console.log(`   🤖 Mistral: ${process.env.MISTRAL_API_KEY ? '🟢 Connected' : '🔴 Not configured'}`)
  console.log(`   ⚡ Groq:    ${process.env.GROQ_API_KEY ? '🟢 Connected (fallback)' : '🔴 Not configured'}`)
  console.log(`   🗄️ Supabase: ${process.env.SUPABASE_URL ? '🟢 Connected' : '🟡 In-Memory'}`)
  console.log(`   🐘 PostgreSQL: ${process.env.PG_DATABASE ? '🟢 Connected' : '🔴 Not configured'}`)
  console.log('')
})
