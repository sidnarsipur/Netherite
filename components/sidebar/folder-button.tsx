import NoteButton from "./note-button";
import { ChevronDown, Folder as FolderIcon, FolderClosed } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Folder } from "@/lib/definitions";

export default function FolderButton({ item }: { item: Folder }) {
  return (
    <Collapsible className="group/collapsible rounded-lg border border-gray-500 bg-button text-left">
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2 p-5">
          <FolderIcon />
          <h3 className="mb-1 font-bold">{item.name}</h3>
          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-4 pl-5">
        {item.items.map((item) =>
          item.type === "folder" ? (
            <FolderButton item={item} />
          ) : (
            <NoteButton item={item} />
          ),
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
