export interface ContentNode {
  type: string;
  content?: ContentNode[];
  text?: string;
}

export interface Block {
  id: string;
  order: number;
  noteID: string;
  links: string[];
  content: string[];
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
  id: string;
  name: string;
  email: string;
  folders: Folder[];
}
