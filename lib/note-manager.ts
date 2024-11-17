"use server";

import { db, pc } from "@/lib/init";
import { BlocksByID, EmbedAndInsertBlocks } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";
import { Block, Folder, Note, ContentNode } from "@/lib/model";
import { getCurrentUserSnapshot } from "./user-manager";
import { revalidatePath } from "next/cache";

export const addNote = async (userID: string, blocks: Block[]) => {
  const noteID = uuidv4();
  const block_ids = await EmbedAndInsertBlocks(blocks, noteID);

  const res = await db.collection("notes").add({
    noteID: noteID,
    userID: userID,
    blockIDs: block_ids,
  });

  return res;
};

export const getJSONByNote = async (noteID: string): Promise<string> => {
  const note = await getNote(noteID);

  const mergeContent = (content: ContentNode[]): ContentNode[] => {
    return content.map((node) => {
      if (node.content) {
        node.content = mergeContent(node.content);
      }
      return node;
    });
  };

  const combinedContent: ContentNode[] = note.block.flatMap((block) => {
    return mergeContent(block.content);
  });

  return JSON.stringify(combinedContent, null, 2);
};

export const getNote = async (noteID: string) => {
  try {
    const noteSnapshot = await db.collection("notes").doc(noteID).get();

    if (!noteSnapshot.exists) {
      throw new Error("No notes found for this user");
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
    throw new Error("Failed to fetch card data.");
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

export const addFolder = async (formData: FormData) => {
  const folderName = formData.get("name") as string;
  const folderCollection = await getFolderCollection();
  await folderCollection.add({
    name: folderName,
    path: `${folderName}/`,
    noteIDs: [],
  });
  revalidatePath("/note");
};
