import { FolderPlus, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { notes } from "@/lib/note-manager";
import NoteButton from "./note-button";
import FolderButton from "./folder-button";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Searchbar } from "./searchbar";

export default async function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 p-8">
        <p className="text-xl font-bold">concept.ai</p>
        <div className="flex">
          <Searchbar className="flex-1" />
          <Button size="icon" variant="ghost">
            <FolderPlus />
          </Button>
          <Button size="icon" variant="ghost">
            <Plus />
          </Button>
        </div>
      </SidebarHeader>
      <Separator className="bg-separator-gradient" />
      <SidebarContent className="flex flex-col gap-4 px-8 py-6">
        {notes.map((item, idx) =>
          item.type === "folder" ? (
            <FolderButton key={idx} item={item} />
          ) : (
            <NoteButton key={idx} item={item} />
          ),
        )}
      </SidebarContent>
    </Sidebar>
  );
}
