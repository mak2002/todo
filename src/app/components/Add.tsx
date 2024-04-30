import React, { useState } from "react";
import { Habit } from "../db";
import EmojiPicker from "emoji-picker-react";
import { createHabit, getHabitsdb } from "../services/habitsService";
import { v4 as uuidv4 } from "uuid";

export default function Add({showAddForm, setShowAddForm}: any) {

    const [habits, setHabits] = useState<Habit[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [newHabit, setNewHabit] = useState<string>("");
  const [frequencyType, setFrequencyType] = useState<string>("daily");
  const [startDate, setStartDate] = useState<string>(""); // State for start date
//   const [showAddForm, setShowAddForm] = useState<boolean>(true);

  const [inputStr, setInputStr] = useState("");


  const handleReaction = (event: any) => {
    setInputStr((prevInput) => event.emoji);
    setShowPicker(false);
  };

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

  const addHabit = async () => {
    try {
      const createdHabit = await createHabit({
        _id: uuidv4(),
        name: newHabit,
        frequency: frequencyType,
        startDate,
        completed: [],
        emoji: inputStr,
      });
      const response = await getHabitsdb();
      console.log("createdHabit:: ", createdHabit);
      setHabits(response);
      setNewHabit("");
      setFrequencyType("daily");
      setStartDate(""); // Reset start date
      await fetchHabits();
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };


  return (
    <div>
      {showAddForm && (
        <div className="mt-4 justify-center items-center flex flex-col w-full">
          <div className="w-3/6">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter new habit"
              className="input input-bordered w-full"
            />
            <div className="flex">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="btn btn-outline p-2 m-2 rounded-md"
              >
                Emoji: {!inputStr ? "😄" : inputStr}
              </button>
              <EmojiPicker
                open={showPicker}
                // reactionsDefaultOpen={true}
                onEmojiClick={handleReaction}
              />
            </div>
            <select
              value={frequencyType}
              onChange={(e) => setFrequencyType(e.target.value)}
              className="select select-bordered input-primary w-full mt-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered input-primary w-full mt-2"
            />

            <div className="flex gap-4">
              <button
                className="btn btn-primary mt-2 w-full flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Done ↩️
              </button>
              <button
                className="btn btn-success mt-2 text-left flex-1"
                onClick={addHabit}
              >
                Save 💾
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
