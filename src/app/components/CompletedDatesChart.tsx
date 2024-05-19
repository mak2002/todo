import React from 'react';
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";

interface Habit {
  _id: string;
  name: string;
  completed: { date: string }[];
}

interface Challenge {
  challengeName: string;
  habits: Habit[];
}

interface ChallengeActivityRingsProps {
  challenges: Challenge[];
}

const calculateCompletionPercentage = (habits: Habit[], date: string): number => {
  const totalHabits = habits.length;
  const completionCounts = habits.reduce((acc, habit) => {
    return habit.completed.some(entry => entry.date === date) ? acc + 1 : acc;
  }, 0);
  return totalHabits > 0 ? completionCounts / totalHabits : 0;
};

const ChallengeActivityRings: React.FC<ChallengeActivityRingsProps> = ({ challenges }) => {
  const completionPercentages: { filledPercentage: number; color: string; }[] = [];

  challenges?.forEach(challenge => {
    const habitColors: { [key: string]: string } = {}; // Store habit colors for consistent mapping

    challenge.habits.forEach(habit => {
      habitColors[habit._id] = '#' + Math.floor(Math.random()*16777215).toString(16); // Generate random color for each habit
      habit.completed.forEach(entry => {
        const completionPercentage = calculateCompletionPercentage(challenge.habits, entry.date);
        completionPercentages.push({ filledPercentage: completionPercentage, color: habitColors[habit._id] });
      });
    });
  });

  return <ActivityRings rings={completionPercentages} />;
};

export default ChallengeActivityRings;
