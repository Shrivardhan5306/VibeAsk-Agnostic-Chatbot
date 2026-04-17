import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useStore'
import { RiUserLine, RiShieldCheckLine, RiPaletteLine, RiNotification3Line, RiSaveLine } from 'react-icons/ri'

export default function SettingsPage() {
  const { user, tier } = useAuthStore()
  const [learningStyle, setLearningStyle] = useState(user?.learningStyle || 'stepwise')
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const tierInfo = {
    free: { label: 'Free', color: 'text-dark-300', desc: 'Basic features' },
    student: { label: 'Student', color: 'text-accent-cyan', desc: 'Full learning access' },
    pro: { label: 'Pro', color: 'text-accent-violet', desc: 'Advanced analytics + videos' },
    enterprise: { label: 'Enterprise', color: 'text-accent-amber', desc: 'Custom solutions' },
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2"><span className="gradient-text">Settings</span></h1>
          <p className="text-dark-300 mb-8">Manage your profile and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <div className="flex items-center gap-3 mb-6"><RiUserLine className="text-accent-blue text-xl" /><h3 className="font-bold text-lg">Profile</h3></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm text-dark-400 mb-1 block">Name</label><input type="text" defaultValue={user?.name} className="input-field" /></div>
              <div><label className="text-sm text-dark-400 mb-1 block">Email</label><input type="email" defaultValue={user?.email} className="input-field" disabled /></div>
            </div>
          </motion.div>

          {/* Subscription */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <div className="flex items-center gap-3 mb-6"><RiShieldCheckLine className="text-accent-emerald text-xl" /><h3 className="font-bold text-lg">Subscription</h3></div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 border border-dark-600">
              <div>
                <span className={`text-lg font-bold ${tierInfo[tier].color}`}>{tierInfo[tier].label} Plan</span>
                <p className="text-sm text-dark-400">{tierInfo[tier].desc}</p>
              </div>
              <button className="btn-primary text-sm !py-2">Upgrade</button>
            </div>
          </motion.div>

          {/* Learning Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
            <div className="flex items-center gap-3 mb-6"><RiPaletteLine className="text-accent-violet text-xl" /><h3 className="font-bold text-lg">Learning Preferences</h3></div>
            <div>
              <label className="text-sm text-dark-400 mb-3 block">Preferred explanation style</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ key: 'visual', label: '🖼️ Visual', desc: 'Diagrams & videos' }, { key: 'stepwise', label: '📝 Step-wise', desc: 'Detailed steps' }, { key: 'auditory', label: '🎧 Auditory', desc: 'Audio explanations' }].map(s => (
                  <button key={s.key} onClick={() => setLearningStyle(s.key)}
                    className={`p-4 rounded-xl text-left transition-all ${learningStyle === s.key ? 'gradient-bg-subtle border-accent-blue/30 border' : 'bg-dark-700 border border-dark-600 hover:border-dark-500'}`}>
                    <div className="text-lg mb-1">{s.label}</div>
                    <div className="text-xs text-dark-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><RiNotification3Line className="text-accent-amber text-xl" /><div><h3 className="font-bold">Notifications</h3><p className="text-sm text-dark-400">Daily practice reminders</p></div></div>
              <button onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-accent-blue' : 'bg-dark-600'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </motion.div>

          {/* Save */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <RiSaveLine /> {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
