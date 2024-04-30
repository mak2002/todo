import Dexie from "dexie";
import habitDB, { Habit } from "../db";

export async function createHabit(habitData: Habit): Promise<any> {
  return habitDB.habits.add(habitData);
}

export async function getHabitsdb(): Promise<Habit[]> {
  return habitDB.habits.toArray();
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

export async function completeHabitdb(habitId: string): Promise<void> {
  const currentDate = new Date().toISOString().split("T")[0];
  const habit = await habitDB.habits.get(habitId);
  if (habit) {
    habit.completed.push({ date: currentDate });
    await habitDB.habits.update(habitId, { completed: habit.completed });
  } else {
    throw new Error("Habit not found");
  }
}
