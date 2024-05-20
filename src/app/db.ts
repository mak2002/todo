import Dexie from 'dexie';

export interface Habit {
  completionPercentage?: number;
  challengeName?: string;
  _id: string;
  name: string;
  description?: string;
  startDate?: string; // Date when the habit started
  frequency?: string; // Frequency of the habit (e.g., daily, weekly)
  // completed: { date: string; additionalInfo?: string }[]; // Array of completed dates with optional additional info
  completed?: { date: string; additionalInfo?: string; image?: string }[];
  emoji?: any;
  // New fields for habit challenge
  notifyTime?: string;
  challengeDays?: number;
  tags?: string[];
  challengeId?: string;
  isProgressLogged?: boolean;
}

class HabitDatabase extends Dexie {
  habits: Dexie.Table<Habit, string>;

  constructor() {
    super('HabitDatabase');
    this.version(6).stores({
      habits: '_id, name, description, startDate, frequency, completed.date, completed.additionalInfo, emoji, challengeDay, notifyTime, challengeDays, tags, challengeId',
    });
    this.habits = this.table('habits');
  }
}

const habitDB = new HabitDatabase();

export default habitDB;
