import { SidebarItem } from '@/lib/definitions';

const sidebarData: SidebarItem[] = [
	{
		type: 'folder',
		name: 'Project A',
		items: [
			{
				type: 'note',
				name: 'Introduction',
				content: 'This is the introduction note for Project A.',
			},
			{
				type: 'folder',
				name: 'Subfolder 1',
				items: [
					{
						type: 'note',
						name: 'Task 1',
						content: 'Details about Task 1.',
					},
					{
						type: 'note',
						name: 'Task 2',
						content: 'Details about Task 2.',
					},
				],
			},
		],
	},
	{
		type: 'note',
		name: 'General Notes',
		content: 'These are general notes for the Notion clone.',
	},
];

export default sidebarData;
