import { motion } from 'framer-motion'
import PricingCard from './PricingCard'

export default function PricingSection() {
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
      price: '$9.99',
      period: 'month',
      features: [
        'Unlimited quizzes',
        'All question types',
        'Up to 50 questions per quiz',
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
      price: '$19.99',
      period: 'month',
      features: [
        'Everything in Teacher',
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

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto items-stretch">
          {pricingPlans.map((plan, index) => (
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
                buttonText={plan.buttonText}
                onSelect={() => console.log(`Selected ${plan.title} plan`)}
              />
            </motion.div>
          ))}
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
    </section>
  )
}

