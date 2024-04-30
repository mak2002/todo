import React, { useState, useEffect } from "react";
import {
  completeHabitdb,
  createHabit,
  deleteHabitdb,
  getHabitsdb,
} from "../services/habitsService";
import { Habit } from "../db";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker from "emoji-picker-react";

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<string>("");
  const [frequencyType, setFrequencyType] = useState<string>("daily");
  const [startDate, setStartDate] = useState<string>(""); // State for start date
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);



  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await getHabitsdb();
      const allHabits = response;

      const currentDate = new Date().toISOString().split("T")[0];

      const filteredHabits = allHabits.filter((habit: Habit) => {
        return (
          !habit.completed || !habit.completed.includes({ date: currentDate })
        );
      });

      console.log("f:: ", filteredHabits, currentDate);

      setHabits(filteredHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  
  const refreshHabits = async () => {
    await fetchHabits();
  };

  const deleteHabit = async (habitId: string) => {
    try {
      console.log("id: ", habitId);
      await deleteHabitdb(habitId);
      const res = await getHabitsdb();
      // const updatedHabits = habits.filter((habit) => habit._id !== habitId);
      setHabits(res);
      console.log("res: ", res);
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const completeHabit = async (habitId: string) => {
    try {
      // const res = await axios.post(`/api/completion/${habitId}`);

      const res = await completeHabitdb(habitId);
      console.log("res: ", res);
      await refreshHabits();
      console.log("res: ", habits);
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  return (
    <div className=" md:w-full lg:flex lg:flex-col lg:justify-center lg:items-center bg-white">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl">Habits</h1>
        
      </div>

      <ul className="w-full max-w-lg">
        {habits?.length > 0 &&
          habits.map((habit, index) => (
            <li
              key={habit._id}
              className="flex items-center justify-between border-b py-2"
            >
              <span>
                {index + 1}. {habit.name}: {habit.emoji}
              </span>
              <div className="space-x-2">
                <button
                  className="btn btn-outline btn-xs"
                  onClick={() => completeHabit(habit._id)}
                >
                  Done ✅
                </button>
                <button
                  className="btn btn-outline btn-xs"
                  onClick={() => deleteHabit(habit._id)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
      </ul>

      
    </div>
  );
};

export default Habits;
