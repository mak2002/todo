"use client";
import { useState } from "react";
import Habits from "./components/List";
import HabitCalendar from "./components/HabitCalendar";
import { Habit } from "./db";
import { getHabitsdb } from "./services/habitsService";
import Add from "./components/Add";

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("Habits");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [newHabit, setNewHabit] = useState<string>("");
  const [inputStr, setInputStr] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);

  const renderComponent = () => {
    if (showAddForm) return;
    switch (selectedComponent) {
      case "Habits":
        return <Habits />;
      case "HabitCalendar":
        return <HabitCalendar />;
      default:
        return null;
    }
  };

  return (
    <main className="h-screen bg-white">
      <div className="flex justify-between w-full">
        <p className="text-2xl p-4">Yo, Mayank👋 Good Evening!</p>
        <div className="flex items-center px-2">
          <label htmlFor="componentSelect pl-2 w-full">View</label>
          <select
            id="componentSelect"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="ml-2 p-2 border-2 border-black"
          >
            <option value="Habits">Habits</option>
            <option value="HabitCalendar">Habit Calendar</option>
          </select>
        </div>
      </div>
      <div className="">
        {/* <div className="pl-4 pt-5 pb-5 flex w-full gap-5">
          {true && (
            <div className="text-left w-full justify-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="p-2 bg-slate-200 font-extrabold"
              >
                Add Habit 🌱
              </button>
            </div>
          )}
        </div> */}
        {renderComponent()}

        {showAddForm && (
          <Add showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
        )}
      </div>
    </main>
  );
}
