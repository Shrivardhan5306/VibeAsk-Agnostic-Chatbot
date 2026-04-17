import { Router } from 'express'
import { callMistralVision, callAI } from '../agents/mistralClient.js'

export const ocrRouter = Router()

/**
 * POST /api/ocr
 * Convert image to structured markdown using Mistral Vision API
 */
ocrRouter.post('/', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    console.log('📸 Processing OCR request...')

    const prompt = `You are an expert OCR system for educational content (JEE/NEET level). Analyze this image and:
1. Extract ALL text, including handwritten text
2. Convert mathematical expressions to LaTeX notation (e.g., $x^2 + y^2 = r^2$)
3. Identify any diagrams and describe them in [Diagram: description] format
4. Output the result as clean, structured Markdown
5. If it's a question, format it clearly as a solvable problem

Important: Preserve the logical structure and all mathematical notation.`

    const result = await callMistralVision(image, prompt)

    if (result) {
      console.log('✅ OCR successful via Mistral Vision')
      res.json({ markdown: result, source: 'mistral-vision' })
    } else {
      console.log('🟡 OCR: Mistral Vision unavailable, returning demo response')
      res.json({
        markdown: `**Extracted Question:**\n\nThe image has been received. OCR processing extracted the following:\n\n> Please type your question in the text field for best results, or verify your Mistral API key is valid for AI-powered image recognition.\n\n*Tip: For handwritten questions, ensure clear handwriting and good lighting for best OCR results.*`,
        source: 'mock',
      })
    }
  } catch (err) {
    console.error('❌ OCR error:', err)
    res.status(500).json({ error: 'OCR processing failed', message: err.message })
  }
})
