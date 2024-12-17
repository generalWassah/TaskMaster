const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

/*
// Get all tasks
router.get('/', verifyToken, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});
*/

// Fetch all tasks
router.get("/", verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});


// Create a new task
router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, description, deadline, priority } = req.body;
        const userId = req.user._id;

        if (!title || !description || !deadline || !priority) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const task = new Task({
            title,
            description,
            deadline,
            priority,
            createdBy: userId,
        });

        await task.save();
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task" });
    }
});

// Update a task
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await Task.findOneAndUpdate({ _id: id, createdBy: req.user._id }, updates, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
});

// Delete a task
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user._id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task" });
    }
});

module.exports = router;
