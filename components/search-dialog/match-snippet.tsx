"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Separator } from "../ui/separator";
import { Block, Note } from "@/lib/model";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getNote } from "@/lib/note-manager";

export function MatchSnippet({ block }: { block?: Block }) {
  const isDummy = !block;
  const data = block ?? dummyBlock;

  const pathname = usePathname();
  const router = useRouter();

  const [note, setNote] = useState<Note>();
  const noteID = data.noteID;

  useEffect(() => {
    if (!noteID) return;
    getNote(noteID).then((note) => {
      setNote(note);
    });
  }, [noteID]);

  return (
    <CarouselItem className="basis-1/3">
      <Card className="flex h-80 flex-col overflow-hidden bg-[#202020] pb-3">
        {!isDummy && (
          <>
            <div className="flex items-center justify-end gap-2 p-3">
              <p className="mr-auto">{note?.name}</p>
              <p className="text-sm text-muted-foreground">99.46% match</p>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => router.replace(`${pathname}/${data.noteID}`)}
              >
                <PlusIcon />
              </Button>
            </div>
            <Separator />
            <p className="overflow-hidden p-3 text-sm leading-7">
              {data.rawText}
            </p>
          </>
        )}
      </Card>
    </CarouselItem>
  );
}

const dummyBlock: Block = {
  id: "block3",
  order: 0,
  noteID: "",
  links: [],
  content: [""],
  rawText: "",
};
