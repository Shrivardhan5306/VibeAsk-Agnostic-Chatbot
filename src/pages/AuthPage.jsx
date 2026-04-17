import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useStore'
import { RiFlashlightLine, RiGoogleLine } from 'react-icons/ri'
import { auth, googleProvider, signInWithPopup } from '../firebase'

export default function AuthPage() {
  const { loginWithFirebase } = useAuthStore()
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      await loginWithFirebase(result.user);
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError('Failed to log in with Google. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-violet/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
            <RiFlashlightLine className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold gradient-text">VibeAsk</span>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-8 text-center bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-3 text-white">
            Welcome to VibeAsk
          </h2>
          <p className="text-dark-300 text-sm mb-10">
            Sign in to access your personalized tutoring dashboard and track your learning progress natively.
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Google Login Only */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 rounded-xl bg-white text-gray-900 border border-transparent font-semibold shadow-lg transition-all hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RiGoogleLine className="text-2xl text-blue-600" />
            Continue with Google
          </button>
          
          <p className="text-dark-400 text-xs mt-8">
            By continuing, you agree to VibeAsk's Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
