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
