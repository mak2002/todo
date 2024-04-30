'use client';
import React from "react";
import HeatMap from "@uiw/react-heat-map";
import "react-calendar-heatmap/dist/styles.css";

export default function Progress() {
  const fakeHabitsData = [
    { habit: "Exercise", dates: ["2024-03-20", "2024-03-25", "2024-04-05"] },
    { habit: "Reading", dates: ["2024-03-22", "2024-04-02", "2024-04-10"] },
    { habit: "Meditation", dates: ["2024-03-21", "2024-04-01", "2024-04-09"] },
  ];

  return (
    <div className="h-screen pl-2 pt-2">
      {fakeHabitsData.map(({ habit, dates }) => (
        <div key={habit} className="w-2/6 mb-2">
          <h3 className="text-lg font-semibold mb-2">{habit}</h3>
         
          <HeatMap
            value={dates.map(date => ({ date, count: 1 }))}
            endDate={new Date("2024/05/20")}
            legendCellSize={0}
            rectSize={20}
            height={200}
            weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            startDate={new Date("2024/03/20")}
          />
        </div>
      ))}
    </div>
  );
}
