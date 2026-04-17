import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePersonalizationStore } from '../store/useStore'
import { RiSearchLine, RiFilterLine, RiFlashlightLine, RiArrowRightLine } from 'react-icons/ri'

const allQuestions = [
  { id: 1, text: 'A Carnot engine operates between 500K and 300K. Find its efficiency.', subject: 'physics', chapter: 'Thermodynamics', difficulty: 'medium', tags: ['JEE Main'] },
  { id: 2, text: 'Identify the major product: CH₃CH=CH₂ + HBr →', subject: 'chemistry', chapter: 'Organic Chemistry', difficulty: 'easy', tags: ['NEET'] },
  { id: 3, text: 'Evaluate: ∫(x²+1)/(x⁴+1) dx', subject: 'math', chapter: 'Integration', difficulty: 'hard', tags: ['JEE Advanced'] },
  { id: 4, text: 'In a dihybrid cross AaBb × AaBb, what fraction will be homozygous for both traits?', subject: 'biology', chapter: 'Genetics', difficulty: 'medium', tags: ['NEET'] },
  { id: 5, text: 'A ball is thrown vertically upwards with velocity 20 m/s. Find the maximum height.', subject: 'physics', chapter: 'Kinematics', difficulty: 'easy', tags: ['JEE Main'] },
  { id: 6, text: 'Balance the equation: KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂', subject: 'chemistry', chapter: 'Redox Reactions', difficulty: 'medium', tags: ['JEE Main', 'NEET'] },
  { id: 7, text: 'Find the derivative of sin(x²) using chain rule.', subject: 'math', chapter: 'Differentiation', difficulty: 'easy', tags: ['JEE Main'] },
  { id: 8, text: 'Describe the process of photosynthesis and its significance.', subject: 'biology', chapter: 'Plant Physiology', difficulty: 'easy', tags: ['NEET'] },
  { id: 9, text: 'Two charges of +2μC and -3μC are placed 10 cm apart. Find the electric field at midpoint.', subject: 'physics', chapter: 'Electrostatics', difficulty: 'hard', tags: ['JEE Advanced'] },
  { id: 10, text: 'Calculate the pH of 0.01M HCl solution.', subject: 'chemistry', chapter: 'Ionic Equilibrium', difficulty: 'easy', tags: ['NEET'] },
  { id: 11, text: 'Solve the differential equation: dy/dx + 2y = e^x', subject: 'math', chapter: 'Differential Equations', difficulty: 'hard', tags: ['JEE Advanced'] },
  { id: 12, text: 'Explain the structure and function of DNA.', subject: 'biology', chapter: 'Molecular Biology', difficulty: 'medium', tags: ['NEET'] },
]

const subjects = ['all', 'physics', 'chemistry', 'math', 'biology']
const difficulties = ['all', 'easy', 'medium', 'hard']

const badgeClass = { physics: 'badge-physics', chemistry: 'badge-chemistry', math: 'badge-math', biology: 'badge-biology' }
const diffColor = { easy: 'bg-accent-emerald/10 text-accent-emerald', medium: 'bg-accent-amber/10 text-accent-amber', hard: 'bg-accent-rose/10 text-accent-rose' }

export default function QuestionBankPage() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [diffFilter, setDiffFilter] = useState('all')
  const [tab, setTab] = useState('all') // all | foryou
  const { suggestedQuestions } = usePersonalizationStore()

  const filtered = (tab === 'foryou' ? suggestedQuestions : allQuestions).filter(q => {
    if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false
    if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2"><span className="gradient-text">Question</span> Bank</h1>
          <p className="text-dark-300">Practice targeted problems for JEE & NEET</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'all', label: 'All Questions' }, { key: 'foryou', label: '🎯 For You' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'gradient-bg text-white' : 'bg-dark-700 text-dark-300 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="input-field pl-11" />
          </div>
          <div className="flex gap-2">
            {subjects.map(s => (
              <button key={s} onClick={() => setSubjectFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${subjectFilter === s ? 'gradient-bg text-white' : 'bg-dark-700 text-dark-300 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {difficulties.map(d => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${diffFilter === d ? 'gradient-bg text-white' : 'bg-dark-700 text-dark-300 hover:text-white'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/solve?q=${encodeURIComponent(q.text)}`} className="card p-5 flex items-start gap-4 group block">
                <div className="w-10 h-10 rounded-xl gradient-bg-subtle flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <RiFlashlightLine className="text-accent-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark-100 group-hover:text-white transition-colors mb-2">{q.text}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${badgeClass[q.subject]}`}>{q.subject}</span>
                    <span className="text-[10px] text-dark-400">{q.chapter}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                    {q.tags?.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600 text-dark-300">{t}</span>)}
                  </div>
                </div>
                <RiArrowRightLine className="text-dark-500 group-hover:text-accent-blue group-hover:translate-x-1 transition-all mt-1" />
              </Link>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-dark-400">
              <RiSearchLine className="text-4xl mx-auto mb-3" />
              <p>No questions found. Try different filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
