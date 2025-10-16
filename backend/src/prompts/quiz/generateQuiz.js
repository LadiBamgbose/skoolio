/**
 * Quiz Generation Prompt Template
 * Professional prompt management for quiz generation
 */

export const generateQuizPrompt = {
  // System message - defines the AI's role and behavior
  systemMessage: "You are an educational quiz generator. Always respond with valid JSON only, no additional text.",
  
  // User prompt template with variables
  template: (params) => `Generate a ${params.questionCount || 5}-question multiple choice quiz about: "${params.topic}"

Requirements:
- This quiz is for ${params.gradeLevel || '6th Grade'} students - ensure all questions, vocabulary, and concepts are appropriate for this specific grade level
- Each question should have exactly 4 options labeled A, B, C, D
- Only one correct answer per question
- Include a brief explanation for each correct answer
- Make questions engaging and educational
- Adjust difficulty and complexity to match ${params.gradeLevel || '6th Grade'} curriculum standards

Return ONLY a valid JSON object in this exact format:
{
  "topic": "${params.topic}",
  "gradeLevel": "${params.gradeLevel || '6th Grade'}",
  "questionCount": ${params.questionCount || 5},
  "questions": [
    {
      "question": "What is...",
      "options": [
        "A) Option 1",
        "B) Option 2", 
        "C) Option 3",
        "D) Option 4"
      ],
      "correctAnswer": "B",
      "explanation": "Brief explanation of why B is correct"
    }
  ]
}`,

  // Model configuration
  config: {
    model: "gpt-4o-mini", // Cost-effective model
    temperature: 0.7,
    max_tokens: 2000,
  },

  // Validation rules
  validation: {
    requiredFields: ['topic', 'questions'],
    questionFields: ['question', 'options', 'correctAnswer', 'explanation'],
    optionsCount: 4,
    defaultQuestionCount: 7
  }
};

export default generateQuizPrompt;
