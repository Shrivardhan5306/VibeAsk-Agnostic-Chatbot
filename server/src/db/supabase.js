/**
 * Supabase Client
 * Provides database access for user profiles, sessions, and personalization
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log('  ✅ Supabase connected')
} else {
  console.log('  ⚠️ Supabase not configured — using in-memory storage')
}

export { supabase }

/**
 * Initialize database tables if they don't exist
 * Run this once on first deploy
 */
export async function initDatabase() {
  if (!supabase) return

  try {
    // Create tables via SQL (run once)
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE,
          name TEXT,
          tier TEXT DEFAULT 'free',
          level TEXT DEFAULT 'beginner',
          learning_style TEXT DEFAULT 'stepwise',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          question TEXT,
          subject TEXT,
          topic TEXT,
          steps JSONB,
          doubts JSONB DEFAULT '[]',
          rag_references JSONB DEFAULT '[]',
          aryabhatta_mode BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          subject TEXT,
          topic TEXT,
          correct BOOLEAN,
          time_spent INTEGER,
          doubt_count INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID,
          name TEXT,
          chunks JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (error) {
      // Tables might already exist or RPC not available — that's ok
      console.log('  ℹ️ Database init note:', error.message)
    }
  } catch (err) {
    console.log('  ℹ️ Database tables should be created manually in Supabase dashboard')
  }
}
