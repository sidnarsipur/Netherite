export interface ContentNode {
  type: string;
  content?: ContentNode[]; // Recursive structure for nested content
  text?: string; // Text field for leaf nodes
}

export interface Block {
  id: string;
  noteID: string;
  links: string[];
  content: ContentNode[]; // Updated to reflect the hierarchical structure
  rawText: string;
}

export interface Note {
  id: string;
  userID: string;
  name: string;
  path: string;
  blockIDs: string[];
  block: Block[];
}

export interface Folder {
  name: string;
  path: string;
  notes: Note[];
}

export interface User {
  name: string;
  folders: Folder[];
}
