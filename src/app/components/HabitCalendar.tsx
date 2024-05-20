import React, { useState, useEffect } from "react";
import { completeHabitdb, getHabitsdb } from "../services/habitsService";
import { Habit } from "../db";
import Button from "../components/Button";

const HabitCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const fetchHabits = async () => {
    try {
      const response = await getHabitsdb();
      const allHabits = response;
      const currentDate = selectedDate.toISOString().split("T")[0];
      const filteredHabits = allHabits?.filter((habit: Habit) => {
        return !habit.completed || !habit.completed.some((completedDate) => completedDate.date === currentDate);
      });
      setHabits(filteredHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevDayClick = () => {
    const newTempDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000);
    setTempDate(newTempDate);
  };

  const handleNextDayClick = () => {
    const newTempDate = new Date(tempDate.getTime() + 24 * 60 * 60 * 1000);
    setTempDate(newTempDate);
  };

  const renderDate = (date: Date, index: number) => {
    const day = date.getDate().toString().padStart(1, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const isCurrentDate = date.toDateString() === selectedDate.toDateString();
    return (
      <button
        key={index}
        className={`btn btn-outline rounded-full ${isCurrentDate ? "bg-black text-white" : ""}`}
        onClick={() => handleDateClick(date)}
      >
        {`${day}-${month}`}
      </button>
    );
  };

  return (
    <div className="p-4 md:w-full lg:flex lg:flex-col lg:items-center container">
      <div className="flex justify-between items-center mb-4 w-7/12 gap-2">
        <button className="btn btn-outline mx-2" onClick={handlePrevDayClick}>
          &lt;
        </button>
        <div className="flex gap-2">
          {[...Array(7)].map((_, i) => (
            <React.Fragment key={i}>
              {renderDate(new Date(tempDate.getTime() - (3 - i) * 24 * 60 * 60 * 1000), i)}
            </React.Fragment>
          ))}
        </div>
        <button className="mx-2 p-4 btn btn-outline" onClick={handleNextDayClick}>
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {habits.length > 0 ? (
          habits.map((habit, index): any => (
            <Button
              key={index}
              className={`w-40 h-40 p-10 flex flex-col items-center justify-center ${
                // @ts-ignore
                habit.completed.some((completedDate) => completedDate.date === selectedDate.toISOString().split("T")[0])
                  ? "bg-green-200 transition-colors duration-500"
                  : "bg-gray-200"
              }`}
                // @ts-ignore
              onClick={() => completeHabitdb(habit._id, selectedDate.toISOString().split("T")[0])}
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
