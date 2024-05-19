import React, { useEffect, useState } from "react";
import { getHabitById } from "../services/habitsService";

interface Habit {
  _id?: string;
  challengeId: string;
  challengeName: string;
  completed?: { date: string; additionalInfo: string; image?: string }[];
  // other fields...
}

const HabitImageDisplay = ({ habitId, showDate }: { habitId: string, showDate: string }) => {
  const [imageData, setImageData] = useState<string | null>(null);

  //   useEffect(() => {
  const fetchHabit = async () => {
    const habit = await getHabitById(habitId);
    console.log("yooo::", habit);
    if (habit && habit.completed && habit.completed.length > 0) {
      // Assuming we want to display the image from the latest completion entry
    //   const latestCompletion = habit.completed[0];
    const habitInstance: any = habit.completed.find((completion) => completion.date === showDate)
    console.log('latestCompletion: ', habitInstance);
      if (habitInstance) {
        setImageData(habitInstance.image);
      }
    }
  };

  fetchHabit();
  //   }, [habitId]);

  return (
    <div>
      {imageData ? (
        <img src={imageData} width={700} alt="Habit completion" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default HabitImageDisplay;
