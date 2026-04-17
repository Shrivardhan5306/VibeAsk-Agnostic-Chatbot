import { Router } from 'express';
import { Storage } from '../db/storage.js';

export const authRouter = Router();

/**
 * POST /api/auth/sync
 * Syncs the Firebase provided user with the native PostgreSQL database users table.
 */
authRouter.post('/sync', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'User UID is required' });
    }

    console.log(`🔒 Syncing user to Postgres: [${uid}] ${email || 'No email'}`);
    
    // Ensure the user exists in our users table natively 
    await Storage.ensureUserExists(uid);

    res.json({
      success: true,
      message: 'User synchronized with Postgres DB',
      user: { id: uid, email, name: displayName }
    });
  } catch (err) {
    console.error('❌ Auth Sync error:', err);
    res.status(500).json({ error: 'Failed to sync user data', message: err.message });
  }
});
