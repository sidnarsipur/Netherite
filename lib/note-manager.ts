import { v4 as uuidv4 } from "uuid";
import { Note, SidebarItem } from "./definitions";
export const notes: SidebarItem[] = [
  {
    type: "folder",
    name: "Project A",
    items: [
      {
        type: "note",
        name: "Introduction",
        content: "This is the introduction note for Project A.",
        id: "1-1",
        path: "Project A/Introduction",
      },
      {
        type: "folder",
        name: "Subfolder 1",
        items: [
          {
            type: "note",
            name: "Task 1",
            content: "Details about Task 1.",
            id: "1-2-1",
            path: "Project A/Subfolder 1/Task 1",
          },
          {
            type: "note",
            name: "Task 2",
            content: "Details about Task 2.",
            id: "1-2-2",
            path: "Project A/Subfolder 1/Task 2",
          },
        ],
      },
    ],
  },
  {
    type: "note",
    name: "General Notes",
    content: "These are general notes for the Notion clone.",
    id: "2",
    path: "General Notes",
  },
];

export function getPageById(items: SidebarItem[], id: string): Note | null {
  for (const item of items) {
    // Check if the current item matches the id

    // If it's a folder, recursively search in its items
    if (item.type === "folder" && item.items) {
      const result = getPageById(item.items, id);
      if (result) {
        return result;
      }
    } else if (item.type === "note" && item.id === id) {
      return item;
    }
  }
  // Return null if no match is found
  return null;
}
