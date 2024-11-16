import fs from 'fs';

type SidebarItem = Folder | Note;

interface Folder {
	type: 'folder';
	name: string;
	items: SidebarItem[];
}

interface Note {
	type: 'note';
	name: string;
	content: string;
}

/**
 * Reads and parses the sidebar data from a JSON file.
 * @param filePath Path to the JSON file.
 * @returns Parsed SidebarItem array.
 */
export default function parseSidebarData(): SidebarItem[] {
	try {
		const rawData = fs.readFileSync('/sidebarData.json', 'utf-8');
		const data: SidebarItem[] = JSON.parse(rawData);

		if (!Array.isArray(data)) {
			throw new Error('Invalid sidebar data format: Expected an array.');
		}

		return data;
	} catch (error: any) {
		console.error('Error parsing sidebar data:', error.message);
		throw error;
	}
}
