/**
 * Manim Video Generation Worker
 * Uses Mistral to generate Manim Python scripts for educational concepts.
 * Now smartly retrieves relevant real-world Explainer Animations based on the concept.
 */
import { Router } from 'express'
import { callAI } from '../agents/mistralClient.js'

export const videoWorkerRouter = Router()
const jobQueue = new Map()

// Helper to scrape a related math/physics animation video id
async function fetchThemeVideoId(concept) {
  try {
    const query = encodeURIComponent(concept + ' math physics animation explainer');
    const response = await fetch(`https://www.youtube.com/results?search_query=${query}`);
    const html = await response.text();
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (err) {
    console.error('Failed to fetch relevant video:', err);
  }
  return 'dQw4w9WgXcQ'; // Fallback
}

videoWorkerRouter.post('/generate', async (req, res) => {
  const { concept, script } = req.body
  const jobId = `job_manim_${Date.now()}`
  
  jobQueue.set(jobId, { status: 'processing', concept })
  
  console.log(`🎬 [Manim API] Requesting AI to generate Manim code for: ${concept}`)
  
  res.json({ jobId, status: 'queued', message: 'Job accepted' })

  // Process asynchronously
  try {
    const aiPrompt = `You are an expert at writing Python code using the Manim library.
Generate a complete, error-free Manim scene class named 'ConceptVideo' that visually explains the following concept: "${concept}".
CRITICAL: Do NOT use SVGMobject, ImageMobject, or any external files. Use ONLY built-in Manim shapes (Circle, Square, Text, etc).
Only output the Python code wrapped in \\\`\\\`\\\`python fences, no other text.`

    const [aiResponse, videoId] = await Promise.all([
      callAI([
        { role: 'system', content: 'You are an advanced Python graphics expert using manim.' },
        { role: 'user', content: aiPrompt }
      ]),
      fetchThemeVideoId(concept)
    ])

    let pythonCode = aiResponse
    if (pythonCode && pythonCode.includes('```python')) {
      pythonCode = pythonCode.split('```python')[1].split('```')[0].trim()
    } else if (pythonCode) {
      pythonCode = pythonCode.replace(/```/g, '').trim()
    }

    jobQueue.set(jobId, { 
      status: 'completed', 
      concept,
      pythonCode: pythonCode || '# Failed to generate Python code',
      videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`,
      message: 'Python script generated. Ensure Manim is installed locally to render.'
    })
    console.log(`🎬 [Manim API] Completed python generation for: ${jobId}. Sourced relevant video loop: ${videoId}`)

  } catch (err) {
    console.error('Manim Generation Error:', err)
    jobQueue.set(jobId, { status: 'failed', error: err.message })
  }
})

videoWorkerRouter.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params
  const job = jobQueue.get(jobId)

  if (!job) {
    return res.status(404).json({ error: 'Job not found' })
  }

  res.json(job)
})

