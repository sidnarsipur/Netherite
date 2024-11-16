"use client";

import NoteButton from "./note-button";
import { ChevronDown, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Folder } from "@/lib/definitions";
import { useParams } from "next/navigation";
import { getPageById } from "@/lib/note-manager";
import FancyCard from "../fancy-card";
import { useState } from "react";

export default function FolderButton({ item }: { item: Folder }) {
  const { id } = useParams<{ id: string }>();
  const isOpenedPageInside = getPageById(item.items, id) !== null;
  const [isOpen, setIsOpen] = useState(isOpenedPageInside);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <FancyCard topBorderOnly={isOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2 p-5">
            <FolderIcon className="w-5" />
            <h3 className="mb-1 font-bold">{item.name}</h3>
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </div>
        </CollapsibleTrigger>
      </FancyCard>
      <CollapsibleContent className="flex flex-col gap-4 pl-5">
        {item.items.map((item, idx) =>
          item.type === "folder" ? (
            <FolderButton key={idx} item={item} />
          ) : (
            <NoteButton key={idx} item={item} />
          ),
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
