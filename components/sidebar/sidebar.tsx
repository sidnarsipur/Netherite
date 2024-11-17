import { Copy, FolderPlus, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getFolders } from "@/lib/note-manager";
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
import { NavUser } from "./nav-user";

export default async function AppSidebar() {
  const folders = await getFolders("yS6XFCpOnwEKEUdsiNnC");
  console.log(folders);
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 p-6">
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
      <SidebarContent className="flex flex-col gap-4 p-6">
        {/* {folders.map((item, idx) =>
          item.type === "folder" ? (
            <FolderButton key={idx} item={item} />
          ) : (
            <NoteButton key={idx} item={item} />
          ),
        )} */}
        {folders.map((item, idx) => (
          <FolderButton key={idx} item={item} />
        ))}
      </SidebarContent>
      <Separator className="bg-separator-gradient" />
      <SidebarFooter>
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/evil-rabbit.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
