// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    deadline: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'] },
});

module.exports = mongoose.model('Task', taskSchema);
