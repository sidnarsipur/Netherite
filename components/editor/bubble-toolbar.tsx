// bubble-toolbar.tsx
"use client";

import { Editor } from "@tiptap/react";
import { useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Heading1,
  SquareSplitVertical,
  Search,
} from "lucide-react"; // Import an icon for page breaks
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

type BubbleToolbarProps = {
  editor: Editor;
};

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  if (!editor) {
    return null;
  }
  const buttonsRef = useRef<HTMLButtonElement[]>([]);
  const handleClick = (callback: () => void) => {
    // Close the bubble menu
    // TODO: we'll need to pass the selected text to the search dialog
    editor.commands.focus();
  };

  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md">
      {/* Existing buttons */}
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="h-8 w-8 p-1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        size="sm"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-1"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-1"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="h-8 w-8 p-1"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-8 w-8 p-1"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className="h-8 w-8 p-1"
      >
        <Link className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        // onClick={() => editor.chain().focus().setPageBreak().run()}
        className="h-8 w-8 p-1"
      >
        <SquareSplitVertical className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <DialogTrigger asChild>
        <Button
          ref={(el) => {
            if (el) {
              buttonsRef.current.push(el);
            }
          }}
          size="sm"
          variant="ghost"
          onClick={() => {
            handleClick(() => {});
          }}
          className="text-gradient justify-start gap-2"
        >
          <Search className="h-4 w-4 text-orange-500" />
          <span>Search</span>
        </Button>
      </DialogTrigger>
    </div>
  );
}
