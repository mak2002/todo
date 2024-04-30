// services/habitService.ts

import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { mongo_URL } from "@/app/services/vars";
import { ServerApiVersion } from "mongodb";
import { HabitModel } from '../models/habit.model';

interface Habit {
  name: string;
  description: string;
  // Add more fields as needed
}

const dbName = "habitsDb"; // Replace 'your_database_name' with your actual database name
const collectionName = "habits"; // Name of the collection where habits will be stored

const client = new MongoClient(mongo_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
});

// Define a type for the query object
type QueryObject<T> = Partial<T>;

// Function to execute a query

export async function executeQuery<T>(query: any): Promise<any> {

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.find(query).toArray();
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Propagate the error
    } finally {
        await client.close();
    }
}


export async function createHabit(habitData: Habit): Promise<any> {
  //   const client = new MongoClient(mongo_URL);

  try {
    await client.connect();
    const db: Db = client.db(dbName);
    const collection: Collection<Habit> = db.collection(collectionName);
    const result = await collection.insertOne(habitData);
    return result;
  } finally {
    await client.close();
  }
}

export async function getHabitIds(): Promise<ObjectId[]> {
    const client = new MongoClient(mongo_URL);
  
    try {
      await client.connect();
      const db: Db = client.db(dbName);
      const collection: Collection<Habit> = db.collection(collectionName);
      const habits = await collection.find({}).toArray();
      const habitIds = habits.map((habit) => habit._id);
      console.log('habitIds: ', habitIds);
      return habitIds;
    } finally {
      await client.close();
    }
  }

export async function getHabits(): Promise<Habit[]> {
  const client = new MongoClient(mongo_URL);

  try {
    await client.connect();
    const db: Db = client.db(dbName);
    const collection: Collection<Habit> = db.collection(collectionName);
    const habits = await collection.find({}).toArray();
    await getHabitIds()
    return habits;
  } finally {
    await client.close();
  }
}

export async function updateHabit(
  habitId: ObjectId,
  newData: Partial<Habit>
): Promise<any> {
//   const client = new MongoClient(mongo_URL);

  try {
    await client.connect();
    const db: Db = client.db(dbName);
    const collection: Collection<Habit> = db.collection(collectionName);
    const result = await collection.updateOne(
      { _id: habitId },
      { $set: newData }
    );
    console.log('result:: ', result);
    return result;
  } finally {
    await client.close();
  }
}

export async function deleteHabit(habitId: ObjectId): Promise<any> {
console.log('calling?', habitId);
  try {
    await client.connect();
    const db: Db = client.db(dbName);
    const collection: Collection<Habit> = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: habitId });
    console.log('result:: ', result);
    return result;
  } finally {
    await client.close();
  }
}

// write a function to make the habits completed with current date

export async function completeHabit(habitId: ObjectId): Promise<any> {
  try {
    // Connect to the database
    await client.connect();

    // Get the database and collection
    const db: Db = client.db(dbName);
    const collection: Collection<Habit> = db.collection(collectionName);

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    // Update the habit document to push the current date to the completed array
    const result = await collection.updateOne(
      { _id: habitId },
      { $push: { completed: currentDate } }
    );

    console.log("Habit marked as completed:", result);
    return result;
  } catch (error) {
    console.error("Error completing habit:", error);
    throw error; // Propagate the error
  } finally {
    // Close the database connection
    await client.close();
  }
}
