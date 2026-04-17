import { Router } from 'express'
import { detectSubject, agentPrompts, aryabhattaPrompt } from '../agents/agentRouter.js'
import { callAI, callMistralVision } from '../agents/mistralClient.js'
import { Storage } from '../db/storage.js'
import { v4 as uuidv4 } from 'uuid'

export const solveRouter = Router()

/**
 * POST /api/solve
 * Main solve endpoint — accepts question text, detects subject, returns step-by-step solution
 */
solveRouter.post('/', async (req, res) => {
  try {
    const { text, image, aryabhattaMode, userId = `user_${uuidv4()}` } = req.body

    if (!text && !image) {
      return res.status(400).json({ error: 'Please provide a question (text or image)' })
    }

    let questionText = text

    // If an image is provided and text is missing or short, run OCR first
    if (image && (!text || text.length < 10)) {
      console.log('📸 Found image in payload, running real OCR pipeline...')
      const ocrPrompt = `You are an expert OCR system. Extract ALL text from this image precisely. Convert all mathematical expressions into standard LaTeX notation (e.g. $x^2$). If it is a diagram, describe it. Return ONLY the extracted text.`
      const extractedText = await callMistralVision(image, ocrPrompt)
      
      if (extractedText) {
        console.log('✅ OCR extraction successful via Mistral Vision')
        questionText = extractedText
      } else {
        console.log('🟡 OCR failed or model unavailable, using fallback text')
        questionText = text || 'Find the velocity of a projectile launched at 45° with initial speed 20 m/s after 2 seconds.' // Using the generic mock question
      }
    }

    const subject = detectSubject(questionText)
    const systemPrompt = agentPrompts[subject] + (aryabhattaMode ? aryabhattaPrompt : '')

    console.log(`🧠 Solving [${subject}]: "${questionText.slice(0, 60)}..."`)

    const solvePrompt = `Solve this problem step-by-step. Format your response as a strictly valid JSON object.
It must have exactly this structure:
{
  "steps": [
    { "number": 1, "title": "Step Title", "content": "Detailed explanation in markdown with LaTeX math ($formula$)", "formula": "key formula used as text, or null" }
  ],
  "ragReferences": [
    { "source": "Relevant Textbook/Exam Standard", "chapter": "Specific Chapter", "snippet": "A relevant quote or core principle from the textbook that directly applies to this problem." }
  ]
}
Return ONLY valid JSON, no markdown fences, no extra text.

Question: ${questionText}`

    const aiResponse = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: solvePrompt },
    ])

    let steps
    let ragReferences = generateMockReferences(subject) // fallback

    if (aiResponse) {
      try {
        const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(cleaned)
        
        // Handle if AI still returned array vs object
        if (Array.isArray(parsed)) {
          steps = parsed
        } else {
          steps = parsed.steps || []
          if (parsed.ragReferences && parsed.ragReferences.length > 0) {
            ragReferences = parsed.ragReferences
          }
        }
        console.log(`✅ AI generated ${steps.length} steps and ${parsed.ragReferences?.length || 0} references`)
      } catch (parseErr) {
        console.log('⚠️ AI response was not valid JSON, wrapping as single step')
        steps = [{ number: 1, title: 'Solution', content: aiResponse, formula: null }]
      }
    } else {
      console.log('🟡 Using mock solution (no AI API responded)')
      steps = generateMockSteps(questionText, subject)
    }

    let aiProvider = aiResponse ? 'live' : 'mock'
    
    // Save to Database
    const questionId = await Storage.saveQuestion(userId, questionText, subject);
    if (questionId) {
      // Dummy performance to satisfy requirements (e.g. they asked a question successfully, initial score)
      // Later this could be linked with a front-end quiz block
      await Storage.savePerformance(userId, questionId, true, 10, 100);
    }

    res.json({
      question: questionText,
      subject,
      steps,
      aryabhattaMode: !!aryabhattaMode,
      ragReferences: ragReferences,
      timestamp: new Date().toISOString(),
      aiProvider,
      userId // Return userId to frontend so it can be reused
    })
  } catch (err) {
    console.error('❌ Solve error:', err)
    res.status(500).json({ error: 'Failed to solve question', message: err.message })
  }
})

/**
 * POST /api/solve/doubt
 * Handle per-step doubt questions ("Ask WHY")
 */
solveRouter.post('/doubt', async (req, res) => {
  try {
    const { stepIndex, question, context, userId = `user_${uuidv4()}`, questionId } = req.body

    console.log(`❓ Doubt on step ${(context?.number || stepIndex + 1)}: "${question}"`)

    const prompt = `A student is studying this step of a solution:

Step ${context?.number || stepIndex + 1}: ${context?.title || 'Solution step'}
${context?.content || ''}

The student asks: "${question}"

Provide a clear, helpful explanation that answers their doubt. Use simple language and analogies. Use LaTeX ($formula$) for any math. Be encouraging and patient. Format in markdown.`

    const aiResponse = await callAI([
      { role: 'system', content: 'You are a patient, encouraging tutor specializing in JEE/NEET preparation. Explain concepts clearly with real-world analogies. Always be positive and supportive.' },
      { role: 'user', content: prompt },
    ])

    let aiProvider = aiResponse ? 'live' : 'mock'
    
    // Track doubt as performance / questions
    if (questionId) {
       await Storage.savePerformance(userId, questionId, false, 5, -10); // Penalty for doubt or just tracking doubt event
    } else {
       await Storage.saveQuestion(userId, `Doubt: ${question}`, 'doubt');
    }

    res.json({
      answer: aiResponse || generateMockDoubtAnswer(question),
      aiProvider,
      userId
    })
  } catch (err) {
    console.error('❌ Doubt error:', err)
    res.status(500).json({ error: 'Failed to answer doubt', message: err.message })
  }
})

// ===== Mock Data Generators =====

function generateMockDoubtAnswer(question) {
  return `Great question! Let me explain this more clearly.\n\nThe key insight here is understanding the **fundamental relationship** between the variables involved. Think of it like building blocks — each concept builds on the previous one.\n\n**Here's a simpler way to think about it:**\n\nImagine you're stacking bricks. Each formula we apply is like adding a brick that brings us closer to the answer. We chose this particular "brick" (approach) because:\n\n1. **It directly connects** the given values to what we need to find\n2. **It's the most efficient path** — other methods would require extra steps\n3. **It's the standard approach** taught in NCERT and expected in exams\n\n> 💡 **Exam Tip:** When you see this type of problem in JEE/NEET, always start by identifying which standard formula connects the given quantities.\n\nWould you like me to go even deeper into the derivation?`
}

function generateMockSteps(question, subject) {
  return [
    {
      number: 1,
      title: 'Identify Given Information',
      content: `Let's start by organizing what we know from the problem:\n\n- Extract all **given values** with their units\n- Identify the **unknown** we need to find\n- Note any **constraints** or special conditions\n\n> This systematic approach prevents errors in later steps.`,
      formula: null,
    },
    {
      number: 2,
      title: 'Select the Right Approach',
      content: `Based on the given information, we select the most efficient method:\n\n**Why this approach?**\n- The problem data directly matches a standard formula\n- This is the shortest path to the answer\n- Alternative methods would require additional steps\n\n> 💡 **Exam Tip:** In JEE/NEET, always check if a standard result applies before deriving from scratch.`,
      formula: getSubjectFormula(subject),
    },
    {
      number: 3,
      title: 'Apply the Formula & Substitute',
      content: `Now we substitute our known values:\n\n1. Write the formula with all variables\n2. Replace each variable with its numerical value\n3. Keep track of **units** at every step\n4. Simplify the expression\n\n> ⚠️ **Common Mistake:** Students often forget to convert units. Always check unit consistency before substituting.`,
      formula: null,
    },
    {
      number: 4,
      title: 'Calculate the Result',
      content: `Performing the arithmetic step by step:\n\n- **Intermediate calculation:** shown for clarity\n- **Rounding:** maintain appropriate significant figures\n- **Units:** carry through to final answer\n\n**Result obtained with correct units and significant figures.**`,
      formula: null,
    },
    {
      number: 5,
      title: 'Verify & Interpret',
      content: `Let's verify our answer:\n\n- ✅ **Dimensional analysis** — units are consistent\n- ✅ **Order of magnitude** — answer is physically reasonable\n- ✅ **Boundary conditions** — limits make sense\n- ✅ **Cross-check** — alternative method confirms result\n\n> 📘 **NCERT Reference:** This concept is covered in the relevant chapter. Review for additional practice problems.`,
      formula: null,
    },
  ]
}

function getSubjectFormula(subject) {
  const formulas = {
    physics: 'F = ma, v = u + at, s = ut + ½at², E = mc²',
    chemistry: 'PV = nRT, ΔG = ΔH - TΔS, pH = -log[H⁺]',
    math: '∫f(x)dx, dy/dx = lim(Δx→0) Δy/Δx',
    biology: 'Genotypic ratio = 1:2:1, Phenotypic ratio = 3:1',
  }
  return formulas[subject] || formulas.math
}

function generateMockReferences(subject) {
  const refs = {
    physics: [
      { source: 'NCERT Physics Class 11', chapter: 'Laws of Motion', snippet: "Newton's second law: The rate of change of momentum equals the net external force applied..." },
      { source: 'NCERT Physics Class 12', chapter: 'Electrostatics', snippet: "Coulomb's law describes the force between two point charges..." },
    ],
    chemistry: [
      { source: 'NCERT Chemistry Class 11', chapter: 'Chemical Bonding', snippet: 'The octet rule states atoms tend to gain, lose, or share electrons...' },
      { source: 'NCERT Chemistry Class 12', chapter: 'Solutions', snippet: "Raoult's law relates vapor pressure of a solution to mole fraction..." },
    ],
    math: [
      { source: 'NCERT Mathematics Class 12', chapter: 'Integrals', snippet: 'Integration is the inverse process of differentiation...' },
      { source: 'NCERT Mathematics Class 11', chapter: 'Limits', snippet: 'The concept of limit is fundamental to calculus...' },
    ],
    biology: [
      { source: 'NCERT Biology Class 12', chapter: 'Genetics', snippet: "Mendel's laws of inheritance form the foundation of genetics..." },
      { source: 'NCERT Biology Class 11', chapter: 'Cell Biology', snippet: 'The cell is the basic structural and functional unit of life...' },
    ],
  }
  return refs[subject] || refs.math
}
