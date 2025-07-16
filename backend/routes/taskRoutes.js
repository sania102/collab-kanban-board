import express from "express";
import Task from "../models/Task.js";
import ActionLog from "../models/ActionLog.js";
import { auth } from "../middleware/authMiddleware.js";
import { getIO } from "../server.js";

const router = express.Router();

// ✅ Get Logs — moved ABOVE "/:id" route
router.get("/logs", auth, async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("user", "name");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error: error.message });
  }
});

// ✅ Get All Tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// ✅ Create Task
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create(req.body);

    await ActionLog.create({
      user: req.userId,
      action: `Created task: ${task.title}`,
      taskId: task._id
    });

    getIO().emit("task-updated", task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

// ✅ Update Task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await ActionLog.create({
      user: req.userId,
      action: `Updated task: ${task.title}`,
      taskId: task._id
    });

    getIO().emit("task-updated", task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// ✅ Delete Task
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    await ActionLog.create({
      user: req.userId,
      action: `Deleted task`,
      taskId: req.params.id
    });

    getIO().emit("task-updated", { deletedId: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

export default router;

