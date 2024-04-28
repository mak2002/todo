"use client";
import { useState } from "react";
import { executeQuery } from "./services/habitsService";
import { HabitModel } from "./models/habit.model";
import Habits from "./components/Habits";
import Navbar from "./components/Navbar";
import HabitCalendar from "./components/HabitCalendar";

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("Habits");

  const renderComponent = () => {
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
    <main className="h-screen" data-theme="wireframe">
      <div>
        <Navbar />
        <div className="mt-4 pl-4">
          <label htmlFor="componentSelect pl-2">View habits differently:</label>
          <select
            id="componentSelect"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="ml-2"
          >
            <option value="Habits">Habits</option>
            <option value="HabitCalendar">Habit Calendar</option>
          </select>
        </div>
        {renderComponent()}
      </div>
    </main>
  );
}
