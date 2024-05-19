"use client";
import React, { useState, useEffect } from "react";
import {
  deleteChallengeFromDB,
  deleteHabitdb,
  getHabitChallenges,
} from "../services/habitsService";
import { Habit } from "../db";
import HabitForm from "../components/ChallengeForm";

interface Challenge {
  challengeName: string;
  habits: Habit[];
}

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const deleteChallenge = async (challengeId: string) => {
    console.log('deleteChallenge:: ', challengeId, challenges);
    try {
      // Call your delete challenge service
      await deleteChallengeFromDB(challengeId);
      fetchChallenges(); // Refresh challenges after deletion
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const challengesFromDB = await getHabitChallenges();
      setChallenges(challengesFromDB);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleAddChallenge = async (newChallenge: Challenge) => {
    try {
      // You might want to call a function to add the new challenge to the database
      // await addChallengeToDatabase(newChallenge);
      setChallenges([...challenges, newChallenge]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <h1 className="text-3xl font-bold mb-4">Challenges</h1>
      <div className="mb-4">
        {showForm ? (
          <button className="btn px-4 mx-2" onClick={() => setShowForm(false)}>
            Back
          </button>
        ) : (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add Challenge
          </button>
        )}
      </div>
      {showForm && <HabitForm onSubmit={handleAddChallenge} />}
      {!showForm && challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges?.map((challenge, index) => (
            <div key={index} className="border-2 p-4 border-black">
              <h2 className="text-lg font-semibold mb-2">
                {challenge.challengeName}
              </h2>
              <div className="mt-4">
                <p className="font-semibold">Habits:</p>
                <ul className="list-disc ml-4">
                  {challenge.habits.map((habit, habitIndex) => (
                    <li key={habitIndex}>{habit.name}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={async () =>
                  await deleteChallenge(challenge.habits[0].challengeId!)
                } // Assuming challengeId is stored in _id
                className="btn btn-delete mt-4"
              >
                Delete Challenge
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showForm && <p className="text-gray-500">No challenges available.</p>
      )}
    </div>
  );
};

export default Challenges;
