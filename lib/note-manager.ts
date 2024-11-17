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

  console.log("block_ids", block_ids);

  const res = await db
    .collection("notes")
    .doc(noteID)
    .update({
      blockIDs: FieldValue.arrayUnion(...block_ids),
    });

  // return res;
};

// export const getJSONByNote = async (noteID: string): Promise<string> => {
//   // const note = await getNote(noteID);
//   // const mergeContent = (content: ContentNode[]): ContentNode[] => {
//   //   return content.map((node) => {
//   //     if (node.content) {
//   //       node.content = mergeContent(node.content);
//   //     }
//   //     return node;
//   //   });
//   // };
//   // const combinedContent: ContentNode[] = note.block.flatMap((block) => {
//   //   return mergeContent(block.content);
//   // });
//   // return JSON.stringify(combinedContent, null, 2);
// };

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

function parseBlocks(noteID: string, content: any): Block[] {
  const parsedContent = JSON.parse(content);
  const blocks: Block[] = [];
  let currentBlockContent: any[] = [];
  let order = 0;

  parsedContent.content.forEach((node: any) => {
    if (node.type === "pageBreak") {
      if (currentBlockContent.length > 0) {
        blocks.push({
          id: uuidv4(),
          noteID: noteID,
          links: [],
          content: JSON.stringify(currentBlockContent),
          rawText: currentBlockContent
            .map((n) => n.content?.[0]?.text || "")
            .join(" "),
          order: order++,
        });
        currentBlockContent = [];
      }
    } else {
      currentBlockContent.push(node);
    }
  });

  if (currentBlockContent.length > 0) {
    blocks.push({
      id: uuidv4(),
      noteID: noteID,
      links: [],
      content: JSON.stringify(currentBlockContent),
      rawText: currentBlockContent
        .map((n) => n.content?.[0]?.text || "")
        .join(" "),
      order: order++,
    });
  }

  return blocks;
}
