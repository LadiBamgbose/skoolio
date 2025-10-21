export default function QuizCreation() {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-white via-cyan-100 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent opacity-60 mb-6">
          Ready to Create a Quiz?
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">
          Fill in the details in the sidebar to generate your quiz
        </p>
      </div>
    </div>
  )
}

