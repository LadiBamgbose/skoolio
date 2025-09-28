import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  static async generateQuizQuestions(topic) {
    try {
      const prompt = `Generate a 5-question multiple choice quiz about: "${topic}"

Requirements:
- Educational level: Middle/High school appropriate
- Each question should have exactly 4 options labeled A, B, C, D
- Only one correct answer per question
- Include a brief explanation for each correct answer
- Make questions engaging and educational

Return ONLY a valid JSON object in this exact format:
{
  "topic": "${topic}",
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
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Cost-effective model
        messages: [
          {
            role: "system",
            content: "You are an educational quiz generator. Always respond with valid JSON only, no additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0].message.content.trim();
      
      // Parse and validate JSON response
      let quizData;
      try {
        quizData = JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', response);
        throw new Error('Invalid response format from AI');
      }

      // Validate structure
      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 5) {
        throw new Error('AI response missing required questions array with 5 questions');
      }

      // Validate each question structure
      for (let i = 0; i < quizData.questions.length; i++) {
        const q = quizData.questions[i];
        if (!q.question || !q.options || !q.correct || !q.explanation) {
          throw new Error(`Question ${i + 1} missing required fields`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question ${i + 1} must have exactly 4 options`);
        }
      }

      return quizData;

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API configuration error');
      }
      
      if (error.message.includes('quota') || error.message.includes('billing')) {
        throw new Error('OpenAI API quota exceeded');
      }
      
      throw new Error('Failed to generate quiz questions');
    }
  }
}

export default OpenAIService;
