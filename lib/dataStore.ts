import { db, pc, model, index, google, sysPrompt } from "./init";
import { Block, ContentNode } from "@/lib/model";
import { FieldValue, FieldPath } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { generateText } from "ai";

export async function EmbedAndInsertBlocks(blocks: Block[], noteID: string) {
  const embeddings = await pc.inference.embed(
    model,
    blocks.map((block) => block.rawText),
    { inputType: "passage", truncate: "END" },
  );

  for (const block of blocks) {
    block.noteID = noteID;
    const existingBlockRef = await db
      .collection("blocks")
      .where("noteID", "==", noteID)
      .where("order", "==", block.order)
      .get();

    if (!existingBlockRef.empty) {
      const existingBlock = existingBlockRef.docs[0];
      await existingBlock.ref.update({
        content: block.content,
        links: block.links,
      });
      block.id = existingBlock.id;
    } else {
      const res = db.collection("blocks").add(block);
      block.id = (await res).id;
    }
  }

  const records = blocks.map((block, i) => ({
    id: block.id,
    values: embeddings[i].values as number[],
  }));

  index.namespace("namespace").upsert(records);

  return blocks.map((block) => block.id);
}

export async function BlocksByID(blockIDs: string[]): Promise<Block[]> {
  try {
    if (blockIDs.length === 0) {
      return [];
    }

    const blockRef = await db
      .collection("blocks")
      .where(FieldPath.documentId(), "in", blockIDs)
      .orderBy("order")
      .get();

    if (blockRef.empty) {
      return [];
    }

    const blocks: Block[] = [];

    blockRef.forEach((doc) => {
      const block = doc.data();

      blocks.push({
        id: block.id,
        noteID: block.noteID,
        order: block.order,
        links: block.links,
        content: block.content,
        rawText: block.rawText,
      });
    });

    return blocks;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to BlocksByID", error.message);
  }
}

export async function GetSearchResults(query: string, numResults: number) {
  const queryEmbedding = await pc.inference.embed(model, [query], {
    inputType: "query",
  });

  const queryResponse = await index.namespace("namespace").query({
    topK: numResults,
    vector: queryEmbedding[0].values as number[],
    includeValues: false,
    includeMetadata: true,
  });

  const blockIDs: string[] = [];

  queryResponse.matches.forEach((match) => {
    blockIDs.push(match.id);
  });

  const blocks = await BlocksByID(blockIDs);

  return blocks;
}

export async function GetSummary(blockText: string[]) {
  const union = blockText.join("\nNEW NOTE\n");

  const { text } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    system: sysPrompt,
    prompt: union,
  });

  return JSON.stringify(text, null, 2);
}
