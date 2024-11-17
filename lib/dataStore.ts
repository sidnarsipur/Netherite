import { db, pc, model, index } from "./init";
import { Block, ContentNode } from "@/lib/model";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

export async function EmbedAndInsertBlocks(blocks: Block[], noteID: string) {
  const embeddings = await pc.inference.embed(
    model,
    blocks.map((block) => parseRawText(block.content)),
    { inputType: "passage", truncate: "END" },
  );

  for (const block of blocks) {
    block.noteID = noteID;
    const res = db.collection("blocks").add(block);
    block.blockID = uuidv4();
  }

  const records = blocks.map((block, i) => ({
    id: block.blockID,
    values: embeddings[i].values as number[],
  }));

  index.namespace("namespace").upsert(records);

  return blocks.map((block) => block.blockID);
}

export async function BlocksByID(blockIDs: string[]) {
  const blockRef = await db
    .collection("blocks")
    .where("blockID", "in", blockIDs)
    .get();

  if (blockRef.empty) {
    return Response.json(
      { message: "No blocks found for this note" },
      { status: 404 },
    );
  }

  const blocks: Block[] = [];

  blockRef.forEach((doc) => {
    const block = doc.data();

    blocks.push({
      blockID: block.blockID,
      noteID: block.noteID,
      links: block.links,
      content: block.content,
      rawText: block.rawText,
    });
  });

  return blocks;
}

function parseRawText(content: ContentNode[]): string {
  if (!Array.isArray(content)) {
    console.error("Invalid content: expected an array, got", content);
    return "";
  }

  return content
    .map((node) => {
      if (node.text) {
        return node.text;
      } else if (Array.isArray(node.content)) {
        return parseRawText(node.content);
      }
      return "";
    })
    .join(" ");
}
