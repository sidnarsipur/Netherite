import { db, pc } from "@/app/lib/init";
import { EmbedAndInsertBlocks } from "@/app/lib/dataStore";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
      const { userID, blocks } = await req.json();

      const noteID = uuidv4();
      
      const block_ids = await EmbedAndInsertBlocks(blocks, noteID);

      const res = await db.collection('notes').add({
        noteID: noteID,
        userID: userID,
        blockIDs: block_ids,
      });

      return new Response(JSON.stringify({ noteID: noteID }), { status: 200 });
  } 
  
  catch (error) {
      console.error('Error in POST request:', error);
      return new Response(JSON.stringify({ message: 'Failed to create note', error: error.message }), { status: 500 });
  }
}