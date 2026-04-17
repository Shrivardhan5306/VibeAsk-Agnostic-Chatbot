import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '12413595@sp',
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'vibeask',
});

// Test connection
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export const db = {
  query: (text, params) => pool.query(text, params),
};

export async function initDb() {
  try {
    const client = await pool.connect();
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) REFERENCES users(user_id),
        question_text TEXT NOT NULL,
        subject TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS performance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) REFERENCES users(user_id),
        question_id UUID REFERENCES questions(id),
        is_correct BOOLEAN,
        time_spent_seconds INTEGER,
        score INTEGER,
        recorded_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    client.release();
    console.log('✅ Native PostgreSQL connected and schema initialized');
  } catch (err) {
    console.error('❌ Failed to initialize PostgreSQL DB:', err.message);
  }
}
