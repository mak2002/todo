import Dexie from 'dexie';

export interface Habit {
  _id: string;
  name: string;
  description?: string;
  startDate?: string; // Date when the habit started
  frequency?: string; // Frequency of the habit (e.g., daily, weekly)
  completed: { date: string; }[]; // Array of completed dates with optional count
  emoji?: any;
  // Add more fields as needed
}

class HabitDatabase extends Dexie {
  habits: Dexie.Table<Habit, string>;

  constructor() {
    super('HabitDatabase');
    this.version(2).stores({
      habits: '_id, name, description, startDate, frequency, completed.date, emoji',
    });
    this.habits = this.table('habits');
  }
}

const habitDB = new HabitDatabase();

export default habitDB;
