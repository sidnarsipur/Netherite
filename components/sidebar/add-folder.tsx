import { addFolder } from "@/lib/note-manager";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { FolderPlus } from "lucide-react";

export default function AddFolder() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <FolderPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogTitle>New Folder</DialogTitle>
        <form action={addFolder} className="flex flex-col gap-4">
          <Input id="link" placeholder="Name" name="name" />
          <DialogClose asChild>
            <Button type="submit" size="sm" className="px-3">
              Add
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
