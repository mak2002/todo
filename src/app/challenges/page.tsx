"use client";
import React, { useState, useEffect } from "react";
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import {
  deleteChallengeFromDB,
  deleteHabitdb,
  getHabitChallenges,
  getHabitsdb,
} from "../services/habitsService";
import habitDB, { Habit } from "../db";
import HabitForm from "../components/ChallengeForm";
import { ActivityRing } from "@jonasdoesthings/react-activity-rings/dist/types";
import ChallengeDetails from "../components/ChallengeDetails";

interface Challenge {
  challengeName: string;
  habits: Habit[];
  completionPercentages?: { [date: string]: number };
}

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [challengeCompletion, setChallengeCompletion] = useState<any>({});
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [habitsForChallenges, setHabitsForChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges();
    fetchHabits();

    async function fetchAndSetHabits() {
      // Function to group habits into challenges
      function groupHabitsIntoChallenges(habits: Habit[]): Challenge[] {
        const groupedChallenges: { [key: string]: Challenge } = {};

        habits.forEach((habit) => {
          const {
            challengeId,
            challengeName,
            ...habitWithoutChallengeInfo
          }: any = habit;
          if (!groupedChallenges[challengeId]) {
            groupedChallenges[challengeId] = {
              challengeName,
              habits: [],
            };
          }
          groupedChallenges[challengeId].habits.push({
            challengeId,
            challengeName,
            ...habitWithoutChallengeInfo,
          });
        });

        console.log(
          "Object.values(groupedChallenges):: ",
          Object.values(groupedChallenges)
        );
        return Object.values(groupedChallenges);
      }

      // Function to fetch habits and group them into challenges
      async function getHabitChallenges(): Promise<Challenge[]> {
        const habits = await habitDB.habits
          .where("challengeDays")
          .above(0)
          .toArray();
        // Group the habits by challengeId
        return groupHabitsIntoChallenges(habits);
      }

      // Fetch habits and set them
      const challenges = await getHabitChallenges();
      console.log("challenges:: ", challenges);
      setHabitsForChallenges(challenges);
    }

    fetchAndSetHabits();
  }, []);

  useEffect(() => {
    calculateTotalChallengeCompletionPercentage();
  }, [challenges]);

  const calculateCompletionPercentageForDate = (
    habits: Habit[],
    date: string
  ): number => {
    const totalHabits = habits.length;
    const completedHabitsOnDate = habits.filter((habit) =>
      habit?.completed?.some((completedDate) => completedDate.date === date)
    ).length;
    return totalHabits > 0
      ? parseInt(((completedHabitsOnDate / totalHabits) * 100).toFixed(1))
      : 0;
  };

  const calculateCompletionPercentageFinal = async (): Promise<Challenge[]> => {
    const challenges = await getHabitChallenges();
    const currentDate = new Date().toISOString().split("T")[0];
    challenges.forEach((challenge) => {
      const { startDate, challengeDays } = challenge.habits[0];
      if (startDate && challengeDays) {
        const completionPercentages: { [date: string]: number } = {};
        const startDateObj = new Date(startDate);
        for (let i = 0; i < challengeDays; i++) {
          const date = new Date(startDateObj);
          date.setDate(startDateObj.getDate() + i);
          const formattedDate = date.toISOString().split("T")[0];
          completionPercentages[formattedDate] =
            calculateCompletionPercentageForDate(
              challenge.habits,
              formattedDate
            );
        }
        challenge.completionPercentages = completionPercentages;
      }
    });
    renderActivityRings(challenges);
    return challenges;
  };

  const totalChallengeCompletionPercentage = (challenges: Challenge[]) => {
    let totalCompletionPercentage = 0;
    const percentageObject: any = {};
    challenges.forEach((challenge) => {
      totalCompletionPercentage = 0;
      if (challenge.completionPercentages) {
        const totalCompletionPercentages =
          Object.values(challenge.completionPercentages).length * 100;
        Object.values(challenge.completionPercentages).forEach(
          (habitCompletionPercentages) => {
            totalCompletionPercentage += habitCompletionPercentages;
          }
        );
        percentageObject[challenge.challengeName] = (
          (totalCompletionPercentage / totalCompletionPercentages) *
          100
        ).toFixed(0);
      }
    });
    setChallengeCompletion(percentageObject);
    console.log("percentageObject:: ", percentageObject);
    return percentageObject;
  };

  const calculateTotalChallengeCompletionPercentage = () => {
    let totalCompletionPercentage = 0;
    challenges.forEach((challenge) => {
      if (challenge.completionPercentages) {
        Object.values(challenge.completionPercentages).forEach(
          (habitCompletionPercentages) => {
            totalCompletionPercentage += habitCompletionPercentages;
          }
        );
      }
    });
  };

  const fetchHabits = async () => {
    try {
      const response = await getHabitsdb();
      setHabits(response);
      const updatedChallenges = await calculateCompletionPercentageFinal();
      setChallenges(updatedChallenges);
      totalChallengeCompletionPercentage(updatedChallenges);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    try {
      await deleteChallengeFromDB(challengeId);
      fetchChallenges();
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  const deleteNonChallengeHabit = async (habitId: string) => {
    try {
      await deleteHabitdb(habitId);
      fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
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
      setChallenges([...challenges, newChallenge]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  const renderActivityRings = (challenges: Challenge[]): ActivityRing[][] => {
    const activityRingsByChallenge: ActivityRing[][] = [];
    challenges.forEach((challenge) => {
      const activityRings: ActivityRing[] = [];
      const completionPercentages = challenge.completionPercentages;
      if (completionPercentages) {
        Object.entries(completionPercentages).forEach(([date, percentage]) => {
          const filledPercentage = percentage;
          const color = getRandomColor();
          const activityRing: ActivityRing = { filledPercentage, color };
          activityRings.push(activityRing);
        });
      }
      activityRingsByChallenge.push(activityRings);
    });
    return activityRingsByChallenge;
  };

  const ActivityRings2 = ({ rings }: { rings: ActivityRing[][] }) => {
    return (
      <div className="flex justify-center space-x-4">
        {rings?.map((ring, index) => {
          if (ring?.length === 0) {
            return null;
          }
          return (
            <div key={index} className="w-40">
              <div
                className="radial-progress"
                style={{ "--value": 70 }}
                role="progressbar"
              >
                70%
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getRandomColor = (): string => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const noChallengeHabits = habits.filter((habit) => !habit.challengeId);
  // console.log('completionPercentages>> ', completionPercentages);
  const completedChallenges = challenges.filter(
    (challenge) =>
      challenge.habits[0].startDate ===
        new Date().toISOString().split("T")[0] ||
      challengeCompletion[challenge.challengeName] == 100
  );

  console.log("completedChallenges>> ", habits);
console.log('completedChallenges', completedChallenges);
  const areThereCompletedChallenges = completedChallenges.length > 0;


  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-left text-gray-800">
        Ongoing Challenges
      </h1>

      <div className="mb-6 flex justify-start">
        {showForm ? (
          <button
            className="btn btn-outline px-6 py-2 rounded-lg shadow-md"
            onClick={() => setShowForm(false)}
          >
            ⬅️ Back
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            {selectedChallenge && (
              <button
                onClick={() => setSelectedChallenge(null)}
                className="btn btn-outline px-6 py-2 rounded-lg shadow-md"
              >
                ⬅️ Back
              </button>
            )}
            
          </div>
        )}
      </div>

     

      {!showForm && !selectedChallenge && challenges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => {
            const challengeName = challenge.challengeName;
            if (challengeCompletion[challengeName] == 100) return null;
            return (
              <div
                key={index}
                className="p-6 rounded-lg border-2 border-black shadow-2xl flex flex-col justify-between"
              >
                {/*  */}
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {challenge.challengeName}
                </h2>
                <div
                  className={`radial-progress bg-white text-black border-4 border-slate-300 mx-auto mb-4`}
                  style={{ "--value": `${challengeCompletion[challengeName]}` }}
                  role="progressbar"
                >
                  {challengeCompletion[challengeName]}%
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-600">Habits</p>
                  <ul className="list-disc ml-6">
                    {challenge.habits.map((habit, habitIndex) => (
                      <li key={habitIndex} className="text-gray-600">
                        {habit.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedChallenge(challenge)}
                    className="btn btn-outline px-4 py-2 rounded-lg shadow-md"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      deleteChallenge(challenge.habits[0].challengeId!)
                    }
                    className="btn btn-danger px-4 py-2 rounded-lg shadow-md"
                  >
                    🗑️ Delete Challenge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!showForm && !selectedChallenge && challenges.length > 0 && (
        <div className="mt-4 mb-4">
          {completedChallenges.length > 0 ? <p className="text-3xl mt-8 font-bold">Completed Challenges</p> : <p className="text-3xl py-8 font-bold">No Completed Challenges 🧐</p>}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            { challenges.map((challenge, index) => {
              const challengeName = challenge.challengeName;
              if (challengeCompletion[challengeName] == 100) {
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg border-2 border-black shadow-2xl flex flex-col justify-between"
                  >
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                      {challenge.challengeName}
                    </h2>
                    <div
                      className="radial-progress bg-white text-primary-content border-4 border-slate-300 mx-auto mb-4"
                      style={{
                        "--value": `${challengeCompletion[challengeName]}`,
                      }}
                      role="progressbar"
                    >
                      {challengeCompletion[challengeName]}%
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-gray-600">Habits:</p>
                      <ul className="list-disc ml-6">
                        {challenge.habits.map((habit, habitIndex) => (
                          <li key={habitIndex} className="text-gray-600">
                            {habit.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => setSelectedChallenge(challenge)}
                        className="btn btn-outline px-4 py-2 rounded-lg shadow-md"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() =>
                          deleteChallenge(challenge.habits[0].challengeId!)
                        }
                        className="btn btn-danger px-4 py-2 rounded-lg shadow-md"
                      >
                        🗑️ Delete Challenge
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {selectedChallenge && (
        <div className="mt-6">
          <ChallengeDetails
            selectedChallenge={selectedChallenge}
            challengeName={selectedChallenge.challengeName}
            completionPercentages={
              selectedChallenge.completionPercentages || {}
            }
          />
        </div>
      )}

      {!showForm && challenges.length === 0 && habits.length === 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-500">No challenges available.</p>
        </div>
      )}
    </div>
  );
};

export default Challenges;
