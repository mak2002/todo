import React, { useState, useEffect } from "react";
import axios from "axios";
import { completeHabitdb, getHabitsdb } from "../services/habitsService";
import { Habit } from "../db";
import Button from "../components/Button";

const HabitCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const fetchHabits = async () => {
    try {
      const response = await getHabitsdb();
      const allHabits = response;

      const currentDate = new Date().toISOString().split("T")[0];

      const filteredHabits = allHabits?.filter((habit: Habit) => {
        return (
          !habit.completed || !habit.completed.includes({ date: currentDate })
        );
      });

      setHabits(filteredHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const completeHabit = async (habitId: number) => {
    try {
      // Make the habit complete for the selected date
      const res = await axios.post(`/api/completion/${habitId}`, {
        date: formatDate(selectedDate),
      });
      console.log("res: ", res);
      // Refetch habits for the selected date after completion
      await fetchHabits();
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

// Function to format date as 'YYYY-MM-DD'
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  // Function to handle date selection
  const handleDateSelect = (offset: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  return (
    <div className="p-4 md:w-full lg:flex lg:flex-col lg:justify-center lg:items-center bg-white">
      {/* <h1 className="text-2xl mb-4 text-left w-full">Habit Calendar 🗓️</h1> */}
      <div className="flex justify-between mb-4 gap-2">
        <button
          className="btn btn-outline rounded-full"
          onClick={() => handleDateSelect(-2)}
        >
          {getFormattedDate(selectedDate, -2)}
        </button>
        <button
          className="btn btn-outline rounded-full"
          onClick={() => handleDateSelect(-1)}
        >
          {getFormattedDate(selectedDate, -1)}
        </button>
        <button className="btn btn-outline rounded-full" onClick={() => handleDateSelect(0)}>
          {getFormattedDate(selectedDate, 0)}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {habits.length > 0 ? (
          habits.map((habit, index) => (
            <Button
              className="bg-green-100 w-40 h-40 p-10 flex flex-col items-center justify-center"
              onClick={() => {
                console.log("click");
              }}
            >
              <p className="w-50 h-auto inline">{habit.emoji}</p>
              <div>{habit.name} </div>
            </Button>
          ))
        ) : (
          <p className="text-gray-500">No habits for this day.</p>
        )}
      </div>
    </div>
  );
};

export default HabitCalendar;

// Function to get formatted date based on offset from current date
const getFormattedDate = (date: Date, offset: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    
    // Extract day and month from the date
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
    
    return `${day}-${month}`;
  };
  