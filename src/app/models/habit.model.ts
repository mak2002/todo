import mongoose, { Schema, Document } from "mongoose";

// import { Document } from 'mongoose';

export interface HabitModel {
  name: string;
  description: string;
  repeatFrequency: string; // Example: 'Daily', 'Weekly', etc.
  color?: string; // Example: Hex color code or color name
  startDate: Date; // Date when the habit was started
  endDate?: Date; // Date when the habit is expected to end
  reminderTime?: string; // Time of day to remind the user about the habit
  completed: boolean; // Indicates whether the habit has been completed or not
  completedTime?: Date[]; // Array of times when the habit was marked complete
  notes?: string; // Additional notes or comments related to the habit
  category?: string; // Category or tag associated with the habit
  priority?: string; // Priority level assigned to the habit
  streak: number; // Number indicating the current streak of completing the habit consecutively
  goal?: number; // Target or goal associated with the habit
  achievement?: string[]; // Record of milestones or achievements related to the habit
}

// Define the schema for Habit document
const habitSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Add more fields as needed
});

// Define and export the Mongoose model
export const HabitModel = mongoose.model<HabitModel>("Habit", habitSchema);
