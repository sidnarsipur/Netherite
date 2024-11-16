import { db, pc } from "@/app/lib/init";
import { Block } from "@/app/lib/model";

export async function POST(req: Request){
    try{
        const { noteID } = await req.json();

        const notesRef = await db.collection('notes').where('noteID', '==', noteID).get();

        if (notesRef.empty){
            return Response.json({ message: 'No notes found for this user' }, { status: 404 });
        }

        const blockIDs = notesRef.docs[0].data().blockIDs;

        console.log(blockIDs);

        const blockRef = await db.collection('blocks').where('blockID', 'in', blockIDs).get();

        if (blockRef.empty){
            return Response.json({ message: 'No blocks found for this note' }, { status: 404 });
        }

        const blocks: Block[] = [];

        blockRef.forEach(doc => {
            const block = doc.data();

            blocks.push({
                blockID: block.blockID,
                noteID: block.noteID,
                links: block.links,
                content: block.content,
                rawText: block.rawText
            })
        })

        return Response.json({ blocks: blocks });
    }

    catch(error){
        return new Response(JSON.stringify({ message: 'Failed to create note', error: error.message }), { status: 500 });
    }
}