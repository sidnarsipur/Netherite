import { createNote } from "@/lib/note/noteManager";
import { Button } from "../ui/button";
import { DialogContent, DialogTitle, DialogClose } from "../ui/dialog";
import { Input } from "../ui/input";

export default function AddFileDialog({ path }: { path: string }) {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    await createNote(name, path);
  };

  return (
    <DialogContent className="w-80">
      <DialogTitle>New Note</DialogTitle>
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
