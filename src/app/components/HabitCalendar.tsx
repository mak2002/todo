import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Habit {
  _id: number;
  name: string;
  frequency: string | number;
}

const HabitCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get<any>('/api/habits');
      const allHabits = response.data.message;
      const currentDate = new Date();
      
      // Filter habits based on start date
      const filteredHabits = allHabits.filter((habit: { startDate: string | number | Date; }) => new Date(habit.startDate) <= currentDate);
      
      setHabits(filteredHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };
  

  const completeHabit = async (habitId: number) => {
    try {
      // Make the habit complete for the selected date
      const res = await axios.post(`/api/completion/${habitId}`, { date: formatDate(selectedDate) });
      console.log('res: ', res);
      // Refetch habits for the selected date after completion
      await fetchHabits();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  // Function to format date as 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Function to handle date selection
  const handleDateSelect = (offset: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  return (
    <div className="p-4 md:w-full lg:flex lg:flex-col lg:justify-center lg:items-center">
      <h1 className="text-2xl mb-4 text-left w-full">Habit Calendar 🗓️</h1>
      <div className="flex justify-between mb-4 gap-2">
        <button className="btn btn-outline" onClick={() => handleDateSelect(-2)}>
          {getFormattedDate(selectedDate, -2)}
        </button>
        <button className="btn btn-outline" onClick={() => handleDateSelect(-1)}>
          {getFormattedDate(selectedDate, -1)}
        </button>
        <button className="btn btn-outline" onClick={() => handleDateSelect(0)}>
          {getFormattedDate(selectedDate, 0)}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {habits.length > 0 ? (
          habits.map((habit, index) => (
            <button key={habit._id} className=" bg-primary p-10 rounded-xl" onClick={() => completeHabit(habit._id)}>
              {habit.name} ({habit.frequency})
            </button>
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
  return newDate.toLocaleDateString();
};
