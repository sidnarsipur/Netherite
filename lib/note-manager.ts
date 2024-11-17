"use server";

import { db, pc } from "@/lib/init";
import { BlocksByID, EmbedAndInsertBlocks } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";
import { Block, Folder, Note, User } from "@/lib/model";

// export const addNote = async (userID: string, blocks: Block[]) => {
//   const noteID = uuidv4();
//   // const block_ids = await EmbedAndInsertBlocks(blocks, noteID);

//   const res = await db.collection("notes").add({
//     noteID: noteID,
//     userID: userID,
//     blockIDs: block_ids,
//   });

//   return res;
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

export const getFolders = async (userID: string) => {
  const userRef = db.collection("users").doc(userID); // Replace "users" with your collection name
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

// import { Note, SidebarItem } from "./definitions";
// export const notes: SidebarItem[] = [
//   {
//     type: "folder",
//     name: "Project A",
//     items: [
//       {
//         type: "note",
//         name: "Introduction",
//         content: "This is the introduction note for Project A.",
//         id: "1-1",
//         path: "Project A/Introduction",
//       },
//       {
//         type: "folder",
//         name: "Subfolder 1",
//         items: [
//           {
//             type: "note",
//             name: "Task 1",
//             content: "Details about Task 1.",
//             id: "1-2-1",
//             path: "Project A/Subfolder 1/Task 1",
//           },
//           {
//             type: "note",
//             name: "Task 2",
//             content: "Details about Task 2.",
//             id: "1-2-2",
//             path: "Project A/Subfolder 1/Task 2",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     type: "note",
//     name: "General Notes",
//     content: "These are general notes for the Notion clone.",
//     id: "2",
//     path: "General Notes",
//   },
// ];

// export function getPageById(items: SidebarItem[], id: string): Note | null {
//   for (const item of items) {
//     // Check if the current item matches the id

//     // If it's a folder, recursively search in its items
//     if (item.type === "folder" && item.items) {
//       const result = getPageById(item.items, id);
//       if (result) {
//         return result;
//       }
//     } else if (item.type === "note" && item.id === id) {
//       return item;
//     }
//   }
//   // Return null if no match is found
//   return null;
// }
