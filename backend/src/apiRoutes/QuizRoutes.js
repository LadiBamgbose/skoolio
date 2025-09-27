import { Router } from "express";
import { createQuiz, getAllQuizzes } from "../prismaLogic/Quiz.js";

const router = Router();

// POST create a quiz
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    // placeholder fake questions for now
    const fakeQuestions = [
      { question: "What is 2+2?", options: ["3", "4", "5", "6"], answer: "4" },
    ];

    const quiz = await createQuiz(prompt, fakeQuestions);
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// GET fetch all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

export default router;
