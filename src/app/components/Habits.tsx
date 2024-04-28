import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { completeHabit } from '../services/habitsService';

interface Habit {
  _id: number;
  name: string;
  frequency: string | number;
  startDate: string; // Adding startDate field to Habit interface
}

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<string>('');
  const [frequencyType, setFrequencyType] = useState<string>('daily');
  const [startDate, setStartDate] = useState<string>(''); // State for start date

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get<any>('/api/habits');
      setHabits(response.data.message);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const addHabit = async () => {
    try {
      const response = await axios.post<Habit>('/api/habits', { name: newHabit, frequency: frequencyType, startDate });
      setHabits([...habits, response.data]);
      setNewHabit('');
      setFrequencyType('daily');
      setStartDate(''); // Reset start date
      await fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const deleteHabit = async (habitId: number) => {
    try {
      const res = await axios.delete(`/api/habits/${habitId}`);
      const updatedHabits = habits.filter(habit => habit._id !== habitId);
      setHabits(updatedHabits);
      console.log('res: ', res);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const completeHabit = async (habitId: number) => {
    try {
      const res = await axios.post(`/api/completion/${habitId}`);
      console.log('res: ', res);
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  return (
    <div className="p-4 md:w-full lg:flex lg:flex-col lg:justify-center lg:items-center">
      <h1 className="text-2xl mb-4">Habits</h1>
      <ul className="w-full max-w-lg">
        {habits.length > 0 &&
          habits.map((habit, index) => (
            <li key={habit._id} className="flex items-center justify-between border-b py-2">
              <span>
                {index + 1}. {habit.name} ({habit.frequency})
              </span>
              <div className="space-x-2">
                <button className="btn btn-outline btn-xs" onClick={() => completeHabit(habit._id)}>
                  Done ✅
                </button>
                <button className="btn btn-outline btn-xs" onClick={() => deleteHabit(habit._id)}>
                  Delete 🗑️
                </button>
              </div>
            </li>
          ))}
      </ul>
      <div className="mt-4 w-full max-w-lg">
        <input
          type="text"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          placeholder="Enter new habit"
          className="input input-bordered w-full"
        />
        <select
          value={frequencyType}
          onChange={e => setFrequencyType(e.target.value)}
          className="select select-bordered input-primary w-full mt-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="input input-bordered input-primary w-full mt-2"
        />
        <button className="btn btn-primary mt-2 w-full" onClick={addHabit}>
          Add Habit
        </button>
      </div>
    </div>
  );
};

export default Habits;
