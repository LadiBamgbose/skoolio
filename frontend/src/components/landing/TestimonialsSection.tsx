import { motion } from 'framer-motion'
import TestimonialCard from './TestimonialCard'

const testimonials = [
  {
    quote: "My students' test scores improved by 35% after using Skoolio! They actually ask when we can play the 'learning games' again.",
    name: "Sarah Johnson",
    title: "5th Grade Teacher, Lincoln Elementary",
    initial: "S",
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-400",
    delay: 0.1
  },
  {
    quote: "Skoolio transformed my classroom! Even my most reluctant learners are engaged. It's like magic watching them compete to answer questions correctly.",
    name: "Michael Chen",
    title: "Middle School Science, Roosevelt Academy",
    initial: "M",
    gradientFrom: "from-cyan-400",
    gradientTo: "to-blue-500",
    delay: 0.2
  },
  {
    quote: "I save hours of prep time, and my students retain information 60% better. Skoolio makes every lesson feel like a celebration!",
    name: "Emily Rodriguez",
    title: "High School History, Maple Grove High",
    initial: "E",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    delay: 0.3
  },
  {
    quote: "Parent-teacher conferences are so much better now. Parents tell me their kids talk about our 'quiz games' at dinner. Learning has become fun again!",
    name: "David Thompson",
    title: "4th Grade Teacher, Sunshine Elementary",
    initial: "D",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-400",
    delay: 0.4
  }
]

export default function TestimonialsSection() {
  return (
    <motion.div 
      className="mt-32 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Loved by teachers everywhere
      </motion.h2>

      {/* Desktop: 4 columns, Mobile: horizontal scroll */}
      <div className="w-full mb-20">
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              initial={testimonial.initial}
              gradientFrom={testimonial.gradientFrom}
              gradientTo={testimonial.gradientTo}
              delay={testimonial.delay}
            />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-none w-80 snap-center">
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  title={testimonial.title}
                  initial={testimonial.initial}
                  gradientFrom={testimonial.gradientFrom}
                  gradientTo={testimonial.gradientTo}
                  delay={testimonial.delay}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
