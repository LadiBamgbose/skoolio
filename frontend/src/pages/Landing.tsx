import HeroSection from '../components/landing/HeroSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import PricingSection from '../components/landing/PricingSection'

export default function Landing() {
  return (
    <div className="pt-20">
      <HeroSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}
