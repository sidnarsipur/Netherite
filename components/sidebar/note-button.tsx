import { Note } from "@/lib/model";
import Link from "next/link";
import FancyCard from "../fancy-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";

export default function NoteButton({ item }: { item: Note }) {
  return (
    <Link href={`/note/${item.id}`}>
      <FancyCard>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="p-5">
              <p className="mb-1 font-bold">{item.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consec
              </p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem inset>
              New File
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
