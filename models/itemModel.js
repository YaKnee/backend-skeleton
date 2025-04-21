import mongoose from "mongoose";

// Example of Item Schema
const itemSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    dueDate: { type: Date},
    completed: { type: Boolean, required: true, default: false },
    priority: { type: String, required: true, enum: ["None", "Low", "Medium", "High"], default: "Low" }
})

export const Item = mongoose.model("Task", itemSchema, "tasks");