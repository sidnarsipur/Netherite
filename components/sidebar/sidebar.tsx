import { Copy, FolderPlus, Plus } from "lucide-react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import Logo from "../Logo";

export default async function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 p-8">
        <div className="flex items-center gap-3">
          <p className="text-3xl font-medium">netherite</p>
          <Logo />
        </div>
        <div className="flex">
          <Searchbar className="mr-3 flex-1" />
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <FolderPlus />
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-80">
              <DialogTitle>New File</DialogTitle>
              <Input id="link" placeholder="Name" />
              <DialogClose asChild>
                <Button type="submit" size="sm" className="px-3">
                  Save
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
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
