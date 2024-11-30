const express = require('express');
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', verifyToken, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
    const { title, description, priority, deadline } = req.body;
    try {
        const task = new Task({ title, description, priority, deadline, user: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
