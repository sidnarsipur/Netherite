"use server";

import { db } from "@/lib/init";
import { BlocksByID, EmbedAndInsertBlocks } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";
import { Block, Folder, Note, ContentNode } from "@/lib/model";

export const createNote = async (
  userID: string,
  name: string,
  path: string,
) => {
  const noteID = uuidv4();

  const res = await db.collection("notes").add({
    noteID: noteID,
    userID: userID,
    name: name,
    path: path,
  });

  return res;
};

export const addBlocks = async (noteID: string, content: any) => {
  const blocks = parseBlocks(noteID, content);
  const block_ids = await EmbedAndInsertBlocks(blocks, noteID);

  const res = await db
    .collection("notes")
    .doc(noteID)
    .update({
      blockIDs: FieldValue.arrayUnion(...block_ids),
    });

  return res;
};

export const getJSONByNoteID = async (noteID: string): Promise<string> => {
  const note = await getNote(noteID);

  if (!note.blockIDs) {
    throw new Error("No block IDs found for this note");
  }

  const blocks: Block[] = await BlocksByID(note.blockIDs);

  const bl: any[] = [];

  blocks.forEach((block: Block) => {
    block.content.forEach((content) => {
      bl.push(JSON.parse(content));
    });
  });

  const content = {
    type: "doc",
    content: bl,
  };

  console.log("testtest", content);

  return JSON.stringify(content);
};

export const getNote = async (noteID: string) => {
  try {
    const noteSnapshot = await db.collection("notes").doc(noteID).get();

    if (!noteSnapshot.exists) {
      throw new Error("No notes found for this noteID");
    }

    const noteObj = noteSnapshot.data();
    const blocks = await BlocksByID(noteObj?.blockIDs);

    return {
      id: noteID,
      ...noteObj,
      blocks,
    } as unknown as Note;
  } catch (error) {
    console.error("Database Error:", error, noteID);
    throw new Error("Failed to fetch getNote.", error.message);
  }
};

export const getNotes = async (userID: string) => {
  const notesSnapshot = await db
    .collection("notes")
    .where("userID", "==", userID)
    .get();

  if (notesSnapshot.empty) {
    throw new Error("No notes found for this user");
  }

  const noteIDs: string[] = [];

  notesSnapshot.forEach((doc) => {
    noteIDs.push(doc.data().noteID);
  });

  return noteIDs;
};

export const getFolders = async (userID: string) => {
  const userRef = db.collection("users").doc(userID);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error("no such user!");
  }

  const foldersDoc = await userDoc.ref.collection("folders").get();
  const folders = foldersDoc.docs.map((folderDoc) => folderDoc.data());
  const folderObjs = await Promise.all(
    folders.map(async (folder) => {
      const notes = await Promise.all(
        folder.noteIDs.map((id: string) => getNote(id)),
      );
      return {
        ...folder,
        notes,
      } as Folder;
    }),
  );
  return folderObjs;
};

function parseBlocks(noteID: string, content: string): Block[] {
  const blocks: Block[] = [];
  let currentBlockContent: any[] = [];
  let order = 0;

  const node = JSON.parse(content);

  node.content.forEach((node: ContentNode) => {
    if (node.type == "pageBreak") {
      currentBlockContent.push(JSON.stringify(node));
      blocks.push({
        id: uuidv4(),
        order: order++,
        noteID: noteID,
        links: [],
        content: currentBlockContent,
        rawText: currentBlockContent
          .map((n) => n.content?.[0]?.text || "")
          .join(" "),
      });
      currentBlockContent = [];
    } else {
      currentBlockContent.push(JSON.stringify(node));
    }
  });

  blocks.push({
    id: uuidv4(),
    order: order++,
    noteID: noteID,
    links: [],
    content: currentBlockContent,
    rawText: currentBlockContent
      .map((n) => n.content?.[0]?.text || "")
      .join(" "),
  });

  return blocks;
}
