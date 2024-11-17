// bubble-toolbar.tsx
"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Layout,
} from "lucide-react"; // Import an icon for page breaks
import { Button } from "@/components/ui/button";

type BubbleToolbarProps = {
  editor: Editor;
};

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  if (!editor) {
    return null;
  }

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
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="h-8 w-8 p-1"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="h-8 w-8 p-1"
      >
        <Heading3 className="h-4 w-4" />
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
        onClick={() => editor.chain().focus().setPageBreak().run()}
        className="h-8 w-8 p-1"
      >
        <Layout className="h-4 w-4" />
      </Button>
    </div>
  );
}
