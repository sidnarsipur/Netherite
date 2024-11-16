import { db, pc } from "@/app/lib/init";

export async function POST(req: Request){
    try{
        const { userID } = await req.json();

        const notesSnapshot = await db.collection('notes').where('userID', '==', userID).get();

        if (notesSnapshot.empty) {
            return Response.json({ message: 'No notes found for this user' }, { status: 404 });
        }

        const noteIDs: string[] = [];
        
        notesSnapshot.forEach(doc => {
            noteIDs.push(doc.data().noteID);
        });

        return Response.json({ noteIDs });
    }

    catch(error){
        return new Response(JSON.stringify({ message: 'Failed to create note', error: error.message }), { status: 500 });
    }
}