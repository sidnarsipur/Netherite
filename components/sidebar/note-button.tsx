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

export default function NoteButton({ note }: { note: Note }) {
  return (
    <Link href={`/note/${note.id}`}>
      <FancyCard>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="p-5">
              <p className="mb-1 font-bold">{note.name}</p>
              <p className="truncate text-sm text-muted-foreground"></p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem inset>
              New Note
              <ContextMenuShortcut>⌘M</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Rename
              <ContextMenuShortcut>F2</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Delete
              <ContextMenuShortcut>Del</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </FancyCard>
    </Link>
  );
}
