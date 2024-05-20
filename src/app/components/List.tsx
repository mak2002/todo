import React, { useState, useEffect } from "react";
import {
  completeHabitdb,
  deleteHabitdb,
  getHabitChallenges,
  getHabitsdb,
} from "../services/habitsService";
import { Habit } from "../db";
import "./List.css"; // Ensure this file is properly defined with necessary styles
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Habits = ({
  selectedDate,
  selectedComponent,
}: {
  selectedDate: Date;
  selectedComponent: string;
}) => {
  const [habits, setHabits] = useState<{ [challengeId: string]: Habit[] }>({});
  const [completedHabits, setCompletedHabits] = useState<{
    [challengeId: string]: Habit[];
  }>({});
  const [checkedHabitId, setCheckedHabitId] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("text");
  const [inputValue, setInputValue] = useState<string | File>("");

  const notify = () => toast("Habit completed 👍");

  const handleHabitClick = async (habitId: string) => {
    const abcd = habitId === checkedHabitId ? null : habitId
    console.log('abcd:: ', habitId);
    setCheckedHabitId(habitId === checkedHabitId ? null : habitId);
    setAnimationComplete(false);
    const habit = allHabits.find((habit) => habit._id === habitId);
    console.log("habit:: ", habit);
    if (habit!.isProgressLogged) {
      setShowModal(true);
    }
    else {
      await completeHabit(habitId!, inputValue as string);
      notify()
    }
  };

  useEffect(() => {
    fetchHabits();
    getHabitChallenges();
  }, [selectedDate]);

  const fetchHabits = async () => {
    try {
      const response = await getHabitsdb();
      const allHabits = response;
      setAllHabits(allHabits);
      const currentDate = selectedDate.toISOString().split("T")[0];

      const habitsByChallenge: { [challengeId: string]: Habit[] } = {};
      const completedHabitsByChallenge: { [challengeId: string]: Habit[] } = {};

      allHabits.forEach((habit) => {
        const challengeId: string = habit.challengeId!;
        if (!habitsByChallenge[challengeId]) {
          habitsByChallenge[challengeId] = [];
          completedHabitsByChallenge[challengeId] = [];
        }

        if (
          habit.completed?.some(
            (completedDate) => completedDate.date === currentDate
          )
        ) {
          completedHabitsByChallenge[challengeId].push(habit);
        } else {
          habitsByChallenge[challengeId].push(habit);
        }
      });

      setHabits(habitsByChallenge);
      setCompletedHabits(completedHabitsByChallenge);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await deleteHabitdb(habitId);
      await fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleSubmitonClose = async (e: any) => {
    e.preventDefault();
    if (inputType === "text") {
      await completeHabit(checkedHabitId!, inputValue as string);
      notify()
    } else if (inputType === "image") {
      await handleFileChange(inputValue as File);
    }
    setShowModal(false);
  };

  const handleFileChange = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result as string;
      await completeHabit(checkedHabitId!, additionalInfo, base64Image);
    };
    reader.readAsDataURL(file);
  };

  const completeHabit = async (
    habitId: string,
    additionalInfo: string,
    base64Image?: string
  ): Promise<void> => {
    await completeHabitdb(
      habitId,
      selectedDate.toISOString().split("T")[0],
      additionalInfo,
      base64Image
    );
    await fetchHabits();
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setInputValue(file);
  };

  const completedChallenges = Object.keys(completedHabits).filter(
    (key) => completedHabits[key].length > 0
  );
  console.log("completedChallenges", completedChallenges, allHabits);

  return (
    <div className="container mx-auto px-4 py-8 text-lg flex flex-col items-center justify-start min-h-screen">
      <ToastContainer />
      {Object.keys(habits).map((challengeId) => {
        const remainingHabits = habits[challengeId]?.filter(
          (habit) =>
            !completedHabits[challengeId]?.some(
              (completedHabit) => completedHabit._id === habit._id
            )
        );

        return (
          remainingHabits &&
          remainingHabits.length > 0 && (
            <div
              key={challengeId}
              className="w-full shadow-xl border border-black flex flex-col rounded-2xl mb-4 bg-white"
            >
              <div className="rounded-lg p-6">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800">
                  {
                    allHabits.find((h) => h.challengeId === challengeId)
                      ?.challengeName
                  }
                </h2>
                <ul>
                  {remainingHabits.map((habit) => (
                    <li
                      key={habit._id}
                      className={`flex text-xl sm:text-2xl items-center justify-between py-2 cursor-pointer transition-colors duration-500 ${
                        checkedHabitId === habit._id ? "checked clicked" : ""
                      }`}
                      onClick={() => handleHabitClick(habit._id)}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={false}
                          className="checkbox border-2 rounded-full border-black"
                        />
                        {habit.name} {habit.emoji}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        );
      })}

      {Object.keys(habits).every((challengeId) => {
        const remainingHabits = habits[challengeId]?.filter(
          (habit) =>
            !completedHabits[challengeId]?.some(
              (completedHabit) => completedHabit._id === habit._id
            )
        );
        return !remainingHabits || remainingHabits.length === 0;
      }) && (
        <div className="text-3xl w-full flex justify-center text-gray-700">
          {allHabits.length > 0 ? (
            `You have won today 😊`
          ) : (
            <div className="flex items-center gap-2">
              <p>Embark on a challenge by going to</p>
              <Link href="/browsechallenges">
                <p className="btn btn-outline rounded-3xl">Browse Challenges</p>
              </Link>
            </div>
          )}
        </div>
      )}

      {Object.values(completedHabits).some(
        (completed) => completed.length > 0
      ) && (
        <div className="rounded-2xl shadow-xl border-4 border-green-500 text-left text-gray-700 p-6 mt-4 w-full bg-white">
          <h2
            className="text-2xl text-gray-800 mb-4 cursor-pointer"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            Completed Habits
          </h2>
          {true && (
            <ul>
              {Object.keys(habits).map((challengeId) =>
                completedHabits[challengeId]?.map((habit) => (
                  <li
                    key={habit._id}
                    className="flex text-xl sm:text-2xl items-center justify-between border-b border-gray-300 py-2 line-through"
                  >
                    <span className="flex items-center gap-2">
                      <span className="filled-circle bg-gray-600 w-5 h-5 rounded-full"></span>
                      {habit.name} {habit.emoji}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-11/12 sm:w-96 shadow-xl">
            <h2 className="text-xl mb-4">Progress Log</h2>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
            {inputType === "text" && (
              <textarea
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                value={inputValue as string}
                onChange={handleInputChange}
                placeholder="Enter text..."
              />
            )}
            {inputType === "image" && (
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                onChange={handleImageChange}
              />
            )}
            <div className="flex gap-4 justify-between">
              <button
                className="btn btn-outline font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmitonClose}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
