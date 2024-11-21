// bubble-toolbar.tsx
"use client";

import { Editor } from "@tiptap/react";
import { useRef } from "react";
import { MessageSquareWarning, FileOutput } from "lucide-react"; // Import an icon for page breaks
import { Button } from "@/components/ui/button";
import { HighlightStore } from "@/lib/note/highlightStore";
import { useParams, useRouter } from "next/navigation";

type BubbleToolbarProps = {
  editor: Editor;
};

export function BubbleToolbar({
  editor,
  title,
}: { title: string } & BubbleToolbarProps) {
  if (!editor) {
    return null;
  }
  const buttonsRef = useRef<HTMLButtonElement[]>([]);
  const handleClick = (_: () => void) => {
    editor.commands.focus();
  };

  const getSelectedText = () => {
    const { from, to, empty } = editor.state.selection;
    if (empty) return null;
    return editor.state.doc.textBetween(from, to, " ");
  };

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  function handleSelectText(): void {
    const selectedText = getSelectedText();
    if (!selectedText) return;
    HighlightStore.update((s) => {
      s.highlights.push({
        title,
        description: selectedText,
        id: 0,
      });
    });

    router.replace(`/note/${id}`);
  }

  function handleReport(): void {
    // throw new Error("Function not implemented.");
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
