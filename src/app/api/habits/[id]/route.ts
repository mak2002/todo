import { NextApiRequest, NextApiResponse } from "next";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  executeQuery,
} from "../../../services/habitsService";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, res: NextApiResponse) {
  // const { id } = req.query;
  try {
    const body = await req.json();
    console.log("body:: ", body);
    const id = body.id;

    // Retrieve habit ID from the appropriate location based on your API design
    let habitId;
    if (id) {
      habitId = id; // Assuming habit ID is in the query string (common for PUT)
    } else if (id) {
      habitId = id; // If ID is sent within the request body (less common for PUT)
    } else {
      return Response.json({ error: "Missing habit ID" });
    }

    // Validate habit ID (optional, customize validation based on your requirements)
    if (!habitId || !habitId.trim()) {
      return Response.json({ error: "Invalid habit ID" });
    }

    const objectId = new ObjectId(habitId);
    const updatedData = await updateHabit(objectId, body.newHabit);
    console.log("updatedData:: ", updatedData);

    return Response.json(updatedData);
  } catch (error) {
    console.error("Error updating habit:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}

export async function DELETE(req: any, { params }: { params: { id: string } }) {
  console.log("hiiiiii");

  console.log("idD: ", params.id);
  try {
    const objectId = new ObjectId(params.id);
    const deletedHabit = await deleteHabit(objectId);
    console.log("createdHabit:: ", deletedHabit);
    return Response.json({ msg: "deletedHabit" }); // 201 Created status code for successful creation
  } catch (error) {
    console.error("Error creating habit:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
