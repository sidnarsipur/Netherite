import { BlocksByID } from "@/lib/dataStore";
import { db, pc } from "@/lib/init";
import { Block } from "@/lib/model";

export async function POST(req: Request) {
  try {
    const { noteID } = await req.json();

    const notesRef = await db
      .collection("notes")
      .where("noteID", "==", noteID)
      .get();

    if (notesRef.empty) {
      return Response.json(
        { message: "No notes found for this user" },
        { status: 404 },
      );
    }

    const blockIDs = notesRef.docs[0].data().blockIDs;
    const blocks = await BlocksByID(blockIDs);

    return Response.json({ blocks: blocks });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Failed to create note",
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
