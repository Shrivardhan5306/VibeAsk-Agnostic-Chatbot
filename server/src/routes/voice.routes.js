import { Router } from 'express'

export const voiceRouter = Router()

/**
 * GET /api/voice/token
 * Generate LiveKit token for the Voice Mode
 */
voiceRouter.get('/token', async (req, res) => {
  try {
    const { roomName, participantName } = req.query
    
    if (!roomName || !participantName) {
      return res.status(400).json({ error: 'Missing roomName or participantName variable' })
    }
    
    // TODO: Integrate actual LiveKit SDK
    // const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {...})
    
    console.log(`🎙️ [LiveKit Mock] Generating token for ${participantName} in room ${roomName}`)
    
    res.json({ 
      token: `mock_livekit_token_${Date.now()}`,
      websocketUrl: process.env.LIVEKIT_URL || 'wss://mock.livekit.cloud'
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate voice token' })
  }
})
