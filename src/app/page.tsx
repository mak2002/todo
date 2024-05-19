'use client'
import { useState } from "react";
import Habits from "./components/List";
import HabitCalendar from "./components/HabitCalendar";
import Add from "./components/Add";
import { Habit } from "./db";

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("List");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderComponent = () => {
    if (showAddForm) return;
    switch (selectedComponent) {
      case "List":
        return <Habits selectedDate={selectedDate} selectedComponent={selectedComponent}/>;
      case "Squares":
        return <HabitCalendar />;
      default:
        return null;
    }
  };

  const handleDateChange = (e: any) => {
    const selectedDate = new Date(e.target.value);
    setSelectedDate(selectedDate);
  };

  const formattedDate = selectedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

  return (
    <main className="h-screen  flex flex-col">
      <header className="px-4 py-2 flex justify-between mt-2 items-center">
        <p className="text-2xl font-semibold">Welcome! 🌙</p>
        <p className="text-2xl font-semibold"> {formattedDate}</p>

        <div className="flex items-center space-x-4">
          
          <div className="flex items-center space-x-2 pt-2">
            {/* <label htmlFor="datePicker">Select Date:</label> */}
            <input
              type="date"
              id="datePicker"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="border-2 rounded-3xl border-black p-2 focus:outline-none"
            />
          </div>
        </div>
      </header>
      <div className="flex-grow bg-white flex justify-center pt-14">
        {renderComponent()}
      </div>
      
    </main>
  );
}
