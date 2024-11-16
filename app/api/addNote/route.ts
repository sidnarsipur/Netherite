import { db, pc } from "@/app/lib/init";
import { EmbedAndInsertBlocks } from "@/app/lib/dataStore";

export async function POST(req: Request) {
  try {
      const { userID, blocks } = await req.json();
      
      const block_ids = await EmbedAndInsertBlocks(blocks);

      const res = await db.collection('notes').add({
          userID: userID,
          blockIDs: block_ids,
      });

      return new Response(JSON.stringify({ noteID: res.id }), { status: 200 });
  } 
  
  catch (error) {
      console.error('Error in POST request:', error);
      return new Response(JSON.stringify({ message: 'Failed to create note', error: error.message }), { status: 500 });
  }
}