"use server";

import { db, pc, model, google, sysPrompt } from "./init";
import { Block } from "@/lib/util/model";
import { FieldPath } from "firebase-admin/firestore";
import { generateText } from "ai";
import { deleteBlocks } from "./noteManager";

export async function EmbedAndInsertBlocks(blocks: Block[], noteID: string) {
  deleteBlocks(noteID);

  const blocksRef = db.collection("blocks");

  const cleanBlocks: Block[] = [];

  for (const block of blocks) {
    if (
      block.content[0] !==
        '{"type":"paragraph","attrs":{"textAlign":"left"}}' &&
      block.content.length > 0
    ) {
      cleanBlocks.push(block);
    }
  }

  if (cleanBlocks.length > 0) {
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

    const index = pc.Index("embeddings");

    const embeddings = await pc.inference.embed(
      model,
      cleanBlocks.map((cleanBlocks) => cleanBlocks.rawText),
      { inputType: "passage", truncate: "END" },
    );

    const records = cleanBlocks.map((block, i) => ({
      id: block.id,
      values: embeddings[i].values as number[],
    }));

    await index.namespace("namespace").upsert(records);
  }

  return cleanBlocks.map((block) => block.id);
}

export async function BlocksByID(
  blockIDs: string[] | null | undefined,
): Promise<Block[]> {
  try {
    if (!blockIDs || blockIDs.length === 0) {
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
    if (error instanceof Error) {
      throw new Error(`Failed to BlocksByID: ${error.message}`);
    } else {
      throw new Error("Failed to BlocksByID: Unknown error");
    }
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

export async function GetSummary(strs: string[]) {
  const union = strs.join("\nNEW NOTE\n");

  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    system: sysPrompt,
    prompt: union,
  });

  const cleanedText = text.replace(/>\n/g, "> ");

  return JSON.stringify(cleanedText, null, 2);
}
