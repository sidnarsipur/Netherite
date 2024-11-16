import { FolderPlus, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import sidebarData from "@/lib/sidebarDataParser";
import NoteButton from "./note-button";
import FolderButton from "./folder-button";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 p-8">
        <p className="text-xl font-bold">concept.ai</p>
        <div className="flex">
          <Input className="flex-1" />
          <Button size="icon" variant="ghost">
            <FolderPlus />
          </Button>
          <Button size="icon" variant="ghost">
            <Plus />
          </Button>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex flex-col gap-4 px-8 py-6">
        {sidebarData.map((item) =>
          item.type === "folder" ? (
            <FolderButton item={item} />
          ) : (
            <NoteButton item={item} />
          ),
        )}
      </SidebarContent>
    </Sidebar>
  );
}
