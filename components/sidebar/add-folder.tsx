import { Button } from "../ui/button";
import { DialogTrigger, Dialog } from "../ui/dialog";
import { FolderPlus } from "lucide-react";
import AddFolderDialog from "./add-folder-dialog";

export default function AddFolder() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <FolderPlus />
        </Button>
      </DialogTrigger>
      <AddFolderDialog />
    </Dialog>
  );
}
