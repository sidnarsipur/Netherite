import { addFolder } from "@/lib/note/noteManager";
import { Button } from "../ui/button";
import { DialogContent, DialogTitle, DialogClose } from "../ui/dialog";
import { Input } from "../ui/input";

export default function AddFolderDialog() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const folderName = formData.get("name") as string;
    await addFolder(folderName);
  };

  return (
    <DialogContent className="w-80">
      <DialogTitle>New Folder</DialogTitle>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <Input id="link" placeholder="Name" name="name" />
        <DialogClose asChild>
          <Button type="submit" size="sm" className="px-3">
            Add
          </Button>
        </DialogClose>
      </form>
    </DialogContent>
  );
}
