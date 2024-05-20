"use client";
import React, { useState, useEffect, useRef } from "react";
import HeatMap from "@uiw/react-heat-map";
// import Tooltip from "@uiw/react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import habitDB, { Habit } from "../db";
import useHabits from "../hooks/useHooks";
import html2canvas from "html2canvas-pro";
import { TwitterShareButton } from "react-share";
import {
  Challenge,
  calculateCurrentStreak,
  calculateStreaks,
  getHabitChallenges,
  groupHabitsIntoChallenges,
} from "../services/habitsService";
import CompletedDatesChart from "../components/CompletedDatesChart";
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import HabitImageDisplay from "../components/HabitImageDisplay";

export default function Progress({ fullScreen = true }: any) {
  const habitsData: any = useHabits();
  console.log("progress:: ", habitsData);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(null);
  let challenges: any;

  const [challengesData, setChallenges] = useState<Challenge[]>([]);

  // Function to group habits by challengeId
  const groupHabitsByChallengeId = (habits: Habit[]) => {
    const groupedHabits: { [key: string]: Habit[] } = {};

    habits.forEach((habit) => {
      const { challengeId }: any = habit;
      if (!groupedHabits[challengeId]) {
        groupedHabits[challengeId] = [];
      }
      groupedHabits[challengeId].push(habit);
    });

    return groupedHabits;
  };

  const groupedHabits = groupHabitsByChallengeId(habitsData);

  const handleScreenshot = async (habit: Habit) => {
    if (heatmapRef.current) {
      const canvas = await html2canvas(heatmapRef.current);
      const data = canvas.toDataURL("image/png");
      setScreenshotData(data);
      setCurrentHabit(habit);
    }
  };

  const handleImageDownload = () => {
    if (screenshotData) {
      const link = document.createElement("a");
      link.href = screenshotData;
      link.download = "heatmap.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setScreenshotData(null);
      setCurrentHabit(null);
    }
  };

  const arr = [
    {
      date: "2024-05-08",
    },
    {
      date: "2024-05-10",
    },
    {
      date: "2024-05-11",
    },
  ];

  const dates = arr.map(({ date }) => date);
  // const dates = ["2024-05-07", "2024-05-01", "2024-05-10", "2024-05-11"];

  console.log("dates::: ", dates);

  console.log("groupedHabits::: ", groupedHabits);
  // console.log('currentStreak:: ', calculateCurrentStreak(dates));
  const completedDates = [
    { date: "2024-05-01" },
    { date: "2024-05-05" },
    { date: "2024-05-10" },
  ]; // Example completed dates

  return (
    <div
      className={`${
        fullScreen ? "h-screen" : ""
      } pl-2 pt-2 bg-white overflow-auto`}
    >
      {Object.keys(groupedHabits).map((challengeId, index) => {
        const isChallenge = groupedHabits[challengeId][0].challengeName
          ? true
          : false;
        // console.log('isChallenge::: ', isChallenge);
        return (
          <div key={challengeId} className="mb-4 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-4xl font-semibold">
                {groupedHabits[challengeId][0].challengeName}
                {/* {isChallenge ? 'Challenge:' : ''} {groupedHabits[challengeId][0].challengeName} */}
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {groupedHabits[challengeId].map(
                ({ name, completed, startDate }: Habit) => (
                  <div
                    key={name}
                    ref={heatmapRef}
                    className="p-4 rounded-3xl w-7/12 bg-white border-2 shadow-md border-black"
                  >
                    <h3 className="text-2xl font-semibold mb-1">{name}</h3>
                    <h3 className="text-lg">
                      Duration: {groupedHabits[challengeId][0].challengeDays}{" "}
                      days
                    </h3>
                    <p className="mb-2 text-lg">
                      Streak:{" "}
                      {calculateCurrentStreak(
                        completed?.map(({ date }) => date)
                      )}{" "}
                      days
                    </p>
                    {/* <CompletedDatesChart completedDates={challenges!} /> */}

                    <div>
                      <HeatMap
                        value={completed?.map((date: any) => ({
                          date: date.date,
                          count: 1,
                        }))}
                        width={1000}
                        id={name}
                        endDate={new Date("2024/12/31")}
                        legendCellSize={0}
                        rectSize={20}
                        height={200}
                        weekLabels={[
                          "Sun",
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                        ]}
                        startDate={new Date("2024/01/01")}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                      // @ts-ignore
                        onClick={() => handleScreenshot({ name, completed })}
                      >
                        Take Screenshot
                      </button>
                      {currentHabit &&
                        currentHabit.name === name &&
                        screenshotData && (
                          <div>
                            <button onClick={handleImageDownload}>
                              Download
                            </button>
                            <TwitterShareButton
                              url={window.location.href} // Share current URL
                              title={`Check out my progress on ${name}`} // Custom message for Twitter
                              hashtags={["progress", "heatmap"]} // Hashtags for Twitter
                      // @ts-ignore
                              imageUrl={screenshotData} // Image URL to share
                              className="share-button" // Optional class for styling
                            >
                              Share on Twitter
                            </TwitterShareButton>
                          </div>
                        )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
      
    </div>
  );
}
