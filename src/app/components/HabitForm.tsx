'use client';
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const HabitForm = ({ onSubmit, isChallenge }: any) => {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notifyTime, setNotifyTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [challengeDays, setChallengeDays] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const habitData = {
      _id: uuidv4(),
      name: habitName,
      frequency,
      notifyTime,
      startDate,
      ...(challengeDays && { challengeDays }), // Optional fields
      ...(tags && { tags: tags.split(",").map((tag) => tag.trim()) }), // Optional fields
    };
    onSubmit(habitData);
    // Reset form fields
    setHabitName("");
    setFrequency("");
    setNotifyTime("");
    setStartDate("");
    setChallengeDays("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit} className="lg:w-1/2 xl:w-1/3 mx-auto">
      <input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="Enter habit name"
        className="input border-2 border-black input-bordered w-full mb-2"
      />
      {/* <input
        type="text"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        placeholder="Frequency"
        className="input border-2 border-black input-bordered w-full mb-2"
      /> */}
      <input
        type="text"
        value={notifyTime}
        onChange={(e) => setNotifyTime(e.target.value)}
        placeholder="Notify time"
        className="input border-2 border-black input-bordered w-full mb-2"
      />

      <span>Start Date: </span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start date"
        className="input border-2 border-black input-bordered w-full mb-2"
      />
      {isChallenge && (
        <input
          type="number"
          value={challengeDays}
          onChange={(e) => setChallengeDays(e.target.value)}
          placeholder="Number of days for challenge"
          className="input border-2 border-black input-bordered w-full mb-2"
        />
      )}
      {isChallenge && (
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="input border-2 border-black input-bordered w-full mb-2"
        />
      )}
      <button type="submit" className="btn btn-primary mt-4 w-full">
        Add Habit
      </button>
    </form>
  );
};

export default HabitForm;
