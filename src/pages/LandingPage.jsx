import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useStore'
import {
  RiFlashlightLine, RiBrainLine, RiBookOpenLine, RiRocketLine,
  RiCheckLine, RiArrowRightLine, RiStarLine, RiShieldCheckLine,
  RiTeamLine, RiBarChartBoxLine
} from 'react-icons/ri'
import {
  HiOutlineLightBulb, HiOutlinePhotograph, HiOutlineAcademicCap
} from 'react-icons/hi'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
}

const features = [
  {
    icon: HiOutlinePhotograph,
    title: 'Smart OCR Input',
    desc: 'Upload handwritten questions, typed text, or LaTeX — our AI understands them all.',
    color: 'from-accent-blue to-accent-cyan',
  },
  {
    icon: RiBrainLine,
    title: 'Multi-Agent AI Solver',
    desc: 'Specialized agents for Physics, Chemistry, Math & Biology with JEE/NEET accuracy.',
    color: 'from-accent-violet to-accent-pink',
  },
  {
    icon: HiOutlineLightBulb,
    title: 'Step-by-Step Solutions',
    desc: 'Interactive steps with "Ask WHY" at each point. Never be stuck again.',
    color: 'from-accent-amber to-accent-rose',
  },
  {
    icon: RiBookOpenLine,
    title: 'Textbook-Grounded',
    desc: 'RAG-powered answers backed by NCERT and your uploaded PDFs. Zero hallucinations.',
    color: 'from-accent-emerald to-accent-cyan',
  },
  {
    icon: RiBarChartBoxLine,
    title: 'Personalized Learning',
    desc: 'Tracks your weak topics, adapts explanations, and builds custom roadmaps.',
    color: 'from-accent-cyan to-accent-blue',
  },
  {
    icon: RiRocketLine,
    title: 'Aryabhatta Mode',
    desc: 'Exam-optimized solving with JEE/NEET specific tricks and shortcuts.',
    color: 'from-accent-rose to-accent-violet',
  },
]

const pricingTiers = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['5 questions/day', 'Basic step solutions', 'Community support'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Student',
    price: '₹199',
    period: '/month',
    features: ['Unlimited questions', 'Ask WHY per step', 'Personalization', 'RAG access', 'Priority support'],
    cta: 'Start Learning',
    featured: true,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    features: ['Everything in Student', 'Advanced analytics', 'Video explanations', 'Export solutions', 'Collaboration'],
    cta: 'Go Pro',
    featured: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['White-label solution', 'Admin dashboard', 'SSO login', 'Custom AI tuning', 'Dedicated support'],
    cta: 'Contact Sales',
    featured: false,
  },
]

export default function LandingPage() {
  const { mockLogin } = useAuthStore()

  return (
    <div className="min-h-screen bg-dark-900 bg-grid overflow-hidden">
      {/* ===== TOP NAV ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <RiFlashlightLine className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">VibeAsk</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-dark-200 hover:text-white transition-colors text-sm font-medium">Login</Link>
            <Link to="/auth" className="btn-primary text-sm !py-2 !px-5">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[400px] h-[400px] bg-accent-violet/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-accent-cyan mb-8"
          >
            <RiStarLine /> Trusted by 10,000+ JEE/NEET students
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            Learn Smarter, <br />
            <span className="gradient-text glow-text">Not Harder</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-dark-200 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered step-by-step solutions, personalized learning paths, and textbook-grounded
            answers for JEE & NEET preparation. Your intelligent study companion.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4"
          >
            <button onClick={mockLogin} className="btn-primary text-lg !py-3.5 !px-8 flex items-center gap-2 animate-pulse-glow">
              Start Solving Free <RiArrowRightLine />
            </button>
            <Link to="/auth" className="btn-secondary text-lg !py-3.5 !px-8">
              Watch Demo
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '10K+', label: 'Students' },
              { value: '500K+', label: 'Questions Solved' },
              { value: '95%', label: 'Accuracy' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-dark-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="gradient-text">VibeAsk</span> Works
            </h2>
            <p className="text-dark-200 max-w-xl mx-auto">
              From question to mastery in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload', desc: 'Snap a photo or type your question', icon: HiOutlinePhotograph },
              { step: '02', title: 'AI Solves', desc: 'Subject agent generates step-by-step solution', icon: RiBrainLine },
              { step: '03', title: 'Interact', desc: 'Ask WHY at each step, dive deeper', icon: HiOutlineLightBulb },
              { step: '04', title: 'Improve', desc: 'Track progress, practice weak areas', icon: HiOutlineAcademicCap },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card p-6 text-center relative"
              >
                <div className="text-5xl font-black text-dark-700 absolute top-4 right-4">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl gradient-bg-subtle flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-accent-blue text-2xl" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-dark-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-6 bg-dark-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-dark-200 max-w-xl mx-auto">
              Everything you need to ace JEE & NEET, in one platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 
                  group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-dark-300 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-dark-200 max-w-xl mx-auto">
              Start free, upgrade when you're ready
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`pricing-card ${tier.featured ? 'featured' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-black gradient-text">{tier.price}</span>
                  <span className="text-dark-300 text-sm mb-1">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-dark-200">
                      <RiCheckLine className="text-accent-emerald flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={mockLogin}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all
                    ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-violet/5" />
          <div className="relative z-10">
            <RiShieldCheckLine className="text-4xl text-accent-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to <span className="gradient-text">Transform</span> Your Learning?
            </h2>
            <p className="text-dark-200 mb-8 max-w-lg mx-auto">
              Join thousands of students who improved their JEE/NEET scores with AI-powered personalized learning.
            </p>
            <button onClick={mockLogin} className="btn-primary text-lg !py-3.5 !px-10 flex items-center gap-2 mx-auto">
              Start Now — It's Free <RiArrowRightLine />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 px-6 border-t border-dark-700/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <RiFlashlightLine className="text-white text-sm" />
            </div>
            <span className="font-bold gradient-text">VibeAsk</span>
          </div>
          <p className="text-dark-400 text-sm">© 2026 VibeAsk. Built for students, by students.</p>
          <div className="flex items-center gap-6 text-sm text-dark-300">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
