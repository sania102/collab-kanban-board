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

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health Check Route (important for Render root path)
app.get("/", (req, res) => {
  res.send("✅ Backend API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Create HTTP server for socket.io
const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // for dev; restrict in production
  },
});

// Utility to use io in other files
export const getIO = () => io;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// Socket.io connection events
io.on("connection", (socket) => {
  console.log("⚡ User connected");

  socket.on("task-updated", (data) => {
    socket.broadcast.emit("task-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});
