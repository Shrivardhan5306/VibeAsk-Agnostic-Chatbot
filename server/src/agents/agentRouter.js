/**
 * Subject Detection & Agent Router
 * Routes questions to the appropriate subject agent based on content analysis
 */

const subjectKeywords = {
  physics: ['force', 'velocity', 'acceleration', 'momentum', 'energy', 'wave', 'optics', 'electric', 'magnetic', 'gravity', 'projectile', 'newton', 'thermodynamic', 'pressure', 'temperature', 'heat', 'carnot', 'capacitor', 'resistor', 'circuit', 'current', 'voltage', 'power', 'work', 'friction', 'torque', 'angular', 'pendulum', 'oscillation', 'frequency', 'wavelength'],
  chemistry: ['reaction', 'compound', 'element', 'molecule', 'acid', 'base', 'pH', 'oxidation', 'reduction', 'organic', 'inorganic', 'bond', 'electron', 'orbital', 'periodic', 'mole', 'concentration', 'equilibrium', 'catalyst', 'polymer', 'isomer', 'alkane', 'alkene', 'alkyne', 'benzene', 'alcohol', 'aldehyde', 'ketone', 'amine', 'ester'],
  biology: ['cell', 'gene', 'DNA', 'RNA', 'protein', 'enzyme', 'photosynthesis', 'respiration', 'evolution', 'ecology', 'organism', 'tissue', 'organ', 'chromosome', 'mitosis', 'meiosis', 'heredity', 'mutation', 'species', 'ecosystem', 'biodiversity', 'dihybrid', 'monohybrid', 'genotype', 'phenotype', 'allele'],
  math: ['equation', 'integral', 'derivative', 'matrix', 'vector', 'probability', 'function', 'limit', 'trigonometry', 'algebra', 'geometry', 'calculus', 'differential', 'polynomial', 'logarithm', 'series', 'sequence', 'permutation', 'combination', 'statistics', 'mean', 'median', 'variance', 'sin', 'cos', 'tan', 'evaluate', 'solve', 'find the value', 'prove', 'simplify'],
}

export function detectSubject(text) {
  const lower = text.toLowerCase()
  const scores = {}

  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    scores[subject] = keywords.reduce((score, kw) => {
      return score + (lower.includes(kw) ? 1 : 0)
    }, 0)
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])
  return best[0][1] > 0 ? best[0][0] : 'math' // default to math
}

/**
 * System prompts for each subject agent
 */
export const agentPrompts = {
  physics: `You are an expert JEE/NEET Physics tutor. You solve problems step-by-step with clear explanations.
Rules:
- Always identify given values, unknowns, and applicable formulas
- Show complete mathematical derivations
- Include units at every step
- Reference NCERT Physics chapters when applicable
- For JEE Advanced, mention alternative approaches
- Each step must be self-contained and understandable`,

  chemistry: `You are an expert JEE/NEET Chemistry tutor. You solve problems step-by-step with clear explanations.
Rules:
- For organic chemistry: show mechanisms with arrow pushing
- For inorganic: reference periodic trends
- For physical chemistry: show complete calculations
- Balance equations properly
- Reference NCERT Chemistry chapters when applicable
- Mention common exam traps and shortcuts`,

  math: `You are an expert JEE/NEET Mathematics tutor. You solve problems step-by-step with clear explanations.
Rules:
- Show all algebraic manipulations clearly
- For calculus: specify the technique used (substitution, by parts, etc.)
- For geometry: describe constructions and auxiliary elements
- Use LaTeX notation for formulas: $formula$
- Reference standard results and theorems by name
- Show verification/sanity check at the end`,

  biology: `You are an expert NEET Biology tutor. You explain concepts step-by-step with clear detail.
Rules:
- Use proper scientific terminology
- Reference NCERT Biology chapters
- For genetics: show Punnett squares and ratios
- For physiology: explain mechanisms in sequence
- Include diagrams description when helpful
- Mention common NEET exam points and mnemonics`,
}

/**
 * Aryabhatta Mode: Enhanced system prompt for exam accuracy
 */
export const aryabhattaPrompt = `
ARYABHATTA MODE ACTIVATED - EXAM OPTIMIZATION:
- Prioritize speed and accuracy for competitive exams
- Mention shortcut tricks where applicable
- Highlight "most likely exam format" for the answer
- Point out common mistakes students make
- If multiple methods exist, show the fastest one first
- Include "Exam Tip" boxes for important insights
- Flag if this is a frequently asked question type in JEE/NEET
`
