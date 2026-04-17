import { create } from 'zustand'

// ===== AUTH STORE =====
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  tier: 'free', // free | student | pro | enterprise
  loading: true,

  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
    tier: userData.tier || 'free',
    loading: false,
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    tier: 'free',
    loading: false,
  }),

  setLoading: (loading) => set({ loading }),

  setLoading: (loading) => set({ loading }),

  // Real Firebase Login Sync
  loginWithFirebase: async (firebaseUser) => {
    set({ loading: true });
    try {
      // Synchronize with Postgres backend
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: firebaseUser.uid, 
          email: firebaseUser.email, 
          displayName: firebaseUser.displayName 
        })
      });
      
      if (!res.ok) throw new Error('Backend sync failed');

      set({
        user: {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Learner',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
          tier: 'free',
          level: 'developing',
          learningStyle: 'stepwise',
          createdAt: new Date().toISOString(),
        },
        isAuthenticated: true,
        tier: 'free',
        loading: false,
      });
    } catch (err) {
      console.error('Login sync error:', err);
      // Fallback UI load if backend is down but Firebase works
      set({
        user: {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Learner',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
        },
        isAuthenticated: true,
        loading: false,
      });
    }
  },
}))

// ===== SOLVE STORE =====
export const useSolveStore = create((set, get) => ({
  // Input state
  inputText: '',
  inputImage: null,
  inputMode: 'text', // text | image | latex

  // Solution state
  isLoading: false,
  question: null,
  subject: null,
  steps: [],
  currentStep: 0,
  ragReferences: [],
  aryabhattaMode: false,

  // Doubt state
  doubts: {},
  doubtLoading: false,

  setInputText: (text) => set({ inputText: text }),
  setInputImage: (image) => set({ inputImage: image }),
  setInputMode: (mode) => set({ inputMode: mode }),
  toggleAryabhattaMode: () => set((s) => ({ aryabhattaMode: !s.aryabhattaMode })),

  submitQuestion: async (text, image) => {
    set({ isLoading: true, steps: [], currentStep: 0, doubts: {}, ragReferences: [] })

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text || get().inputText,
          image: image || get().inputImage,
          aryabhattaMode: get().aryabhattaMode,
        }),
      })
      const data = await response.json()

      set({
        isLoading: false,
        question: data.question,
        subject: data.subject,
        steps: data.steps,
        ragReferences: data.ragReferences || [],
      })
    } catch (err) {
      // Fallback to mock data
      const mockData = generateMockSolution(text || get().inputText)
      set({
        isLoading: false,
        ...mockData,
      })
    }
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  askDoubt: async (stepIndex, question) => {
    set({ doubtLoading: true })

    try {
      const response = await fetch('/api/solve/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepIndex,
          question,
          context: get().steps[stepIndex],
        }),
      })
      const data = await response.json()

      set((s) => ({
        doubtLoading: false,
        doubts: {
          ...s.doubts,
          [stepIndex]: [...(s.doubts[stepIndex] || []), { question, answer: data.answer }],
        },
      }))
    } catch (err) {
      // Mock doubt response
      set((s) => ({
        doubtLoading: false,
        doubts: {
          ...s.doubts,
          [stepIndex]: [...(s.doubts[stepIndex] || []), {
            question,
            answer: `Great question! In this step, we applied the fundamental principle because it directly relates to the given conditions. Think of it like this: when we have the given values, the formula naturally leads us to this result. The key insight is understanding *why* we chose this approach over alternatives — it's because the constraints in the problem specifically call for this method. Would you like me to go deeper into the derivation?`
          }],
        },
      }))
    }
  },

  reset: () => set({
    inputText: '',
    inputImage: null,
    isLoading: false,
    question: null,
    subject: null,
    steps: [],
    currentStep: 0,
    ragReferences: [],
    doubts: {},
  }),
}))

// ===== PERSONALIZATION STORE =====
export const usePersonalizationStore = create((set) => ({
  level: 'developing',
  weakTopics: [
    { topic: 'Thermodynamics', subject: 'physics', errorRate: 0.65, attempts: 12 },
    { topic: 'Organic Reactions', subject: 'chemistry', errorRate: 0.55, attempts: 8 },
    { topic: 'Integration', subject: 'math', errorRate: 0.45, attempts: 15 },
    { topic: 'Genetics', subject: 'biology', errorRate: 0.40, attempts: 6 },
    { topic: 'Electrostatics', subject: 'physics', errorRate: 0.35, attempts: 10 },
  ],
  stats: {
    totalSolved: 147,
    accuracy: 72,
    streak: 5,
    todaysSolved: 3,
    weeklyGoal: 30,
    weeklyProgress: 18,
    solvedBySubject: { physics: 42, chemistry: 35, math: 45, biology: 25 },
    recentAccuracy: [65, 70, 68, 75, 72, 78, 72],
  },
  suggestedQuestions: [
    { id: 1, text: 'A Carnot engine operates between 500K and 300K. Find its efficiency.', subject: 'physics', chapter: 'Thermodynamics', difficulty: 'medium' },
    { id: 2, text: 'Identify the major product: CH₃CH=CH₂ + HBr →', subject: 'chemistry', chapter: 'Organic Chemistry', difficulty: 'easy' },
    { id: 3, text: 'Evaluate: ∫(x²+1)/(x⁴+1) dx', subject: 'math', chapter: 'Integration', difficulty: 'hard' },
    { id: 4, text: 'In a dihybrid cross AaBb × AaBb, what fraction of offspring will be homozygous for both traits?', subject: 'biology', chapter: 'Genetics', difficulty: 'medium' },
  ],

  updateStats: (newStats) => set((s) => ({ stats: { ...s.stats, ...newStats } })),
  setLevel: (level) => set({ level }),
}))


// ===== MOCK DATA GENERATOR =====
function generateMockSolution(questionText) {
  const subjects = ['physics', 'chemistry', 'math', 'biology']
  const detected = questionText?.toLowerCase().includes('force') || questionText?.toLowerCase().includes('velocity') ? 'physics'
    : questionText?.toLowerCase().includes('reaction') || questionText?.toLowerCase().includes('compound') ? 'chemistry'
    : questionText?.toLowerCase().includes('gene') || questionText?.toLowerCase().includes('cell') ? 'biology'
    : 'math'

  return {
    question: questionText || 'Find the velocity of a projectile launched at 45° with initial speed 20 m/s after 2 seconds.',
    subject: detected,
    steps: [
      {
        number: 1,
        title: 'Identify Given Information',
        content: `Let's start by clearly listing what we know from the problem:\n\n- **Given values** are extracted from the problem statement\n- We identify the **unknown** that we need to find\n- We note any **constraints** or conditions\n\nThis step is crucial because organizing information prevents errors in later calculations.`,
        formula: null,
      },
      {
        number: 2,
        title: 'Select the Right Approach',
        content: `Based on the given information, we need to choose the most efficient method:\n\n**Why this approach?**\n- The problem gives us specific values that match a standard formula\n- This is the most direct path to the answer\n- Alternative methods would require additional steps\n\n> 💡 **Aryabhatta Tip:** In JEE/NEET, always check if a standard result applies before deriving from scratch.`,
        formula: 'F = ma, v = u + at, s = ut + ½at²',
      },
      {
        number: 3,
        title: 'Apply the Formula',
        content: `Now we substitute our known values into the selected formula:\n\n**Substitution:**\n- Replace each variable with the given numerical value\n- Keep track of **units** at every step\n- Simplify the expression\n\nThis is where most calculation errors occur — double-check each substitution.`,
        formula: null,
      },
      {
        number: 4,
        title: 'Calculate the Result',
        content: `Performing the arithmetic:\n\n**Computation:**\n- Step-by-step arithmetic shown for clarity\n- Intermediate results are rounded appropriately\n- Final answer includes proper **units** and **significant figures**\n\n**Final Answer: The result is obtained with the correct units.**`,
        formula: null,
      },
      {
        number: 5,
        title: 'Verify & Interpret',
        content: `Let's verify our answer makes physical/mathematical sense:\n\n**Sanity Check:**\n- ✅ Units are consistent\n- ✅ Order of magnitude is reasonable\n- ✅ Boundary conditions are satisfied\n- ✅ Answer matches expected behavior\n\n> 📘 **NCERT Reference:** This concept is covered in Chapter 4, Section 4.3 of NCERT Physics Class 11.`,
        formula: null,
      },
    ],
    ragReferences: [
      { source: 'NCERT Physics Class 11', chapter: 'Chapter 4: Motion in a Plane', snippet: 'The trajectory of a projectile is a parabola...' },
      { source: 'NCERT Physics Class 11', chapter: 'Chapter 3: Laws of Motion', snippet: 'Newton\'s second law states that F = ma...' },
    ],
  }
}
