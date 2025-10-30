import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import HeroSection from '../components/landing/HeroSection'
import PricingSection from '../components/landing/PricingSection'

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if user is in the middle of a checkout flow
      const intendedPlan = localStorage.getItem('intendedPlan')
      
      // Don't auto-redirect if user is about to checkout
      if (!intendedPlan) {
        navigate('/teacher/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="pt-20">
      <HeroSection />
      <PricingSection />
    </div>
  )
}
