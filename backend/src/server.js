import express from "express";
import cors from "cors";
import QuizRoutes from "./apiRoutes/QuizRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Quiz routes
app.use("/api/quiz", QuizRoutes);



app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

