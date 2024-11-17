"use server";

import { db, pc, model, google, sysPrompt } from "./init";
import { Block, ContentNode } from "@/lib/model";
import { FieldValue, FieldPath } from "firebase-admin/firestore";
import { generateText } from "ai";
import { hasText } from "./note-manager";

export async function EmbedAndInsertBlocks(blocks: Block[], noteID: string) {
  const firebase = require("firebase/app");
  require("firebase/firestore");

  const deletedBlockIDs: string[] = [];

  const blocksRef = db.collection("blocks");
  const snapshot = await blocksRef.where("noteID", "==", noteID).get();

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      deletedBlockIDs.push(doc.id);
    });

    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  const notesSnapshot = await db
    .collection("notes")
    .doc(noteID)
    .update({ blockIDs: null });

  const index = pc.Index("embeddings");

  const cleanBlocks: Block[] = [];

  for (const block of blocks) {
    if (
      block.content[0] !==
        '{"type":"paragraph","attrs":{"textAlign":"left"}}' &&
      hasText(block.content) &&
      block.content.length > 0
    ) {
      cleanBlocks.push(block);
    }
  }

  for (const block of cleanBlocks) {
    block.noteID = noteID;

    const ref = blocksRef.add({
      id: block.id,
      noteID: block.noteID,
      order: block.order,
      links: block.links,
      content: block.content,
      rawText: block.rawText,
    });

    block.id = (await ref).id;
  }

  const index1 = pc.Index("embeddings");

  const embeddings = await pc.inference.embed(
    model,
    cleanBlocks.map((cleanBlocks) => cleanBlocks.rawText),
    { inputType: "passage", truncate: "END" },
  );

  const records = cleanBlocks.map((block, i) => ({
    id: block.id,
    values: embeddings[i].values as number[],
  }));

  if (cleanBlocks.length > 0) {
    await index1.namespace("namespace").upsert(records);
  }

  if (deletedBlockIDs.length > 0) {
    console.log("Deleting", deletedBlockIDs);
    await index.namespace("namespace").deleteMany(deletedBlockIDs);
  }

  return cleanBlocks.map((block) => block.id);
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

export async function GetSearchResults(query: string, numResults: number = 3) {
  const queryEmbedding = await pc.inference.embed(model, [query], {
    inputType: "query",
  });

  const index = pc.Index("embeddings");

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

  console.log("Block IDs", blockIDs);

  const blocks = await BlocksByID(blockIDs);

  blocks.forEach((block, i) => {
    if (
      queryResponse.matches[i] &&
      queryResponse.matches[i].score !== undefined
    ) {
      block.score = parseFloat(
        (queryResponse.matches[i].score * 100).toFixed(2),
      );
    }
  });

  return blocks.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

export async function GetSummary(blockIDs: string[]) {
  const blocks = await BlocksByID(blockIDs);

  const blockText = blocks.map((block) => block.rawText);

  const union = blockText.join("\nNEW NOTE\n");

  const { text } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    system: sysPrompt,
    prompt: union,
  });

  console.log("Summary", text);

  return JSON.stringify(text, null, 2);
}
