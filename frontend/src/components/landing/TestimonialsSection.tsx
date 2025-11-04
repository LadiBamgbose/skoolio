import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  school: string;
  image: string;
  quote: string;
  timeSaved: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Middle School Teacher",
    school: "Lincoln Middle School",
    image: "https://i.pravatar.cc/150?img=12",
    quote:
      "Skoolio cut my quiz creation time from 2 hours to just 10 minutes. I can now focus on teaching instead of paperwork!",
    timeSaved: "Saves 10+ hours per week",
  },
  {
    name: "Michael Chen",
    role: "High School Teacher",
    school: "Riverside High School",
    image: "https://i.pravatar.cc/150?img=47",
    quote:
      "The AI generates perfectly aligned questions in seconds. What used to take me an entire weekend now takes 15 minutes.",
    timeSaved: "Saves 6+ hours per week",
  },
  {
    name: "Emily Rodriguez",
    role: "Elementary Teacher",
    school: "Oakwood Elementary",
    image: "https://i.pravatar.cc/150?img=33",
    quote:
      "I love how quick and easy it is to create engaging quizzes. More time for my students, less time on admin work.",
    timeSaved: "Saves 8+ hours per week",
  },
  {
    name: "David Thompson",
    role: "Social Studies Teacher",
    school: "Washington High School",
    image: "https://i.pravatar.cc/150?img=24",
    quote:
      "Game-changing tool! I can create multiple quiz variations instantly. My students are more engaged and I have my weekends back.",
    timeSaved: "Saves 12+ hours per week",
  },
  {
    name: "Jessica Martinez",
    role: "Science Teacher",
    school: "Newton High School",
    image: "https://i.pravatar.cc/150?img=1",
    quote:
      "This saved me 15 hours a week on quiz prep. The quality is amazing and my students love the format!",
    timeSaved: "Saves 15+ hours per week",
  },
  {
    name: "Robert Kim",
    role: "Math Teacher",
    school: "Summit Middle School",
    image: "https://i.pravatar.cc/150?img=5",
    quote:
      "Finally, a tool that understands what teachers need. Simple, fast, and incredibly effective.",
    timeSaved: "Saves 9+ hours per week",
  },
  {
    name: "Lisa Anderson",
    role: "English Teacher",
    school: "Riverside Elementary",
    image: "https://i.pravatar.cc/150?img=9",
    quote:
      "Creating quizzes used to be my least favorite task. Now it takes minutes and I actually enjoy it!",
    timeSaved: "Saves 7+ hours per week",
  },
  {
    name: "James Wilson",
    role: "History Teacher",
    school: "Liberty High School",
    image: "https://i.pravatar.cc/150?img=15",
    quote:
      "Amazing time-saver! I can create differentiated quizzes for all my classes in no time.",
    timeSaved: "Saves 11+ hours per week",
  },
];

export default function TestimonialsSection() {
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient
            id="gold-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .react-fast-marquee,
        .react-fast-marquee * {
          overflow-y: hidden !important;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .react-fast-marquee *::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="bg-gradient-to-b from-white via-cyan-100 to-white py-24 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl font-extrabold sm:text-5xl lg:text-6xl opacity-60 inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              What Teachers Are Saying
            </h2>
            <p className="mt-4 text-xl text-gray-600 sm:text-2xl">
              See how educators are saving time and engaging students
            </p>
          </motion.div>
        </div>

        <Marquee
          speed={50}
          pauseOnHover={true}
          gradient={true}
          gradientColor="#cffafe"
          gradientWidth={200}
          className="py-4"
          style={{ overflowY: "hidden" }}
        >
          {[...testimonials, ...testimonials].map((testimonial, cardIndex) => (
            <div
              key={cardIndex}
              className="bg-white rounded-2xl p-8 mx-4 flex-shrink-0 flex flex-col"
              style={{ width: "500px", height: "480px" }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)",
                  }}
                >
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Quote Text */}
              <p className="text-gray-700 mb-6 text-lg leading-relaxed flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Time Saved Badge */}
              <div className="mb-6">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)",
                  }}
                >
                  {testimonial.timeSaved}
                </span>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-base truncate">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {testimonial.school}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{ fill: "url(#gold-gradient)", stroke: "none" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </>
  );
}
