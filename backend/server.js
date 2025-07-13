import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

export const getIO = () => io;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected");
  server.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("task-updated", (data) => {
    socket.broadcast.emit("task-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
