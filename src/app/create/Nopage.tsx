'use client';
import React from "react";
import HabitForm from "../components/HabitForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createHabitdb } from "../services/habitsService";

export default function Page() {
  const notify = () => toast.success("Habit Added!");

  const handleAddHabit = async (habitData: any) => {
    try {
      await createHabitdb(habitData);
      notify();
    } catch (error) {
      console.error("Error adding habit:", error);
      // Handle error appropriately (e.g., show error message)
    }
  };

  return (
    <div className="h-screen bg-white">
      <p className="text-2xl p-4">Create a new habit</p>
      <HabitForm onSubmit={handleAddHabit} isChallenge={false} />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
