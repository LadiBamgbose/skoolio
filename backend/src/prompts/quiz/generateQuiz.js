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
- Educational level: ${params.educationLevel || 'Middle/High school appropriate'}
- Each question should have exactly 4 options labeled A, B, C, D
- Only one correct answer per question
- Include a brief explanation for each correct answer
- Make questions engaging and educational
- Difficulty: ${params.difficulty || 'Medium'}

Return ONLY a valid JSON object in this exact format:
{
  "topic": "${params.topic}",
  "difficulty": "${params.difficulty || 'Medium'}",
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
      "correct": "B",
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
    questionFields: ['question', 'options', 'correct', 'explanation'],
    optionsCount: 4,
    defaultQuestionCount: 7
  }
};

export default generateQuizPrompt;
