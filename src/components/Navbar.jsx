import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useStore'
import { HiOutlineHome, HiOutlineLightBulb, HiOutlineCollection, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi'
import { RiFlashlightLine } from 'react-icons/ri'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/solve', label: 'Solve', icon: HiOutlineLightBulb },
  { path: '/questions', label: 'Questions', icon: HiOutlineCollection },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog },
]

const tierColors = {
  free: 'text-dark-300',
  student: 'text-accent-cyan',
  pro: 'text-accent-violet',
  enterprise: 'text-accent-amber',
}

export default function Navbar() {
  const location = useLocation()
  const { user, tier, logout } = useAuthStore()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:shadow-accent-blue/30 transition-shadow">
            <RiFlashlightLine className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold gradient-text">VibeAsk</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive ? 'text-white' : 'text-dark-200 hover:text-white hover:bg-dark-700/50'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 gradient-bg-subtle rounded-xl border border-accent-blue/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className="relative z-10 text-lg" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User Area */}
        <div className="flex items-center gap-4">
          <span className={`text-xs font-semibold uppercase tracking-wider ${tierColors[tier]}`}>
            {tier}
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={logout}
              className="text-dark-300 hover:text-accent-rose transition-colors"
              title="Logout"
            >
              <HiOutlineLogout className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
