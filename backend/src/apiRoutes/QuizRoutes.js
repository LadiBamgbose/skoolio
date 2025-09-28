import { Router } from "express";
import QuizLogic from "../prismaLogic/Quiz.js";

const router = Router();

// POST create a quiz
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    // placeholder fake questions for now
    const fakeQuestions = [
      { question: "What is 2+2?", options: ["3", "4", "5", "6"], answer: "4" },
    ];

    const quiz = await QuizLogic.createQuiz(prompt, fakeQuestions);
    res.json({
      success: true,
      quiz
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: "Failed to create quiz" 
    });
  }
});

// GET fetch all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await QuizLogic.getAllQuizzes();
    res.json({
      success: true,
      quizzes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch quizzes" 
    });
  }
});

export default router;
