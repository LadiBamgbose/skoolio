import OpenAI from 'openai';
import { generateQuizPrompt } from '../prompts/index.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  static async generateQuizQuestions(topic, options = {}) {
    try {
      // Prepare prompt parameters
      const promptParams = {
        topic,
        questionCount: options.questionCount || generateQuizPrompt.validation.defaultQuestionCount,
        gradeLevel: options.gradeLevel || '6th Grade'
      };

      // Generate prompt using template
      const userPrompt = generateQuizPrompt.template(promptParams);

      const completion = await openai.chat.completions.create({
        ...generateQuizPrompt.config,
        messages: [
          {
            role: "system",
            content: generateQuizPrompt.systemMessage
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
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

      // Validate structure using prompt validation rules
      const { validation } = generateQuizPrompt;
      const expectedQuestionCount = promptParams.questionCount;
      
      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== expectedQuestionCount) {
        throw new Error(`AI response missing required questions array with ${expectedQuestionCount} questions`);
      }

      // Validate each question structure
      for (let i = 0; i < quizData.questions.length; i++) {
        const q = quizData.questions[i];
        
        // Check required fields
        for (const field of validation.questionFields) {
          if (!q[field]) {
            throw new Error(`Question ${i + 1} missing required field: ${field}`);
          }
        }
        
        // Check options count
        if (!Array.isArray(q.options) || q.options.length !== validation.optionsCount) {
          throw new Error(`Question ${i + 1} must have exactly ${validation.optionsCount} options`);
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
