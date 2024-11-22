"use client";

import Link from "next/link";
import FancyCard from "../fancy-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Note } from "@/lib/util/model";
import { deleteNote } from "@/lib/note/noteManager";
import { useRouter } from "next/navigation";

export default function NoteButton({ note }: { note: Note }) {
  const router = useRouter();

  const handleDelete = async () => {
    router.push("/note");
    await deleteNote(note.id);
  };
  return (
    <FancyCard>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link href={`/note/${note.id}`}>
            <div className="p-5">
              <p className="mb-1 font-bold">{note.name}</p>
              <p className="truncate text-sm text-muted-foreground"></p>
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={handleDelete}>
            Delete
            <ContextMenuShortcut>Del</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </FancyCard>
  );
}
