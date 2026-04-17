import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from './supabase.js'
import { db } from './pg.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Local fallback database file
const DB_FILE = path.join(__dirname, 'local_fallback_db.json')

let localDb = { users: {}, documents: [] }

// Initialize local DB
try {
  if (fs.existsSync(DB_FILE)) {
    localDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2))
  }
} catch (err) {
  console.error('Local DB Init Error:', err)
}

function saveLocalDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2))
  } catch (err) {
    console.error('Local DB Save Error:', err)
  }
}

// ----------------------------------------------------------------------------
// UNIVERSAL STORAGE ADAPTER
// ----------------------------------------------------------------------------

export const Storage = {
  async getUserProfile(userId) {
    if (supabase) {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
      if (!error && data) return data.profile_data // Assuming we store JSON in a profile_data col, but let's conform to Postgres format or fallback format
      // If error (e.g. not found), we return null to trigger generation
      return null
    } else {
      return localDb.users[userId] || null
    }
  },

  async saveUserProfile(userId, profileData) {
    if (supabase) {
      // Upsert profile
      await supabase.from('users').upsert({ 
        id: userId, 
        level: profileData.level,
        learning_style: profileData.learningStyle,
        profile_data: profileData 
      }, { onConflict: 'id' })
    } else {
      localDb.users[userId] = profileData
      saveLocalDb()
    }
  },

  async addDocument(document) {
    if (supabase) {
      await supabase.from('documents').insert({
        id: document.id,
        name: document.name,
        chunks: document.chunks
      })
    } else {
      localDb.documents.push(document)
      saveLocalDb()
    }
  },

  async getAllDocuments() {
    if (supabase) {
      const { data } = await supabase.from('documents').select('*')
      return data || []
    } else {
      return localDb.documents
    }
  },

  async getAllUsers() {
     if (supabase) {
      const { data } = await supabase.from('users').select('*')
      return (data || []).map(row => row.profile_data || {})
    } else {
      return Object.values(localDb.users)
    }
  },

  // --- Native Postgres Methods --- //

  async ensureUserExists(userId) {
    if (!process.env.PG_DATABASE) return;
    try {
      await db.query(
        'INSERT INTO users (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
        [userId]
      );
    } catch (err) {
      console.error('ensureUserExists error:', err.message);
    }
  },

  async saveQuestion(userId, questionText, subject) {
    if (!process.env.PG_DATABASE) return null;
    try {
      await this.ensureUserExists(userId);
      const res = await db.query(
        'INSERT INTO questions (user_id, question_text, subject) VALUES ($1, $2, $3) RETURNING id',
        [userId, questionText, subject]
      );
      return res.rows[0].id;
    } catch (err) {
      console.error('saveQuestion error:', err.message);
      return null;
    }
  },

  async savePerformance(userId, questionId, isCorrect, timeSpentSecs, score) {
    if (!process.env.PG_DATABASE) return;
    if (!questionId) return; // Need question context
    try {
      await db.query(
        'INSERT INTO performance (user_id, question_id, is_correct, time_spent_seconds, score) VALUES ($1, $2, $3, $4, $5)',
        [userId, questionId, isCorrect, timeSpentSecs, score]
      );
    } catch (err) {
      console.error('savePerformance error:', err.message);
    }
  }
}
