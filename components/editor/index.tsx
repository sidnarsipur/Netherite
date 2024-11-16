"use client";

import {
	useEditor,
	EditorContent,
	BubbleMenu,
	FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { MenuBar } from "./menu-bar";
import { FloatingToolbar } from "./floating-toolbar";
import { BubbleToolbar } from "./bubble-toolbar";

export default function Editor() {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Placeholder.configure({
				placeholder: "Start writing...",
			}),
			Typography,
			Link.configure({
				openOnClick: false,
			}),
			Image,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
		],
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-full min-h-[500px] px-8 py-4",
			},
		},
		onUpdate: ({ editor }) => {
			// Get JSON output
			const json = editor.getJSON();
			console.log(json);
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="relative min-h-[500px] w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-background">
			<MenuBar editor={editor} />

			{editor && (
				<>
					<BubbleMenu editor={editor}>
						<BubbleToolbar editor={editor} />
					</BubbleMenu>

					<FloatingMenu
						editor={editor}
						shouldShow={({ state }) => {
							const { $from } = state.selection;
							const currentLineText = $from.nodeBefore?.textContent;
							return currentLineText === "/";
						}}
					>
						<FloatingToolbar editor={editor} />
					</FloatingMenu>
				</>
			)}

			<EditorContent editor={editor} />
		</div>
	);
}
