"use client";

import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  SquareSplitVertical,
  Save,
  Search,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { addBlocks } from "@/lib/note/noteManager";
import { UrlModal } from "../ui/UrlModal"; // Import the custom modal component

type MenuBarProps = {
  editor: Editor;
};

export function MenuBar({ editor, noteID }: { noteID: string } & MenuBarProps) {
  if (!editor) {
    return null;
  }
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const json = editor.getJSON();
    const content = JSON.stringify(json);

    addBlocks(noteID, content);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  const handleUrlSubmit = (url: string) => {
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageSubmit = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  function handleClick(arg0: () => void) {
    // throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-wrap gap-2 border-b p-2">
      <Button size="sm" variant="ghost" onClick={handleSave}>
        {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        Save
      </Button>

      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="mx-2 h-8 w-px bg-border" />

      <Button
        size="sm"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        // onClick={() => editor.chain().focus().setPageBreak().run()}
      >
        <SquareSplitVertical className="h-4 w-4" />
      </Button>

      <div className="mx-2 h-8 w-px bg-border" />

      <Button
        size="sm"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="mx-2 h-8 w-px bg-border" />

      <Button
        size="sm"
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
        }
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="mx-2 h-8 w-px bg-border" />

      <Button
        size="sm"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <Link className="h-4 w-4" />
      </Button>
      <UrlModal onSubmit={handleImageSubmit} />

      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            handleClick(() => {});
          }}
          className="text-gradient justify-start gap-2"
        >
          <Search className="h-4 w-4 text-orange-500" />
          <span>Vector Search</span>
        </Button>
      </DialogTrigger>
    </div>
  );
}
