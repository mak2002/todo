import { useState, useEffect } from "react";
import { getHabitsdb } from "../services/habitsService";
import { Habit } from "../db";


function useHabits(): Habit[] {
  const [habitsData, setHabitsData] = useState<Habit[]>([]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await getHabitsdb();
        const allHabits: Habit[] = response;

        // Convert each Habit object to JSON format
        const habitsJSON = allHabits.map((habit: Habit) => {
          const habitJSON = {
            challengeName: habit.challengeName,
            _id: habit._id,
            name: habit.name,
            description: habit.description,
            startDate: habit.startDate,
            frequency: habit.frequency,
            completed: habit.completed,
            emoji: habit.emoji,
            notifyTime: habit.notifyTime,
            challengeDays: habit.challengeDays,
            tags: habit.tags,
            challengeId: habit.challengeId,
          };
          return habitJSON;
        });

        // Convert the array of JSON objects to JSON string
        const habitsJSONString = JSON.stringify(habitsJSON, null, 2); // Use 2 spaces for indentation

        // console.log('habitsJSONString:: ', habitsJSONString);

        setHabitsData(allHabits);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };
    fetchHabits();
  }, []);

  return habitsData;
}

export default useHabits;
