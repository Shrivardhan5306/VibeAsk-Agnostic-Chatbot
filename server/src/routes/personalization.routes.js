import { Router } from 'express'
import { Storage } from '../db/storage.js'

export const personalizationRouter = Router()

/**
 * GET /api/personalization/profile/:userId
 * Get user personalization profile
 */
personalizationRouter.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    let profile = await Storage.getUserProfile(userId)
    if (!profile) {
      profile = createDefaultProfile(userId)
      await Storage.saveUserProfile(userId, profile)
    }
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

/**
 * POST /api/personalization/track
 * Track a question attempt for personalization
 */
personalizationRouter.post('/track', async (req, res) => {
  try {
    const { userId, subject, topic, correct, timeSpent, doubtCount } = req.body

    let profile = await Storage.getUserProfile(userId)
    if (!profile) {
      profile = createDefaultProfile(userId)
    }

    // Update stats
    profile.stats.totalSolved++
    profile.stats.solvedBySubject[subject] = (profile.stats.solvedBySubject[subject] || 0) + 1

    if (correct) {
      profile.stats.correctCount++
    }
    profile.stats.accuracy = Math.round((profile.stats.correctCount / profile.stats.totalSolved) * 100)

    // Track weak topics
    const existingTopic = profile.weakTopics.find(t => t.topic === topic && t.subject === subject)
    if (existingTopic) {
      existingTopic.attempts++
      if (!correct) existingTopic.errors++
      existingTopic.errorRate = existingTopic.errors / existingTopic.attempts
      existingTopic.lastAttempt = new Date().toISOString()
    } else if (!correct) {
      profile.weakTopics.push({
        topic,
        subject,
        attempts: 1,
        errors: 1,
        errorRate: 1,
        lastAttempt: new Date().toISOString(),
      })
    }

    // Sort weak topics by error rate
    profile.weakTopics.sort((a, b) => b.errorRate - a.errorRate)

    // Update level based on accuracy
    if (profile.stats.totalSolved >= 10) {
      if (profile.stats.accuracy >= 80) profile.level = 'advanced'
      else if (profile.stats.accuracy >= 50) profile.level = 'developing'
      else profile.level = 'beginner'
    }

    await Storage.saveUserProfile(userId, profile)

    res.json({ profile, message: 'Progress tracked' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to track progress' })
  }
})

/**
 * GET /api/personalization/suggestions/:userId
 * Get personalized question suggestions based on weak areas
 */
personalizationRouter.get('/suggestions/:userId', async (req, res) => {
  try {
    let profile = await Storage.getUserProfile(req.params.userId)
    if (!profile) {
      profile = createDefaultProfile(req.params.userId)
      await Storage.saveUserProfile(req.params.userId, profile)
    }

    const suggestions = profile.weakTopics.slice(0, 5).map(wt => ({
      subject: wt.subject,
      topic: wt.topic,
      reason: `You have a ${Math.round(wt.errorRate * 100)}% error rate in ${wt.topic}`,
      difficulty: wt.errorRate > 0.5 ? 'medium' : 'hard',
    }))

    res.json({ suggestions, level: profile.level })
  } catch (err) {
    res.status(500).json({ error: 'Failed to get suggestions' })
  }
})

function createDefaultProfile(userId) {
  return {
    userId,
    level: 'beginner',
    learningStyle: 'stepwise',
    stats: {
      totalSolved: 0,
      correctCount: 0,
      accuracy: 0,
      streak: 0,
      solvedBySubject: { physics: 0, chemistry: 0, math: 0, biology: 0 },
    },
    weakTopics: [],
    createdAt: new Date().toISOString(),
  }
}
