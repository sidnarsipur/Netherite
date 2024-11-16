"use client";

import { Editor } from "@tiptap/react";
import {
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Image,
	Code,
	CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type FloatingToolbarProps = {
	editor: Editor;
};

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
	if (!editor) {
		return null;
	}

	const handleClick = (callback: () => void) => {
		// Remove the "/" character before applying the command
		editor.commands.deleteRange({
			from: editor.state.selection.$from.pos - 1,
			to: editor.state.selection.$from.pos,
		});
		callback();
	};

	return (
		<div className="flex flex-col gap-1 rounded-md border bg-background p-1 shadow-md">
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					)
				}
				className="justify-start gap-2"
			>
				<Heading1 className="h-4 w-4" />
				<span>Heading 1</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					)
				}
				className="justify-start gap-2"
			>
				<Heading2 className="h-4 w-4" />
				<span>Heading 2</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					)
				}
				className="justify-start gap-2"
			>
				<Heading3 className="h-4 w-4" />
				<span>Heading 3</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() => editor.chain().focus().toggleBulletList().run())
				}
				className="justify-start gap-2"
			>
				<List className="h-4 w-4" />
				<span>Bullet List</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() => editor.chain().focus().toggleOrderedList().run())
				}
				className="justify-start gap-2"
			>
				<ListOrdered className="h-4 w-4" />
				<span>Numbered List</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() => editor.chain().focus().toggleTaskList().run())
				}
				className="justify-start gap-2"
			>
				<CheckSquare className="h-4 w-4" />
				<span>Task List</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() =>
					handleClick(() => editor.chain().focus().toggleCodeBlock().run())
				}
				className="justify-start gap-2"
			>
				<Code className="h-4 w-4" />
				<span>Code Block</span>
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() => {
					handleClick(() => {
						const url = window.prompt("Enter image URL");
						if (url) {
							editor.chain().focus().setImage({ src: url }).run();
						}
					});
				}}
				className="justify-start gap-2"
			>
				<Image className="h-4 w-4" />
				<span>Image</span>
			</Button>
		</div>
	);
}
