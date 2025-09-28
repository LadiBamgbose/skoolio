import HeroSection from '../components/HeroSection'
import TestimonialsSection from '../components/TestimonialsSection'
import PricingSection from '../components/PricingSection'

export default function Landing() {
  return (
    <div className="pt-20">
      <HeroSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}
