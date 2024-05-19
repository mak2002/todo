import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import HabitList from "./HabitList";
import { Habit } from "../db";
import { createHabitdb } from "../services/habitsService";

const HabitForm = ({setShowForm}: any) => {
  const [challengeName, setChallengeName] = useState("");
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notifyTime, setNotifyTime] = useState("");
  const [challengeDays, setChallengeDays] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editHabitId, setEditHabitId] = useState("");
  const [habitsForChallenges, setHabitsForChallenges] = useState<any[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);

  const handleChallengeNameSubmit = (e: any) => {
    e.preventDefault();
    if (challengeName.trim() === "") {
      alert("Please enter a challenge name");
      return;
    }
    if (startDate.trim() === "") {
      alert("Please enter a start date");
      return;
    }
    if (challengeDays.trim() === "") {
      alert("Please enter the number of challenge days");
      return;
    }
    setCurrentChallenge({ name: challengeName, startDate, challengeDays, id: uuidv4() });
    setChallengeName("");
    setStartDate("");
    setChallengeDays("");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (currentChallenge === null) {
      alert("Please enter a challenge name first.");
      return;
    }
    if (habitName.trim() === "") {
      alert("Please enter a habit name");
      return;
    }
    if (editMode) {
      const updatedHabits = habitsForChallenges.map((habit) =>
        habit._id === editHabitId && habit.challengeId === currentChallenge.id
          ? {
              ...habit,
              name: habitName,
              frequency,
              notifyTime,
              tags: tags.split(",").map((tag: string) => tag.trim()),
            }
          : habit
      );
      setHabitsForChallenges(updatedHabits);
      setEditMode(false);
    } else {
      const newHabit = {
        _id: uuidv4(),
        name: habitName,
        frequency,
        notifyTime,
        tags: tags.split(",").map((tag: string) => tag.trim()),
        challengeId: currentChallenge.id,
        challengeName: currentChallenge.name, // Include challenge name
      };
      setHabitsForChallenges([...habitsForChallenges, newHabit]);
    }
    setHabitName("");
    setFrequency("");
    setNotifyTime("");
    setTags("");
  };

  const handleEdit = (habit: Habit) => {
    const { _id: habitId } = habit;
    const habitToEdit = habitsForChallenges.find(
      (h) =>
        habitId === h._id &&
        currentChallenge &&
        h.challengeId === currentChallenge.id
    );
    if (habitToEdit) {
      setEditMode(true);
      setEditHabitId(habitId);
      setHabitName(habitToEdit.name);
      setFrequency(habitToEdit.frequency);
      setNotifyTime(habitToEdit.notifyTime);
      setTags(habitToEdit.tags.join(", "));
    }
  };

  const saveChallenge = async () => {
    if (currentChallenge === null) {
      alert("No challenge to save.");
      return;
    }
    // Save the current challenge and its associated habits
    const challengeData = {
      name: currentChallenge.name,
      startDate: currentChallenge.startDate,
      challengeDays: currentChallenge.challengeDays,
      habits: habitsForChallenges.filter(
        (habit) => habit.challengeId === currentChallenge.id
      ),
    };
    console.log("Save Challenge Data:", challengeData);
    // Reset the form or perform any other necessary actions
    setCurrentChallenge(null);
    setHabitsForChallenges([]);

    try {
      // Create the challenge in the database
      // Iterate through the habits associated with the new challenge
      for (const habit of challengeData.habits) {

        // add start date to each habit
        habit.startDate = challengeData.startDate;
        habit.challengeDays = challengeData.challengeDays;
        // Set the challengeId for each habit
        // Create the habit in the database
        await createHabitdb(habit);
      }
      // Update the local state with the new challenge
    } catch (error) {
      console.error("Error adding challenge and habits:", error);
      // You might want to handle the error appropriately (e.g., display an error message)
    }
    setShowForm(false);
  };

  return (
    <div className="mt-8 w-full">
      {currentChallenge ? (
        <div>
          <h2>Challenge: {currentChallenge.name}</h2>
          <form onSubmit={handleSubmit} className="lg:w-1/2 xl:w-1/3 mx-auto">
            <div className="space-y-2">
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="Enter habit name"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={notifyTime}
                onChange={(e) => setNotifyTime(e.target.value)}
                placeholder="Notify time"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma-separated)"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="For now, only Daily habits are supported"
                className="input input-bordered w-full"
                disabled
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4 w-full">
              {editMode ? "Update Habit" : "Add Habit"}
            </button>
            <button
              onClick={saveChallenge}
              className="btn btn-success mt-4 w-full"
            >
              Save Challenge
            </button>
          </form>
          <HabitList habits={habitsForChallenges} onEdit={handleEdit} />
        </div>
      ) : (
        <form
          onSubmit={handleChallengeNameSubmit}
          className="lg:w-1/2 xl:w-1/3 mx-auto gap-2 flx flex-col"
        >
          <input
            type="text"
            value={challengeName}
            onChange={(e) => setChallengeName(e.target.value)}
            placeholder="Enter challenge name"
            className="input input-bordered w-full"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start date"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            value={challengeDays}
            onChange={(e) => setChallengeDays(e.target.value)}
            placeholder="Number of days for challenge"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-outline mt-4 w-full">
            Start Challenge
          </button>
        </form>
      )}
    </div>
  );
};

export default HabitForm;