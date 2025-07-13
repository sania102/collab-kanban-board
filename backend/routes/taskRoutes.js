import express from "express";
import Task from "../models/Task.js";
import ActionLog from "../models/ActionLog.js";
import { auth } from "../middleware/authMiddleware.js";
import { getIO } from "../server.js";

const router = express.Router();

// Get All Tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.json(tasks);
});

// Create Task
router.post("/", auth, async (req, res) => {
  const task = await Task.create(req.body);

  await ActionLog.create({
    user: req.userId,
    action: `Created task: ${task.title}`,
    taskId: task._id
  });

  getIO().emit("task-updated", task);
  res.status(201).json(task);
});

// Update Task
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

  await ActionLog.create({
    user: req.userId,
    action: `Updated task: ${task.title}`,
    taskId: task._id
  });

  getIO().emit("task-updated", task);
  res.json(task);
});

// Delete Task
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  await ActionLog.create({
    user: req.userId,
    action: `Deleted task`,
    taskId: req.params.id
  });

  getIO().emit("task-updated", { deletedId: req.params.id });
  res.status(204).send();
});

// ✅ Get Logs (Final route used by frontend)
router.get("/logs", auth, async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate("user", "name");
  res.json(logs);
});

export default router;

