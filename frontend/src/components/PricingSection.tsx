import { motion } from 'framer-motion'
import { Check, X, Star } from 'lucide-react'
import PricingCard from './PricingCard'

const pricingPlans = [
  {
    name: "Free Plan",
    description: "Perfect for trying out Skoolio",
    price: 0,
    period: "month",
    credits: "50 credits daily",
    creditsSubtext: "~10 quizzes per day",
    buttonText: "Get Started Free",
    buttonStyle: "secondary" as const,
    popular: false,
    features: [
      { text: "50 daily quiz credits", included: true },
      { text: "Basic quiz templates", included: true },
      { text: "Up to 20 students per game", included: true },
      { text: "Real-time gameplay", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Custom branding", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Priority support", included: false }
    ]
  },
  {
    name: "Pro Plan",
    description: "For active teachers and small schools",
    price: 12,
    period: "month",
    credits: "500 credits daily",
    creditsSubtext: "~100 quizzes per day",
    buttonText: "Start Pro Trial",
    buttonStyle: "primary" as const,
    popular: true,
    features: [
      { text: "500 daily quiz credits", included: true },
      { text: "Advanced quiz templates", included: true },
      { text: "Up to 100 students per game", included: true },
      { text: "Real-time gameplay", included: true },
      { text: "Detailed analytics & insights", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom branding", included: true },
      { text: "Export quiz data", included: true },
      { text: "Advanced question types", included: true }
    ]
  },
  {
    name: "Premier Plan",
    description: "For schools and districts",
    price: 29,
    period: "month",
    credits: "Unlimited credits",
    creditsSubtext: "No daily limits",
    buttonText: "Contact Sales",
    buttonStyle: "secondary" as const,
    popular: false,
    features: [
      { text: "Unlimited quiz credits", included: true },
      { text: "All quiz templates & features", included: true },
      { text: "Unlimited students per game", included: true },
      { text: "Real-time gameplay", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Full custom branding", included: true },
      { text: "API access", included: true },
      { text: "Dedicated account manager", included: true }
    ]
  }
]

export default function PricingSection() {
  return (
    <div className="bg-gradient-to-b from-white via-cyan-100 via-blue-100 to-white py-20 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your Teaching
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent"> Superpower</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From curious beginners to classroom heroes - find the perfect plan to transform your lessons into unforgettable learning adventures
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              {...plan}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            Need a custom solution for your school or district?
          </p>
          <motion.button
            className="px-8 py-3 text-cyan-600 border-2 border-cyan-200 rounded-lg font-medium hover:bg-cyan-50 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Our Education Team
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
