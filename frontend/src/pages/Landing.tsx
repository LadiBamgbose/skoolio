import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import HeroSection from '../components/landing/HeroSection'
import UsaMap from '../components/landing/UsaMap'
import PricingSection from '../components/landing/PricingSection'

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/teacher/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="pt-20">
      <HeroSection />
      <UsaMap />
      <PricingSection />
    </div>
  )
}
