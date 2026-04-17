import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useSolveStore } from '../store/useStore'
import {
  RiImageAddLine, RiSendPlaneFill, RiQuestionLine, RiLightbulbLine,
  RiBookOpenLine, RiArrowDownSLine, RiLoader4Line, RiFlashlightLine,
  RiCloseLine, RiCheckLine, RiMagicLine, RiMicLine
} from 'react-icons/ri'
import { HiOutlinePhotograph } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import VoiceTutor from '../components/VoiceTutor'
import VideoGenerator from '../components/VideoGenerator'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const subjectConfig = {
  physics: { label: 'Physics', color: '#6366f1', badge: 'badge-physics' },
  chemistry: { label: 'Chemistry', color: '#10b981', badge: 'badge-chemistry' },
  math: { label: 'Math', color: '#f59e0b', badge: 'badge-math' },
  biology: { label: 'Biology', color: '#ec4899', badge: 'badge-biology' },
}

function StepCard({ step, index, isActive, onToggle, onAskDoubt, doubts, doubtLoading }) {
  const [doubtText, setDoubtText] = useState('')
  const [showDoubts, setShowDoubts] = useState(false)

  const handleAskDoubt = () => {
    if (!doubtText.trim()) return
    onAskDoubt(index, doubtText)
    setDoubtText('')
    setShowDoubts(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className={`step-card ${isActive ? 'active' : ''}`}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isActive ? 'gradient-bg text-white' : 'bg-dark-700 text-dark-300'}`}>
            {step.number}
          </div>
          <h4 className="font-semibold">{step.title}</h4>
        </div>
        <RiArrowDownSLine className={`text-xl text-dark-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 markdown-content">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {step.content}
              </ReactMarkdown>
              {step.formula && (
                <div className="mt-3 p-3 rounded-xl bg-dark-700/50 border border-dark-600 font-mono text-sm text-accent-cyan">
                  📐 {step.formula}
                </div>
              )}
            </div>

            {/* Ask WHY button */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setShowDoubts(!showDoubts)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-violet/10 text-accent-violet border border-accent-violet/20 hover:bg-accent-violet/20 transition-all"
              >
                <RiQuestionLine /> Ask WHY
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 hover:bg-accent-cyan/20 transition-all">
                <RiLightbulbLine /> Simplify
              </button>
            </div>

            {/* Doubt Section */}
            <AnimatePresence>
              {showDoubts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-3"
                >
                  {doubts?.map((d, di) => (
                    <div key={di} className="p-3 rounded-xl bg-dark-700/30 border border-dark-600/50">
                      <p className="text-sm text-accent-violet font-medium mb-1">Q: {d.question}</p>
                      <div className="text-sm text-dark-200 markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {d.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={doubtText}
                      onChange={(e) => setDoubtText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskDoubt()}
                      placeholder="Why did we use this approach?"
                      className="input-field text-sm !py-2"
                    />
                    <button
                      onClick={handleAskDoubt}
                      disabled={doubtLoading}
                      className="btn-primary !py-2 !px-4 flex items-center gap-1 text-sm whitespace-nowrap"
                    >
                      {doubtLoading ? <RiLoader4Line className="animate-spin" /> : <RiSendPlaneFill />}
                      Ask
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SolvePage() {
  const [searchParams] = useSearchParams()
  const {
    inputText, setInputText, inputImage, setInputImage, isLoading, question, subject,
    steps, currentStep, setCurrentStep, ragReferences, aryabhattaMode, toggleAryabhattaMode,
    submitQuestion, askDoubt, doubts, doubtLoading, reset
  } = useSolveStore()

  const [expandedSteps, setExpandedSteps] = useState({})
  const [showVoiceTutor, setShowVoiceTutor] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setInputText(q) }
  }, [searchParams, setInputText])

  useEffect(() => {
    if (steps.length > 0) {
      setExpandedSteps({ 0: true })
    }
  }, [steps])

  const onDrop = useCallback((files) => {
    if (files[0]) {
      const reader = new FileReader()
      reader.onload = () => setInputImage(reader.result)
      reader.readAsDataURL(files[0])
    }
  }, [setInputImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 })

  const handleSolve = () => {
    if (!inputText.trim() && !inputImage) return
    submitQuestion(inputText, inputImage)
  }

  const toggleStep = (index) => {
    setExpandedSteps(prev => ({ ...prev, [index]: !prev[index] }))
    setCurrentStep(index)
  }

  const subjectInfo = subject ? subjectConfig[subject] : null

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-6">
      <div className="max-w-6xl mx-auto relative">
      
        <AnimatePresence>
          {showVoiceTutor && (
            <VoiceTutor 
              initialText={`Let's review the solution for ${subject || 'your question'}. What do you need help with?`} 
              questionDetails={question}
              solutionSteps={steps}
              onClose={() => setShowVoiceTutor(false)} 
            />
          )}
        </AnimatePresence>

        {/* Input Section */}
        {!steps.length && !isLoading && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="gradient-text">Solve</span> Any Question
              </h1>
              <p className="text-dark-300">Upload an image, type your question, or paste LaTeX</p>
            </div>

            {/* Upload Zone */}
            <div {...getRootProps()} className={`card p-8 text-center cursor-pointer mb-4 transition-all ${isDragActive ? 'border-accent-blue/50 bg-accent-blue/5' : ''}`}>
              <input {...getInputProps()} />
              {inputImage ? (
                <div className="relative inline-block">
                  <img src={inputImage} alt="Uploaded" className="max-h-48 rounded-xl mx-auto" />
                  <button onClick={(e) => { e.stopPropagation(); setInputImage(null) }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-rose flex items-center justify-center">
                    <RiCloseLine className="text-white text-sm" />
                  </button>
                </div>
              ) : (
                <>
                  <HiOutlinePhotograph className="text-4xl text-dark-400 mx-auto mb-3" />
                  <p className="text-dark-300 text-sm">Drag & drop an image, or click to upload</p>
                  <p className="text-dark-500 text-xs mt-1">Supports handwritten & printed questions</p>
                </>
              )}
            </div>

            {/* Text Input */}
            <div className="relative mb-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSolve() }}}
                placeholder="Type your question here... (Supports LaTeX: $x^2 + y^2 = r^2$)"
                className="input-field !rounded-2xl min-h-[120px] resize-none pr-14"
                rows={4}
              />
              <button
                onClick={handleSolve}
                disabled={!inputText.trim() && !inputImage}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white disabled:opacity-30 hover:scale-105 transition-transform"
              >
                <RiSendPlaneFill />
              </button>
            </div>

            {/* Aryabhatta Mode Toggle */}
            <div className="flex items-center justify-center gap-3">
               <button
                onClick={toggleAryabhattaMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${aryabhattaMode ? 'gradient-bg text-white glow-blue' : 'bg-dark-700 text-dark-300 hover:text-white'}`}
              >
                <RiMagicLine /> Aryabhatta Mode {aryabhattaMode ? '(ON)' : '(OFF)'}
              </button>
              <span className="text-[11px] text-dark-500">JEE/NEET optimized</span>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto text-center py-20">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <RiFlashlightLine className="text-white text-2xl animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">AI is solving your question...</h2>
            <p className="text-dark-400">Detecting subject • Generating step-by-step solution</p>
          </motion.div>
        )}

        {/* Solution Section */}
        {steps.length > 0 && !isLoading && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Steps Column */}
            <div className="lg:col-span-2">
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                {/* Question Header */}
                <div className="card p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {subjectInfo && <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${subjectInfo.badge}`}>{subjectInfo.label}</span>}
                      {aryabhattaMode && <span className="px-3 py-1 rounded-lg text-xs font-bold bg-accent-amber/15 text-accent-amber border border-accent-amber/30">⚡ Aryabhatta Mode</span>}
                    </div>
                    <button 
                      onClick={() => setShowVoiceTutor(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-cyan border border-accent-blue/30 rounded-lg transition-colors text-xs font-bold"
                    >
                      <RiMicLine /> Talk to Tutor
                    </button>
                  </div>
                  <p className="text-dark-100 leading-relaxed">{question}</p>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <StepCard
                      key={i}
                      step={step}
                      index={i}
                      isActive={expandedSteps[i]}
                      onToggle={() => toggleStep(i)}
                      onAskDoubt={askDoubt}
                      doubts={doubts[i]}
                      doubtLoading={doubtLoading}
                    />
                  ))}
                </div>

                <button onClick={reset} className="btn-secondary mt-6 flex items-center gap-2">
                  Solve Another Question
                </button>
              </motion.div>
            </div>

            {/* Sidebar - RAG References & Tools */}
            <div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="card p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <RiBookOpenLine className="text-accent-cyan" />
                  <h3 className="font-bold">Textbook References</h3>
                </div>
                {ragReferences.length > 0 ? (
                  <div className="space-y-3">
                    {ragReferences.map((ref, i) => (
                      <div key={i} className="p-3 rounded-xl bg-dark-700/50 border border-dark-600/50">
                        <p className="text-xs font-bold text-accent-cyan mb-1">{ref.source}</p>
                        <p className="text-xs text-dark-300 mb-1">{ref.chapter}</p>
                        <p className="text-sm text-dark-200 italic">"{ref.snippet}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dark-400">No references found. Upload PDFs in Settings to enable RAG.</p>
                )}

                <div className="mt-6 p-4 rounded-xl gradient-bg-subtle border border-accent-blue/20">
                  <div className="flex items-center gap-2 mb-2"><RiCheckLine className="text-accent-emerald" /><span className="text-sm font-bold">Verified Solution</span></div>
                  <p className="text-xs text-dark-300">This solution follows standard textbook methodology and is optimized for exam accuracy.</p>
                </div>
                
                {/* Manim Video generator panel */}
                <VideoGenerator concept={question} />

              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

