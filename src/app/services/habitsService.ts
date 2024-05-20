import Dexie from "dexie";
import habitDB, { Habit } from "../db";

export async function createHabitdb(habitData: Habit): Promise<any> {
  return habitDB.habits.add(habitData);
}

export async function getHabitsdb(): Promise<Habit[]> {
  return habitDB.habits.toArray();
}

export async function getHabitById(habitId: string): Promise<Habit | undefined> {
  return habitDB.habits.get(habitId);
}

// implement deleteChallengeFromDB function here by deleting every habit associated with the given challengeId
export async function deleteChallengeFromDB(challengeId: string): Promise<void> {
  const habits = await habitDB.habits.where("challengeId").equals(challengeId).toArray();
  console.log('delete habits:: ', habits, challengeId);
  await habitDB.habits.bulkDelete(habits.map((habit) => habit._id));
}

export async function updateHabit(
  habitId: string,
  newData: Partial<Habit>
): Promise<void> {
  await habitDB.habits.update(habitId, newData);
}

export async function deleteHabitdb(habitId: string): Promise<void> {
  await habitDB.habits.delete(habitId);
}

export async function getHabitChallenges(): Promise<Challenge[]> {
  const habits = await habitDB.habits.where("challengeDays").above(0).toArray();
  // group the habits by challengeid
  
  return groupHabitsIntoChallenges(habits);
}

export interface Challenge {
  challengeName: string;
  habits: Habit[];
  completionPercentages?: any;
}


export function groupHabitsIntoChallenges(habits: Habit[]): Challenge[] {
  const groupedChallenges: { [key: string]: Challenge } = {};

  habits.forEach((habit) => {
    const { challengeId, challengeName, ...habitWithoutChallengeInfo }: any = habit;
    if (!groupedChallenges[challengeId]) {
      groupedChallenges[challengeId] = { 
        challengeName,
        habits: [],
      };
    }
    groupedChallenges[challengeId].habits.push({ 
      challengeId, 
      challengeName, 
      ...habitWithoutChallengeInfo 
    });
  });

 

  console.log(' Object.values(groupedChallenges):: ',  Object.values(groupedChallenges));
  return Object.values(groupedChallenges);
}


export async function completeHabitdb(
  habitId: string,
  completionDate: string,
  additionalInfo: string,
  base64Image?: string
): Promise<void> {
  const habit = await habitDB.habits.get(habitId);
  if (!habit) {
    throw new Error("Habit not found");
  }

  if (!habit.completed) {
    habit.completed = [];
  }

  const isDateAlreadyCompleted = habit.completed.some(
    (completedDate) => completedDate.date === completionDate
  );
  
  if (isDateAlreadyCompleted) {
    console.log("Habit already completed for today");
    return;
  }

  habit.completed.push({
    date: completionDate,
    additionalInfo: additionalInfo || "",
    image: base64Image || ""
  });

  await habitDB.habits.update(habitId, { completed: habit.completed });
}


async function convertToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


interface StreakResult {
  habitId: string;
  streak: number;
}

export function calculateCurrentStreak(dates: string[] | undefined): number {
  if (!dates || dates.length === 0) {
    return 0; // If no dates provided, streak is 0
  }

  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  let streak = 0;

  // Sort the dates array in ascending order
  dates.sort();

  // Find the index of the latest date before or equal to the current date
  const latestIndex = dates.findIndex((date) => date >= currentDate);

  // If the latestIndex is -1, there are no dates after the current date
  if (latestIndex === -1) {
    return 0;
  }

  // Iterate from the latest date index to the beginning of the array
  for (let i = latestIndex; i >= 0; i--) {
    const habitDate = dates[i];
    const differenceInDays = Math.floor(
      (new Date(currentDate).getTime() - new Date(habitDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // If the difference in days is equal to the streak, increment streak count
    if (differenceInDays === streak) {
      streak++;
    } else {
      break; // Streak is broken, exit loop
    }
  }

  return streak;
}


export const calculateStreaks = (habits: { date: string }[], currentDate: Date): number => {
  let streak = 0;
  let currentStreak = 0;
  const completedDates = habits?.map(({ date }) => {
    // Parse dates from format "YYYY/MM/DD"
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-based index in JavaScript Date constructor
  });

  console.log('completedDates:: ', completedDates);

  // Iterate over completed dates array and calculate streak
  for (let i = completedDates?.length - 1; i >= 0; i--) {
    console.log('currentDate.getTime(): ', currentDate.getTime(), 'completedDates[i].getTime(): ', completedDates[i].getTime(), 'diff: ', Math.floor((currentDate.getTime() - completedDates[i].getTime()) / (1000 * 60 * 60 * 24)));
    const diff = Math.floor((currentDate.getTime() - completedDates[i].getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      currentStreak++;
    } else {
      break; // Streak is broken, exit loop
    }
  }



  // Check if current streak is greater than previous streak, update streak if necessary
  if (currentStreak > streak) {
    streak = currentStreak;
  }

  console.log('streak:: ', streak);

  return currentStreak;
};