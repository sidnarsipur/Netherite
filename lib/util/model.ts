export type ContentNode = {
  type: string;
  content?: ContentNode[];
  attrs?: { [key: string]: any };
  marks?: { [key: string]: any };
  text?: string;
};

export interface Block {
  id: string;
  order: number;
  noteID: string;
  links: string[];
  content: string[];
  rawText: string;
  score?: number;
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
