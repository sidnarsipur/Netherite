// index.tsx
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
import PageBreak from "@/components/ui/page-break";
import { MenuBar } from "./menu-bar";
import { FloatingToolbar } from "./floating-toolbar";
import { BubbleToolbar } from "./bubble-toolbar";
import { get } from "http";
import { getJSONByNoteID } from "@/lib/note-manager";

const getContent = async (noteID: string) => {
  const jsonString = await getJSONByNoteID(noteID);
  console.log(jsonString);
  return JSON.parse(jsonString);
};

export default function Editor({ noteID }: { noteID: string }) {
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
      PageBreak, // Add the PageBreak extension here
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-full min-h-[500px] px-8 py-4",
      },
    },
    onCreate: async ({ editor }) => {
      const noteID = "eGNKGRIuIeNNUp3fv1MJ";
      getContent(noteID);
      const content = await getContent(noteID);
      editor.commands.setContent(content);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative mx-auto flex h-full w-full flex-col rounded-lg border bg-background shadow-sm">
      <MenuBar editor={editor} noteID={noteID} />

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
            tippyOptions={{
              interactive: true,
              placement: "bottom-start",
              appendTo: () => document.body,
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
