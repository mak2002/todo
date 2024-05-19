import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { completeHabitdb } from "../../../services/habitsService";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const habitId = params.id as string;
    const body = await await req.json()
const completionDate = body.date

    console.log("Habit:: ", habitId);

    const updatedHabit = await completeHabitdb(habitId, completionDate);
    console.log("updatedHabit:: ", updatedHabit);
    return Response.json({ message: "Habit marked as completed" });
  } catch (error) {
    console.error("Error marking habit as completed:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
