import { db, pc } from "./init";
import { Block, ContentNode } from "./model";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from 'uuid';

const model = 'multilingual-e5-large';

export async function EmbedAndInsertBlocks(blocks: Block[], noteID: string){
    const embeddings = await pc.inference.embed(
        model,
        blocks.map(block => parseRawText(block.content)),
        { inputType: 'passage', truncate: 'END' }
    );

    const index = pc.index('embeddings');

    for(const block of blocks){
        block.noteID = noteID;
        const res = db.collection('blocks').add(block);
        block.blockID = uuidv4();
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
                return node.text;
            } else if (Array.isArray(node.content)) {
                return parseRawText(node.content); 
            }
            return '';
        })
        .join(' ');
}