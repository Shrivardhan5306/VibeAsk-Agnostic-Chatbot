import cron from 'node-cron'
import { Storage } from '../db/storage.js'

export function startWeeklyAnalyticsJob() {
  // Run every Sunday at 3:00 AM
  cron.schedule('0 3 * * 0', async () => {
    console.log('🔄 Running weekly analytics extraction...')
    try {
      const users = await Storage.getAllUsers()
      let updatedCount = 0

      for (const profile of users) {
        if (!profile || !profile.weakTopics) continue

        // Recalculate or trim down error rates over time (simulated logic)
        profile.weakTopics = profile.weakTopics.filter(t => {
          // If error rate is below threshold and a lot of attempts exist, consider it mastered
          return !(t.errorRate < 0.2 && t.attempts > 5)
        })

        // Sort weak topics
        profile.weakTopics.sort((a, b) => b.errorRate - a.errorRate)
        
        await Storage.saveUserProfile(profile.userId, profile)
        updatedCount++
      }
      
      console.log(`✅ Weekly analytics complete. Updated ${updatedCount} profiles.`)
    } catch (err) {
      console.error('❌ Weekly analytics failed:', err)
    }
  })

  console.log('  🕒 Weekly analytics cron job scheduled.')
}
