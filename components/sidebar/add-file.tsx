import { Button } from "../ui/button";
import { DialogTrigger, Dialog } from "../ui/dialog";
import { Plus } from "lucide-react";
import AddFileDialog from "./add-file-dialog";

export default function AddFile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Plus />
        </Button>
      </DialogTrigger>
      <AddFileDialog path="/" />
    </Dialog>
  );
}
