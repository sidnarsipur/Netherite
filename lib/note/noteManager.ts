"use server";

import { db, pc } from "@/lib/note/init";
import { BlocksByID, EmbedAndInsertBlocks } from "@/lib/note/dataStore";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";
import { Block, Folder, Note, ContentNode } from "@/lib/util/model";
import { getCurrentUser, getCurrentUserSnapshot } from "../user/userManager";
import { revalidatePath } from "next/cache";

export const createNote = async (name: string, path: string) => {
  const userID = (await getCurrentUser()).id;
  const note = await db.collection("notes").add({
    userID: userID,
    name: name,
    path: `${path}${name}`,
    blockIDs: [],
  });

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

export const updateNote = async (note: Note, name: string) => {
  const segments = note.path.split("/");
  segments[segments.length - 1] = name;

  const newPath = segments.join("/");

  await db.collection("notes").doc(note.id).update({
    name: name,
    path: newPath,
  });
  revalidatePath("/note");
};

export const addBlocks = async (noteID: string, content: any) => {
  const blocks = parseBlocks(noteID, content);
  const block_ids = await EmbedAndInsertBlocks(blocks, noteID);

  if (block_ids.length > 0) {
    await db
      .collection("notes")
      .doc(noteID)
      .update({
        blockIDs: FieldValue.arrayUnion(...block_ids),
      });
  }
};

export const deleteNote = async (noteID: string) => {
  const note = await getNote(noteID);

  if (!note) {
    throw new Error(`Note with ID ${noteID} not found.`);
  }

  await deleteBlocks(noteID);

  const folderCollection = await getFolderCollection();
  // Check if noteID is in folder's noteIDs array
  const folderDoc = await folderCollection
    .where("noteIDs", "array-contains", noteID)
    .get();

  const folderID = folderDoc.docs[0].id;
  const folderRef = folderCollection.doc(folderID);
  await folderRef.update({
    noteIDs: FieldValue.arrayRemove(noteID),
  });

  await db.collection("notes").doc(noteID).delete();
  revalidatePath("/note");
};

//Delete all blocks associated with a note from Firestore and the vector index
export const deleteBlocks = async (noteID: string) => {
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

  await db.collection("notes").doc(noteID).update({ blockIDs: null });

  const index = pc.Index("embeddings");

  if (deletedBlockIDs.length > 0) {
    await index.namespace("namespace").deleteMany(deletedBlockIDs);
  }

  return deletedBlockIDs;
};

export const getJSONByNoteID = async (noteID: string): Promise<string> => {
  const note = await getNote(noteID);
  if (!note) {
    throw new Error(`Note with ID ${noteID} not found.`);
  }

  const blocks: Block[] = await BlocksByID(note.blockIDs);

  const bl: Block[] = [];

  blocks.forEach((block: Block) => {
    block.content.forEach((content) => {
      bl.push(JSON.parse(content));
    });
  });

  const content = {
    type: "doc",
    content: bl,
  };

  return JSON.stringify(content);
};

export const getJSONByBlockID = async (blockID: string): Promise<string> => {
  const block = await db.collection("blocks").doc(blockID).get();

  if (!block.exists) {
    throw new Error(`Block with ID ${blockID} not found.`);
  }

  const blockData = block.data();

  const content = {
    type: "doc",
    content: JSON.parse(blockData?.content),
  };

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
  } catch (error: any) {
    console.error("Database Error:", error);
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

  if (!userSnapshot) {
    throw new Error("No user found");
  }

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

  node.content.forEach((node: any) => {
    if (node.type == "pageBreak") {
      currentBlockContent.push(node);
      blocks.push({
        id: uuidv4(),
        order: order++,
        noteID: noteID,
        links: [],
        content: currentBlockContent.map((n) => JSON.stringify(n)),
        rawText: currentBlockContent.map((n) => extractText(n)).join("\n"),
      });
      currentBlockContent = [];
    } else {
      currentBlockContent.push(node);
    }
  });

  blocks.push({
    id: uuidv4(),
    order: order++,
    noteID: noteID,
    links: [],
    content: currentBlockContent.map((n) => JSON.stringify(n)),
    rawText: currentBlockContent.map((n) => extractText(n)).join("\n"),
  });

  return blocks;
}

function extractText(node: ContentNode): string {
  let texts: string = "";

  if (node.type === "text" && node.text) {
    texts += node?.text;
  }

  if (node.content) {
    for (const child of node.content) {
      texts += extractText(child) + " ";
    }
  }

  return texts.trim();
}
