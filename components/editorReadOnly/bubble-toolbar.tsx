// bubble-toolbar.tsx
"use client";

import { Editor } from "@tiptap/react";
import { useRef } from "react";
import { MessageSquareWarning, FileOutput } from "lucide-react"; // Import an icon for page breaks
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

  function handleSelectText(): void {
    throw new Error("Function not implemented.");
  }

  function handleReport(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-2 shadow-md">
      {/* Existing buttons */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleSelectText()}
        className="flex items-center gap-2 p-1"
      >
        <FileOutput className="h-4 w-4" />
        <span>Add to Highlights</span>
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleReport()}
        className="flex items-center gap-2 p-1"
      >
        <MessageSquareWarning className="h-4 w-4 text-red-500" />
        <span>Report Issue</span>
      </Button>
    </div>
  );
}
