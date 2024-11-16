export type SidebarItem = Folder | Note;

export interface Folder {
	type: 'folder';
	name: string;
	items: SidebarItem[];
}

export interface Note {
	type: 'note';
	name: string;
	content: string;
}
