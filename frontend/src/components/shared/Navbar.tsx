import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import skoolioLogo from '../../assets/Skoolio.png'
import SignUpModal from './SignUpModal'
import LoginModal from './LoginModal'

export default function Navbar() {
  const navigate = useNavigate()
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
    <div className="fixed top-0 left-0 right-0 flex items-center justify-between z-50 px-4 py-4">
      {/* Logo */}
      <motion.div
        className="flex items-center cursor-pointer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
      >
        <img
          src={skoolioLogo}
          alt="Skoolio"
          className="h-13 w-auto"
        />
      </motion.div>

      {/* Auth Buttons */}
      <div className="flex space-x-3">
        <motion.button
          className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-white/50 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLoginModal(true)}
        >
          Log In
        </motion.button>
        <motion.button
          className="px-6 py-2 rounded-lg font-medium text-white shadow-lg opacity-60"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)"
          }}
          whileHover={{ 
            scale: 1.05,
            background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowSignUpModal(true)}
        >
          Sign Up
        </motion.button>
      </div>
    </div>
      
    <SignUpModal 
      isOpen={showSignUpModal}
      onClose={() => setShowSignUpModal(false)}
      triggerAction="signup"
    />
    
    <LoginModal 
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
    </>
  )
}
