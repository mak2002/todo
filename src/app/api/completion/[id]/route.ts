import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { completeHabit } from "../../../services/habitsService";

export async function POST(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    const habitId = params.id as string;

    console.log("Habit:: ", habitId);

    const updatedHabit = await completeHabit((habitId));
    console.log("updatedHabit:: ", updatedHabit);
    return Response.json({ message: "Habit marked as completed" });
  } catch (error) {
    console.error("Error marking habit as completed:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
