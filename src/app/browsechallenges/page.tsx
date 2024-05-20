"use client";
import React, { useState } from "react";
import { createHabitdb } from "../services/habitsService";
import { Habit } from "../db";
import { challengesData } from "./challenges";
import HabitForm from "../components/ChallengeForm";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from "react-toastify";

interface Challenge {
  id: string;
  name: string;
  habits: Habit[];
}

export default function Page() {
  const [enrolledChallenges, setEnrolledChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [startDate, setStartDate] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [isProgressLogged, setIsProgressLogged] = useState(false);
  const notify = () => toast("Challenge is on!");
  const router = useRouter()

  const enrollInChallenge = (challenge: Challenge) => {
    if (!enrolledChallenges.some((c) => c.id === challenge.id)) {
      setEnrolledChallenges([...enrolledChallenges, challenge]);
    }
  };

  const saveChallenge = async (selectedChallenge: any) => {
    const challengeData = {
      name: selectedChallenge.name,
      startDate: new Date().toISOString().split("T")[0],
      challengeDays: selectedChallenge.challengeDays,
      habits: selectedChallenge.habits,
    };
    console.log("Save Challenge Data:", challengeData);
    // Reset the form or perform any other necessary actions

    try {
      // Create the challenge in the database
      // Iterate through the habits associated with the new challenge
      for (let habit of challengeData.habits) {
        if (!habit.startDate) {
          habit.startDate = [];
        }

        if(!habit.isProgressLogged){
          habit.isProgressLogged = false
        }
        // add start date to each habit
        habit.startDate = new Date().toISOString().split("T")[0];
        habit.challengeDays = challengeData.challengeDays;
        habit.isProgressLogged = isProgressLogged;
        // Set the challengeId for each habit
        // Create the habit in the database
        await createHabitdb(habit);
      }
      // Update the local state with the new challenge
    } catch (error) {
      console.error("Error adding challenge and habits:", error);
      // You might want to handle the error appropriately (e.g., display an error message)
    }
  };

  const handleStartChallenge = async () => {
    if (selectedChallenge) {
      // Add logic to save the challenge start date and manage the challenge progression
      alert(`Challenge "${selectedChallenge.name}" started on`);
      setSelectedChallenge(null);
      setStartDate("");
      await saveChallenge(selectedChallenge);
      notify();
      // redirect to /today
      router.push("/")

    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-left text-gray-800">
        Browse Challenges
      </h1>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-outline text-left mb-4 px-6 py-2 rounded-lg shadow-md"
      >
       {showForm ? 'Cancel ❌' :`Create Custom Challenge  ✚`}
      </button>

      {showForm && <HabitForm setShowForm={setShowForm} />}

      {selectedChallenge && !showForm ? (
        <div className="p-6 rounded-lg mt-4 border-2 border-black shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            {selectedChallenge.name}
          </h2>
          <div className="flex gap-2 items-center">

          <p className="text-lg">Include progress log</p>
          <input type="checkbox" onChange={() => setIsProgressLogged(!isProgressLogged)} className="checkbox rounded-full border-1 border-black" checked={isProgressLogged}/>
          </div>
          <div className="mb-4">
            <h3 className="text-2xl font-semibold text-gray-700">Habits</h3>
            <ul className="list-disc ml-6 text-xl">
              {selectedChallenge.habits.map((habit, index) => (
                <li key={index} className="text-gray-600">
                  {habit.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              className="btn btn-outline px-4 py-2 rounded-lg shadow-md"
              onClick={() => setSelectedChallenge(null)}
            >
              ⬅️ Back
            </button>
            <button
              className="btn btn-success px-4 py-2 rounded-lg shadow-md"
              onClick={handleStartChallenge}
            >
              Start Challenge
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!showForm &&
            challengesData.map((challenge) => (
              <div
                key={challenge.id}
                className="p-6 flex flex-col justify-between rounded-lg border-2 border-black shadow-2xl h-full"
              >
                <div className="mb-4 flex-grow">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    {challenge.name}
                  </h2>
                </div>
                <button
                  className="btn btn-outline px-4 py-2 rounded-lg shadow-md"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      )}

      {enrolledChallenges.length > 0 && !selectedChallenge && (
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Enrolled Challenges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-6 rounded-lg border-2 border-black shadow-2xl"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {challenge.name}
                </h2>
                <p className="text-gray-600">
                  You have enrolled in this challenge.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
