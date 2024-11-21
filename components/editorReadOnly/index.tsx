// index.tsx
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import PageBreak from "@/components/ui/page-break";
import { BubbleToolbar } from "./bubble-toolbar";
import { getJSONByNoteID } from "@/lib/note/noteManager";
import { Note } from "@/lib/util/model";

const getContent = async (noteID: string) => {
  const jsonString = await getJSONByNoteID(noteID);
  return JSON.parse(jsonString);
};

export default function Editor({
  note,
  noteID,
}: {
  noteID: string;
  note?: Note;
}) {
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
      Image.configure({
        HTMLAttributes: {
          class: "centered-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      PageBreak, // Add the PageBreak extension here
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-full min-h-[500px] px-8 py-4",
      },
    },
    editable: true, // Keep the editor editable
    onCreate: async ({ editor }) => {
      const content = await getContent(noteID);
      editor.commands.setContent(content);
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault(); // Block all keypresses
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative mx-auto flex h-full w-full flex-col">
      {editor && note && (
        <>
          <BubbleMenu editor={editor}>
            <BubbleToolbar editor={editor} title={note.name} />
          </BubbleMenu>
        </>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
