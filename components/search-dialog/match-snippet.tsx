"use client";
import { PlusIcon, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Separator } from "../ui/separator";
import { Block, Note } from "@/lib/util/model";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getNote } from "@/lib/note/noteManager";
import { Skeleton } from "@/components/ui/skeleton";

export function MatchSnippet({
  block,
  isProcessing,
}: {
  block?: Block;
  isProcessing?: boolean;
}) {
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
        {!isDummy && isProcessing ? (
          <div className="flex flex-col gap-6 p-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-52" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-end gap-2 p-3">
              <p className="mr-auto">{note?.name}</p>
              <p className="text-sm text-muted-foreground">
                {block?.score}% match
              </p>
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
            <Separator className="mt-auto" />
            <div className="flex w-12 items-center gap-4 px-4 pt-4 text-sm">
              <Button variant="ghost" className="h-7 w-14">
                <ThumbsUp />
                42
              </Button>
              <Button variant="ghost" className="h-7 w-14">
                <ThumbsDown />
                12
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Star />
              </Button>
            </div>
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
