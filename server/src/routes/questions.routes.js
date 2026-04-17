import { Router } from 'express'

export const questionsRouter = Router()

// In-memory question bank
const questionBank = [
  { id: '1', text: 'A Carnot engine operates between 500K and 300K. Find its efficiency.', subject: 'physics', chapter: 'Thermodynamics', difficulty: 'medium', tags: ['JEE Main'], answer: 'η = 1 - T₂/T₁ = 1 - 300/500 = 0.4 = 40%' },
  { id: '2', text: 'Identify the major product: CH₃CH=CH₂ + HBr →', subject: 'chemistry', chapter: 'Organic Chemistry', difficulty: 'easy', tags: ['NEET'], answer: 'CH₃CHBrCH₃ (Markovnikov addition)' },
  { id: '3', text: 'Evaluate: ∫(x²+1)/(x⁴+1) dx', subject: 'math', chapter: 'Integration', difficulty: 'hard', tags: ['JEE Advanced'], answer: 'Use substitution and partial fractions' },
  { id: '4', text: 'In a dihybrid cross AaBb × AaBb, what fraction of offspring will be homozygous for both traits?', subject: 'biology', chapter: 'Genetics', difficulty: 'medium', tags: ['NEET'], answer: '1/16 (AABB) + 1/16 (AAbb) + 1/16 (aaBB) + 1/16 (aabb) = 4/16 = 1/4' },
  { id: '5', text: 'A ball is thrown vertically upwards with velocity 20 m/s. Find the maximum height. (g=10 m/s²)', subject: 'physics', chapter: 'Kinematics', difficulty: 'easy', tags: ['JEE Main'], answer: 'H = u²/2g = 400/20 = 20m' },
  { id: '6', text: 'Balance: KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂', subject: 'chemistry', chapter: 'Redox Reactions', difficulty: 'medium', tags: ['JEE Main', 'NEET'], answer: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂' },
  { id: '7', text: 'Find the derivative of sin(x²) using chain rule.', subject: 'math', chapter: 'Differentiation', difficulty: 'easy', tags: ['JEE Main'], answer: 'd/dx[sin(x²)] = cos(x²) · 2x = 2x·cos(x²)' },
  { id: '8', text: 'Describe the light-dependent reactions of photosynthesis.', subject: 'biology', chapter: 'Plant Physiology', difficulty: 'easy', tags: ['NEET'], answer: 'Occurs in thylakoid membrane, involves PS-II and PS-I' },
  { id: '9', text: 'Two charges +2μC and -3μC are 10cm apart. Find the electric field at midpoint.', subject: 'physics', chapter: 'Electrostatics', difficulty: 'hard', tags: ['JEE Advanced'], answer: 'E = kq/r² for each charge, fields add as both point same direction at midpoint' },
  { id: '10', text: 'Calculate the pH of 0.01M HCl solution.', subject: 'chemistry', chapter: 'Ionic Equilibrium', difficulty: 'easy', tags: ['NEET'], answer: 'pH = -log(0.01) = -log(10⁻²) = 2' },
  { id: '11', text: 'Solve: dy/dx + 2y = eˣ', subject: 'math', chapter: 'Differential Equations', difficulty: 'hard', tags: ['JEE Advanced'], answer: 'IF = e^(2x), y·e^(2x) = ∫e^(3x)dx = e^(3x)/3 + C' },
  { id: '12', text: 'Explain the structure and function of DNA double helix.', subject: 'biology', chapter: 'Molecular Biology', difficulty: 'medium', tags: ['NEET'], answer: 'Double helix with antiparallel strands, A-T (2 H-bonds), G-C (3 H-bonds)' },
]

/**
 * GET /api/questions
 * Get filtered questions from the bank
 */
questionsRouter.get('/', (req, res) => {
  const { subject, difficulty, chapter, tag, search, limit = 20, offset = 0 } = req.query

  let filtered = [...questionBank]

  if (subject) filtered = filtered.filter(q => q.subject === subject)
  if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty)
  if (chapter) filtered = filtered.filter(q => q.chapter.toLowerCase().includes(chapter.toLowerCase()))
  if (tag) filtered = filtered.filter(q => q.tags.includes(tag))
  if (search) filtered = filtered.filter(q => q.text.toLowerCase().includes(search.toLowerCase()))

  res.json({
    questions: filtered.slice(Number(offset), Number(offset) + Number(limit)),
    total: filtered.length,
  })
})

/**
 * GET /api/questions/:id
 */
questionsRouter.get('/:id', (req, res) => {
  const question = questionBank.find(q => q.id === req.params.id)
  if (!question) return res.status(404).json({ error: 'Question not found' })
  res.json(question)
})
