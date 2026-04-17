import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useStore'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import SolvePage from './pages/SolvePage'
import QuestionBankPage from './pages/QuestionBankPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-dark-900">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/solve" element={<ProtectedRoute><SolvePage /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><QuestionBankPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
