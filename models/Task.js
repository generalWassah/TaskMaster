const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        deadline: {
            type: Date,
            required: [true, "Deadline is required"],
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"], // Ensure only valid priority levels
            required: [true, "Priority is required"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User who created the task
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

module.exports = mongoose.model("Task", taskSchema);
