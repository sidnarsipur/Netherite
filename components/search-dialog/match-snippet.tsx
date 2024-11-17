"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Separator } from "../ui/separator";
import { Block } from "@/lib/model";
import { useRouter, usePathname } from "next/navigation";

export function MatchSnippet({ block }: { block?: Block }) {
  const isDummy = !block;
  const data = block ?? dummyBlock;

  const pathname = usePathname();
  const router = useRouter();

  return (
    <CarouselItem className="basis-1/3">
      <Card className="flex h-60 flex-col bg-[#202020]">
        <div className="flex items-center justify-end gap-2 p-3">
          <p className="mr-auto">Transition Function</p>
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
        <p className="p-3 text-sm">{data.content}</p>
      </Card>
    </CarouselItem>
  );
}

const dummyBlock: Block = {
  id: "block3",
  order: 3,
  noteID: "VWrZKnSSaYImpplNqGDB",
  links: [],
  content: "<p>This is the content of block 3</p>",
  rawText: "This is the content of block 3",
};
