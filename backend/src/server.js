import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import QuizRoutes from "./apiRoutes/QuizRoutes.js";
import DemoQuizRoutes from "./apiRoutes/DemoQuizRoutes.js";
import { setupSocketHandlers } from "./util/socket/socketHandlers.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

const PORT = 4000;

app.use(cors());
app.use(express.json());

// Quiz routes
app.use("/api/quiz", QuizRoutes);

// Demo quiz routes
app.use("/api/demo-quiz", DemoQuizRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  setupSocketHandlers(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
  console.log(`Socket.IO is ready for connections`);
});

