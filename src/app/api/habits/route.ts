import { NextApiRequest, NextApiResponse } from "next";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  executeQuery,
} from "../../services/habitsService";
import { HabitModel } from "@/app/models/habit.model";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const habits = await getHabits();
    try {
      console.log("Habits:", habits);

      // Other queries...
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }

    // res.status(200).json(habits);
    return Response.json({ message: habits });
  } catch (error) {
    console.error("Error getting habits:", error);
    // res.status(500).json({ error: 'Internal Server Error' });
    return Response.json({ error: "Internal Server Error" });
  }
}

export async function POST(req: any, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    console.log("body:: ", body);
    // Validate the newHabit data (optional)

    const createdHabit = await createHabit(body);
    console.log("createdHabit:: ", createdHabit);
    return Response.json(createdHabit); // 201 Created status code for successful creation
  } catch (error) {
    console.error("Error creating habit:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
