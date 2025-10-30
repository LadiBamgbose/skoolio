import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, MapPin, Globe } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpFormData } from '../../schemas/auth.schema'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BillingService } from '../../services'

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerAction?: string; // "quiz", "signup", or "demo-limit" to customize messaging
  onSwitchToLogin?: () => void; // Callback to switch to login modal
}

export default function SignUpModal({ isOpen, onClose, triggerAction, onSwitchToLogin }: SignUpModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign up')
  }

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true)
      setApiError(null)

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = data
      await registerUser(registrationData)
      
      // Success! Close modal
      reset()
      onClose()

      // Check if user was trying to upgrade to a paid plan
      const intendedPlan = localStorage.getItem('intendedPlan')
      
      if (intendedPlan && (intendedPlan === 'teacher' || intendedPlan === 'advanced')) {
        // User signed up to get a paid plan, redirect to checkout immediately
        try {
          const { url } = await BillingService.createCheckoutSession(intendedPlan as 'teacher' | 'advanced')
          localStorage.removeItem('intendedPlan') // Clear it
          window.location.href = url // Redirect to Stripe checkout (no dashboard navigation)
          return // Don't navigate to dashboard
        } catch (error) {
          console.error('Error creating checkout after signup:', error)
          localStorage.removeItem('intendedPlan')
          // Only go to dashboard if checkout fails
        }
      }
      
      // Normal signup flow OR checkout failed, go to dashboard
      navigate('/teacher/dashboard')
      
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle API errors
      if (error?.response?.data?.error) {
        setApiError(error.response.data.error)
      } else {
        setApiError('Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="text-center">
                <motion.h2 
                  className="text-3xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {triggerAction === 'quiz' ? 'Start Creating Quizzes!' : 
                   triggerAction === 'demo-limit' ? 'Demo Limit Reached!' : 
                   'Join Skoolio'}
                </motion.h2>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {triggerAction === 'quiz' 
                    ? 'Create your account to generate unlimited quizzes'
                    : triggerAction === 'demo-limit'
                     ? "You've reached the free demo limit. Sign up to create unlimited quizzes and games!"
                    : 'Transform your classroom with interactive quiz games'
                  }
                </motion.p>
              </div>
            </div>

            <div className="px-8 pb-8">
              {/* Google Sign Up */}
              <motion.button
                className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Continue with Google</span>
              </motion.button>

              {/* Divider */}
              <motion.div 
                className="relative mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with email</span>
                </div>
              </motion.div>

              {/* API Error Message */}
              {apiError && (
                <motion.div
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {apiError}
                </motion.div>
              )}

              {/* Email Form */}
              <motion.form 
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="First name"
                        {...register('firstName')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Last name"
                        {...register('lastName')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email address"
                      {...register('email')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password (min 6 characters)"
                      {...register('password')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      {...register('confirmPassword')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="City"
                        {...register('city')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="State"
                        {...register('state')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-white rounded-xl font-medium shadow-lg opacity-60 mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)"
                  }}
                  whileHover={!isLoading ? { 
                    scale: 1.02,
                    background: "linear-gradient(135deg, #1d4ed8, #22d3ee, #1e40af)"
                  } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? 'Creating account...' : triggerAction === 'quiz' ? 'Create Account & Start Quiz' : 'Create Account'}
                </motion.button>
              </motion.form>

              {/* Terms */}
              <motion.p 
                className="text-xs text-gray-500 text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                By signing up, you agree to our{' '}
                <a href="#" className="text-cyan-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-cyan-600 hover:underline">Privacy Policy</a>
              </motion.p>

              {/* Already have account? */}
              {onSwitchToLogin && (
                <motion.p 
                  className="text-sm text-gray-600 text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Already have an account?{' '}
                  <button 
                    onClick={onSwitchToLogin}
                    className="text-cyan-600 hover:underline font-medium"
                  >
                    Log in
                  </button>
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
