import { motion } from 'framer-motion'
import { useState } from 'react'
import PricingCard from './PricingCard'
import SignUpModal from '../shared/SignUpModal'
import LoginModal from '../shared/LoginModal'
import { useAuth } from '../../contexts/AuthContext'
import { BillingService } from '../../services'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
// @ts-expect-error - CSS imports work at runtime
import 'swiper/css'
// @ts-expect-error - CSS imports work at runtime
import 'swiper/css/navigation'
// @ts-expect-error - CSS imports work at runtime
import 'swiper/css/pagination'

export default function PricingSection() {
  const { isAuthenticated } = useAuth()
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'teacher' | 'advanced' | null>(null)
  const pricingPlans = [
    {
      title: 'Basic',
      price: 'Free',
      features: [
        '3 quizzes per month',
        'Basic question types',
        'Up to 10 questions per quiz',
        'Standard difficulty levels',
        'Email support'
      ],
      buttonText: 'Start Free',
      isPopular: false
    },
    {
      title: 'Teacher',
      price: '$7.99',
      period: 'month',
      features: [
        '60 quizzes per month',
        'All question types',
        'Up to 30 questions per quiz',
        'Advanced customization',
        'Grade-specific content',
        'Priority support',
        'Quiz analytics'
      ],
      buttonText: 'Get Started',
      isPopular: true
    },
    {
      title: 'Advanced',
      price: '$12.99',
      period: 'month',
      features: [
        '200 quizzes per month',
        'Unlimited questions per quiz',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Advanced analytics',
        'White-label option'
      ],
      buttonText: 'Go Advanced',
      isPopular: false
    }
  ]

  // Handle plan selection
  const handlePlanSelect = async (plan: 'basic' | 'teacher' | 'advanced') => {
    setSelectedPlan(plan)

    // BASIC PLAN - Free tier
    if (plan === 'basic') {
      if (!isAuthenticated) {
        // Show signup modal for free tier
        setIsSignUpOpen(true)
      } else {
        // Already logged in, they already have basic
        console.log('You are already on the free plan')
      }
      return
    }

    // TEACHER or ADVANCED PLAN - Paid tiers
    if (!isAuthenticated) {
      // Must signup first before upgrading
      setIsSignUpOpen(true)
      // Store intended plan in localStorage for after signup
      localStorage.setItem('intendedPlan', plan)
    } else {
      // User is logged in, redirect to Stripe checkout
      try {
        setIsLoading(true)
        const { url } = await BillingService.createCheckoutSession(plan)
        // Redirect to Stripe checkout
        window.location.href = url
      } catch (error: any) {
        console.error('Error creating checkout session:', error)
        
        // Handle specific errors
        if (error?.response?.data?.error) {
          alert(error.response.data.error)
        } else {
          alert('Failed to start checkout. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your classroom needs
          </p>
        </motion.div>

        {/* Mobile Swiper Carousel */}
        <div className="md:hidden mt-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            initialSlide={1}
            navigation={true}
            pagination={{ clickable: true }}
            className="!pb-12 !pt-6"
            style={{
              '--swiper-navigation-size': '24px',
              '--swiper-navigation-color': '#06b6d4',
              '--swiper-pagination-color': '#06b6d4',
            } as React.CSSProperties}
          >
            {pricingPlans.map((plan) => {
              const planKey = plan.title.toLowerCase() as 'basic' | 'teacher' | 'advanced'
              const isCurrentlyLoading = isLoading && selectedPlan === planKey
              
              return (
                <SwiperSlide key={plan.title}>
                  <div className="h-full">
                    <PricingCard
                      title={plan.title}
                      price={plan.price}
                      period={plan.period}
                      features={plan.features}
                      isPopular={plan.isPopular}
                      buttonText={isCurrentlyLoading ? 'Loading...' : plan.buttonText}
                      onSelect={() => handlePlanSelect(planKey)}
                    />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-12 max-w-7xl mx-auto items-stretch">
          {pricingPlans.map((plan, index) => {
            const planKey = plan.title.toLowerCase() as 'basic' | 'teacher' | 'advanced'
            const isCurrentlyLoading = isLoading && selectedPlan === planKey
            
            return (
              <motion.div
                key={plan.title}
                className="flex"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  buttonText={isCurrentlyLoading ? 'Loading...' : plan.buttonText}
                  onSelect={() => handlePlanSelect(planKey)}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.p
          className="text-center mt-12 text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          All plans include AI-powered quiz generation and instant sharing
        </motion.p>
      </div>

      {/* Sign Up Modal */}
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)}
        triggerAction="signup"
        onSwitchToLogin={() => {
          setIsSignUpOpen(false)
          setIsLoginOpen(true)
        }}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
      />
    </section>
  )
}

