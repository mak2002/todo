import React, { useState } from "react";
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
    "completionProgress" | "habitDetails" | "additionalInfo"
  >("completionProgress");

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
        <div className="flex justify-around mb-4">
          <button
            className={`btn ${
              viewMode === "completionProgress" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("completionProgress")}
          >
            Completion Progress
          </button>
          <button
            className={`btn ${
              viewMode === "habitDetails" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("habitDetails")}
          >
            Habit Details
          </button>
          <button
            className={`btn ${
              viewMode === "additionalInfo" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("additionalInfo")}
          >
            Additional Info
          </button>
        </div>

        {viewMode === "completionProgress" && (
          <>
            <h3 className="text-lg font-semibold mb-2">Completion Progress</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {Object.entries(completionPercentages).map(
                ([date, percentage]) => {
                  const date2 = new Date(date).toLocaleDateString();
                  return (
                    <li key={date2} className="border-2 border-black  p-2">
                      <div className="flex flex-col ">
                        <p className="text-md text-gray-700 mb-1">{date2}</p>
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

        {/* {viewMode === "habitDetails" && (
          <>
            <h3 className="text-lg font-semibold mb-2">Habits</h3>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit: any) => (
                <li
                  key={habit._id}
                  className="rounded-lg border border-black shadow-md p-2"
                >
                  <div className="p-2">
                    <h3 className="text-sm font-semibold mb-2">{habit.name}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        Last Completed:{" "}
                        {habit.completed?.length > 0 ? (
                          <span>{habit.completed[0].date}</span>
                        ) : (
                          <span className="italic">Not completed yet</span>
                        )}
                      </span>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {habit.completed?.map((completion: any) => (
                        <li key={completion.date} className="py-2">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-800 text-xs">
                              {completion.date}
                            </span>
                            <p className="ml-1 text-gray-600 text-xs">
                              {completion.additionalInfo}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )} */}

        {viewMode === "additionalInfo" && (
          <>
            <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit: any) => (
                <li
                  key={habit._id}
                  className="rounded-lg border border-gray-300 shadow-lg p-4 bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:-translate-y-1">
                  <div className="p-2">
                    <h3 className="text-md font-semibold mb-2">{habit.name}</h3>
                    <ul className="divide-y divide-gray-200">
                      {habit.completed?.map((completion: any) => (
                        <li key={completion.date} className="py-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-xs">
                              {completion.date}
                            </span>
                            <p className="ml-1 text-gray-600 text-sm mb-2">
                              {completion.additionalInfo}
                            </p>
                            {completion.image && (
                              <div className="mt-2">
                                <HabitImageDisplay
                                  habitId={habit._id}
                                  showDate={completion.date}
                                />
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetails;
