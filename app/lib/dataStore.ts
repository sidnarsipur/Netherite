import { db, pc } from "./init";
import { Block } from "./model";
import { FieldValue } from "firebase-admin/firestore";

const model = 'multilingual-e5-large';

export async function EmbedAndInsertBlocks(blocks: Block[]){
    const embeddings = await pc.inference.embed(
        model,
        blocks.map(block => block.rawText),
        { inputType: 'passage', truncate: 'END' }
    );

    const index = pc.index('embeddings');

    for(const block of blocks){
        const res = db.collection('blocks').add({block});
        block.blockID = (await res).id;
    }

    const records = blocks
        .map((block, i) => ({
            id: block.blockID,
            values: embeddings[i].values as number[],
        })
    );

    index.namespace('namespace').upsert(records);

    return blocks.map(block => block.blockID)
}

// export async function addBlocks(userID: string, noteID: string, blocks: Block[]){
//     // Parse raw text

//     const block_ids = EmbedAndInsertBlocks(blocks);

//     const _ = await db.collection('notes').doc(noteID)
//         .update({
//             blockIDs: FieldValue.arrayUnion(block_ids)
//         })
    
        
//     return true;
// }

// export async function getNotes(userID: string){
//     const notes = db.collection('notes').where('uid', '==', userID).get();

//     return notes;
// }