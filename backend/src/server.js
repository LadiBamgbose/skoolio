import 'dotenv/config';
import express from "express";
import cors from "cors";
import QuizRoutes from "./apiRoutes/QuizRoutes.js";
import AuthRoutes from "./apiRoutes/AuthRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", AuthRoutes);
// Quiz routes
app.use("/api/quiz", QuizRoutes);

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

