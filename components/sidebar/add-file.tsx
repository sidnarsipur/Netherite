import { Button } from "../ui/button";
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";

export default function AddFile() {
  return (
    <Dialog>
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
            Add
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
