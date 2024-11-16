import { db, pc } from "./init";
import { Block, ContentNode } from "./model";
import { FieldValue } from "firebase-admin/firestore";

const model = 'multilingual-e5-large';

export async function EmbedAndInsertBlocks(blocks: Block[]){
    const embeddings = await pc.inference.embed(
        model,
        blocks.map(block => parseRawText(block.content)),
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

function parseRawText(content: ContentNode[]): string {
    if (!Array.isArray(content)) {
        // Ensure content is an array
        console.error("Invalid content: expected an array, got", content);
        return '';
    }

    return content
        .map(node => {
            if (node.text) {
                return node.text; // If the node contains text, extract it
            } else if (Array.isArray(node.content)) {
                return parseRawText(node.content); // Recursively process nested content
            }
            return ''; // Handle nodes without text or nested content
        })
        .join(' ');
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