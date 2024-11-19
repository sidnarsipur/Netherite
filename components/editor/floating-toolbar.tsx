import React, { useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  Heading1,
  List,
  ListOrdered,
  Image,
  Code,
  CheckSquare,
  Search,
  SquareSplitVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

type FloatingToolbarProps = {
  editor: Editor;
};

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!toolbarRef.current) return;

      const buttons = buttonsRef.current;
      const activeElement = document.activeElement as HTMLButtonElement;
      const currentIndex = buttons.indexOf(activeElement);

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % buttons.length;
          buttons[nextIndex].focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          const prevIndex =
            (currentIndex - 1 + buttons.length) % buttons.length;
          buttons[prevIndex].focus();
          break;
        case "Escape":
          editor.commands.focus();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

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
    <div
      ref={toolbarRef}
      className="flex flex-col gap-1 rounded-md border bg-background p-1 shadow-md"
    >
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
          <span>Perform Vector Search Here</span>
        </Button>
      </DialogTrigger>
      <div className="my-1 h-px w-full bg-border" />
      <Button
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
        size="sm"
        variant="ghost"
        onClick={() =>
          handleClick(() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          )
        }
        className="justify-start gap-2"
      >
        <Heading1 className="h-4 w-4" />
        <span>Heading 1</span>
      </Button>

      <Button
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
        size="sm"
        variant="ghost"
        // onClick={() =>
        //   handleClick(() => editor.chain().focus().setPageBreak().run())
        // }
        className="justify-start gap-2"
      >
        <SquareSplitVertical className="h-4 w-4" />
        <span>Page Break</span>
      </Button>

      <Button
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
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
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
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
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
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
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
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
        ref={(el) => {
          if (el) {
            buttonsRef.current.push(el);
          }
        }}
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
