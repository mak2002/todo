import React, { useState } from "react";

const HabitList = ({ habits, onEdit }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {habits?.map((habit: any, index: number) => (
        <div key={index} className="mb-4">
          <p>Name: {habit.name}</p>
          <p>Frequency: {habit.frequency}</p>
          <p>Notify Time: {habit.notifyTime}</p>
          <p>Challenge Days: {habit.challengeDays}</p>
          <p>Tags: {habit.tags.join(", ")}</p>
          <button onClick={() => onEdit(habit)} className="btn btn-primary">
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default HabitList;
