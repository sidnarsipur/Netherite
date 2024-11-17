"use server";

import { db } from "@/lib/init";
import { BlocksByID, EmbedAndInsertBlocks } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";
import { Block, Folder, Note } from "@/lib/model";
import { getCurrentUser, getCurrentUserSnapshot } from "./user-manager";
import { revalidatePath } from "next/cache";

export const createNote = async (name: string, path: string) => {
  const userID = (await getCurrentUser()).id;
  const note = await db.collection("notes").add({
    userID: userID,
    name: name,
    path: `${path}${name}`,
    blockIDs: [],
  });
  console.log(note);

  // add note under the folder
  const folderCollection = await getFolderCollection();
  const folderDoc = await folderCollection.where("path", "==", path).get();
  const folderID = folderDoc.docs[0].id;
  const folderRef = folderCollection.doc(folderID);
  await folderRef.update({
    noteIDs: FieldValue.arrayUnion(note.id),
  });

  revalidatePath("/note");
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
      throw new Error(`Note with ID ${noteID} not found.`);
    }

    const noteObj = noteSnapshot.data();
    const blocks = await BlocksByID(noteObj?.blockIDs);

    return {
      id: noteID,
      ...noteObj,
      blocks,
    } as unknown as Note;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.", error.message);
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

const getFolderCollection = async () => {
  const userSnapshot = await getCurrentUserSnapshot();
  return userSnapshot.ref.collection("folders");
};

export const getFolders = async () => {
  const folderCollection = await getFolderCollection();
  const folders = (await folderCollection.get()).docs.map((folderDoc) =>
    folderDoc.data(),
  );

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

export const addFolder = async (name: string) => {
  const folderCollection = await getFolderCollection();
  await folderCollection.add({
    name: name,
    path: `${name}/`,
    noteIDs: [],
  });
  revalidatePath("/note");
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
