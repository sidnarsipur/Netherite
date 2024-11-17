"use client";
import Editor from "@/components/editorReadOnly";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const id2 = params.id2 as string;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.replace(`/note/${id}`)}
        >
          <ArrowLeft />
        </Button>
        <DialogClose asChild>
          <Button variant="ghost" size="icon">
            <X />
          </Button>
        </DialogClose>
      </div>
      <Separator />
      <p className="w-full bg-transparent p-5 text-2xl font-bold focus-visible:outline-none">
        Note Name
      </p>
      <Separator />
      <Editor noteID={id2} />
    </div>
  );
}
