export interface ContentNode {
    type: string;
    content?: ContentNode[];
    text?: string;
}

export interface Block {
    blockID: string;
    noteID: string;
    links: string[];
    content: ContentNode[];
    rawText: string;
}

export interface Note {
    noteID: string;
    userID: string;
    blockIDs: string[];
}