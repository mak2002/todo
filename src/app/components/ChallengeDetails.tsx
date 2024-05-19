import React, { useEffect, useState } from "react";
import HabitImageDisplay from "./HabitImageDisplay"; // Adjust the import path as necessary

interface ChallengeDetailsProps {
  selectedChallenge: any;
  challengeName: string;
  completionPercentages: { [date: string]: number };
}

const ChallengeDetails: React.FC<ChallengeDetailsProps> = ({
  selectedChallenge,
  challengeName,
  completionPercentages,
}) => {
  const habits = selectedChallenge.habits;
  const [viewMode, setViewMode] = useState<
    "completionProgress" | "additionalInfo"
  >("completionProgress");
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]._id);

  const handleHabitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHabitId(event.target.value);
  };

  const selectedHabit = habits.find((habit) => habit._id === selectedHabitId);

  useEffect(() => {
    
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-black">
      <h2 className="text-xl font-semibold mb-4">{challengeName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700 mb-2">Start Date:</p>
          <p className="text-sm font-semibold">
            {selectedChallenge.habits[0].startDate}
          </p>
        </div>
        <div>
          <p className="text-gray-700 mb-2">Duration:</p>
          <p className="text-sm font-semibold">
            {selectedChallenge.habits[0].challengeDays} days
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-around mb-4 w-1/6 gap-4">
          
          <button
            className={`btn ${
              viewMode === "completionProgress" ? "btn-neutral" : "btn-outline"
            } rounded-3xl`}
            onClick={() => setViewMode("completionProgress")}
          >
            Completion Progress
          </button>

          <button
            className={`btn ${
              viewMode === "additionalInfo" ? "btn-neutral" : "btn-outline"
            } rounded-3xl`}
            onClick={() => setViewMode("additionalInfo")}
          >
            Progress Log
          </button>
        </div>

        {viewMode === "completionProgress" && (
          <>
            <h3 className="text-lg font-semibold mb-2">Completion Progress</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {Object.entries(completionPercentages).map(
                ([date, percentage]) => {
                  const date2 = new Date(date);
                  const formattedDate = `${String(date2.getDate()).padStart(
                    2,
                    "0"
                  )}-${String(date2.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}-${date2.getFullYear()}`;
                  return (
                    <li
                      key={formattedDate}
                      className="border-2 border-black p-2"
                    >
                      <div className="flex flex-col">
                        <p className="text-md text-gray-700 mb-1">
                          {formattedDate}
                        </p>
                        <div
                          className="radial-progress bg-white text-black border-4 border-"
                          style={{ "--value": percentage }}
                          role="progressbar"
                        >
                          {percentage}%
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </>
        )}

        {viewMode === "additionalInfo" && (
          <>
            <h3 className="text-lg font-semibold mb-2">Progress Log</h3>
            <div className="mb-4">
              <label htmlFor="habitSelect" className="mr-2">
                Habit:
              </label>
              <select
                id="habitSelect"
                className="border-black select-bordered border-2 rounded p-2"
                value={selectedHabitId}
                onChange={handleHabitChange}
              >
                {habits.map((habit: any) => (
                  <option key={habit._id} value={habit._id}>
                    {habit.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedHabit && (
              <div className="rounded-lg border border-gray-300 shadow-lg p-4 bg-gray-50 hover:bg-gray-100 ">
                <div className="p-2">
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedHabit.name}
                  </h3>
                  <div className="flex flex-wrap w-full gap-2 divide-gray-200">
                    {selectedHabit.completed?.map((completion: any) => {
                      const completionDate = new Date(completion.date);
                      const formattedCompletionDate = `${String(
                        completionDate.getDate()
                      ).padStart(2, "0")}-${String(
                        completionDate.getMonth() + 1
                      ).padStart(2, "0")}-${completionDate.getFullYear()}`;
                      return (
                        <div
                          key={formattedCompletionDate}
                          className="py-2 w-full"
                        >
                          <div className="flex flex-col justify-center">
                            <span className="font-semibold text-gray-800 text-md">
                              {formattedCompletionDate}
                            </span>
                          </div>
                          <p className="ml-1 text-gray-600 text-lg mb-2">
                            {completion.additionalInfo}
                          </p>
                          {completion.image && (
                            <div className="mt-2">
                              <HabitImageDisplay
                                habitId={selectedHabit._id}
                                showDate={completion.date}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetails;
