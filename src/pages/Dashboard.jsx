import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore, usePersonalizationStore } from '../store/useStore'
import { RiFlashlightLine, RiFireLine, RiFocus3Line, RiArrowRightLine, RiBookOpenLine, RiTimeLine, RiTrophyLine, RiBarChartBoxLine } from 'react-icons/ri'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } })
}

const subjectColors = { physics: '#6366f1', chemistry: '#10b981', math: '#f59e0b', biology: '#ec4899' }
const subjectLabels = { physics: 'Physics', chemistry: 'Chemistry', math: 'Math', biology: 'Biology' }

export default function Dashboard() {
  const { user } = useAuthStore()
  const { stats, weakTopics, suggestedQuestions, level } = usePersonalizationStore()

  const subjectData = Object.entries(stats.solvedBySubject).map(([key, value]) => ({ name: subjectLabels[key], solved: value, fill: subjectColors[key] }))
  const weeklyData = stats.recentAccuracy.map((acc, i) => ({ day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], accuracy: acc }))
  const levelColors = { beginner: 'text-accent-emerald', developing: 'text-accent-amber', advanced: 'text-accent-violet' }

  const tooltipStyle = { background: '#12121a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '13px' }

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Student'}</span> 👋</h1>
          <p className="text-dark-300">Your level: <span className={`font-semibold capitalize ${levelColors[level]}`}>{level}</span> • Keep pushing forward!</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: RiBookOpenLine, label: 'Total Solved', value: stats.totalSolved, color: 'text-accent-blue' },
            { icon: RiFocus3Line, label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-accent-emerald' },
            { icon: RiFireLine, label: 'Day Streak', value: stats.streak, color: 'text-accent-amber' },
            { icon: RiTimeLine, label: 'Today', value: `${stats.todaysSolved} solved`, color: 'text-accent-cyan' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl gradient-bg-subtle flex items-center justify-center ${s.color}`}><s.icon className="text-xl" /></div>
                <div><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-dark-400">{s.label}</div></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="card p-6">
              <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold">Weekly Accuracy</h3><span className="text-xs text-dark-400">Last 7 days</span></div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs><linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e"/><XAxis dataKey="day" stroke="#5a5a8f" fontSize={12}/><YAxis stroke="#5a5a8f" fontSize={12} domain={[0,100]}/>
                  <Tooltip contentStyle={tooltipStyle}/><Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} fill="url(#aG)"/>
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="card p-6">
              <h3 className="text-lg font-bold mb-6">Questions by Subject</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e"/><XAxis dataKey="name" stroke="#5a5a8f" fontSize={12}/><YAxis stroke="#5a5a8f" fontSize={12}/>
                  <Tooltip contentStyle={tooltipStyle}/><Bar dataKey="solved" radius={[8,8,0,0]}>{subjectData.map((e,i)=>(<rect key={i} fill={e.fill}/>))}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
              <Link to="/solve" className="block">
                <div className="card p-6 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10 border-accent-blue/20 hover:border-accent-blue/40 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform"><RiFlashlightLine className="text-white text-xl"/></div>
                      <div><h3 className="text-lg font-bold">Solve a Question</h3><p className="text-dark-300 text-sm">Upload an image or type your question</p></div>
                    </div>
                    <RiArrowRightLine className="text-2xl text-accent-blue group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="card p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold">Weekly Goal</h3><span className="text-sm text-accent-cyan">{stats.weeklyProgress}/{stats.weeklyGoal}</span></div>
              <div className="w-full h-3 rounded-full bg-dark-700 overflow-hidden">
                <motion.div initial={{width:0}} animate={{width:`${(stats.weeklyProgress/stats.weeklyGoal)*100}%`}} transition={{duration:1,ease:'easeOut'}} className="h-full rounded-full gradient-bg"/>
              </div>
              <p className="text-dark-400 text-xs mt-2">{stats.weeklyGoal-stats.weeklyProgress} more to reach your goal!</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="card p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold">Weak Areas</h3><RiBarChartBoxLine className="text-dark-400"/></div>
              <div className="space-y-3">
                {weakTopics.slice(0,4).map(t=>(
                  <div key={t.topic} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor:subjectColors[t.subject]}}/>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium">{t.topic}</span><span className="text-xs text-dark-400">{Math.round(t.errorRate*100)}%</span></div>
                      <div className="w-full h-1.5 rounded-full bg-dark-700 overflow-hidden"><div className="h-full rounded-full" style={{width:`${t.errorRate*100}%`,backgroundColor:t.errorRate>0.5?'#f43f5e':t.errorRate>0.3?'#f59e0b':'#10b981'}}/></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="card p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold">Practice These</h3><RiTrophyLine className="text-accent-amber"/></div>
              <div className="space-y-3">
                {suggestedQuestions.slice(0,3).map(q=>(
                  <Link key={q.id} to={`/solve?q=${encodeURIComponent(q.text)}`} className="block p-3 rounded-xl bg-dark-700/50 hover:bg-dark-700 transition-colors group">
                    <div className="flex items-start gap-2">
                      <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-0.5 badge-${q.subject}`}>{q.subject.slice(0,3)}</div>
                      <div className="flex-1">
                        <p className="text-sm text-dark-200 group-hover:text-white transition-colors line-clamp-2">{q.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-dark-400">{q.chapter}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${q.difficulty==='easy'?'bg-accent-emerald/10 text-accent-emerald':q.difficulty==='medium'?'bg-accent-amber/10 text-accent-amber':'bg-accent-rose/10 text-accent-rose'}`}>{q.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/questions" className="mt-4 text-sm text-accent-blue hover:underline flex items-center gap-1 justify-center">View all <RiArrowRightLine/></Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
