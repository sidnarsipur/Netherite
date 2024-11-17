import NoteButton from "./note-button";
import { ChevronDown, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Folder } from "@/lib/model";
import FancyCard from "../fancy-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";

export default function FolderButton({ item }: { item: Folder }) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <FancyCard isFolder>
        <ContextMenu>
          <ContextMenuTrigger>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 p-5">
                <FolderIcon className="w-5" />
                <p className="mb-1 font-bold">{item.name}</p>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </div>
            </CollapsibleTrigger>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem inset>
              New File
              <ContextMenuShortcut>⌘M</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              New Folder
              <ContextMenuShortcut>⌘N</ContextMenuShortcut>
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
      <CollapsibleContent className="flex flex-col gap-4 pl-5">
        {item.notes.map((note, idx) => (
          <NoteButton key={idx} note={note} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
