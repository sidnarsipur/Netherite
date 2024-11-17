"use client";

import Highlight from "@/components/search-dialog/highlight";
import { Matches } from "@/components/search-dialog/matches";
import { Querybar } from "@/components/search-dialog/querybar";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { HighlightStore } from "@/lib/highlightStore";
import { Block } from "@/lib/model";
import { X, BetweenHorizontalEnd, Brain } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export default function Page() {
  const highlights = HighlightStore.useState((s) => s.highlights);

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    // const blocks = await GetSearchResults("");
    // console.log("fsefas henrnrnr", blocks);
  }, 500);

  const insertText = () => {
    const highlights = HighlightStore.useState((s) => s.highlights);
    const text = highlights
      .map((highlight) => highlight.description)
      .join("\n");
    HighlightStore.update((s) => {
      insertText: text;
    });
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between p-2">
        <Querybar onChange={(e) => handleSearch(e.target.value)} />
        <DialogClose asChild>
          <Button variant="ghost" size="icon">
            <X />
          </Button>
        </DialogClose>
      </div>
      <Separator />
      <div className="flex flex-col px-2">
        <p className="p-2">
          <span className="font-bold">Closest matches in context</span>{" "}
          <span className="text-gray-500">(32 results found)</span>
        </p>
        <Matches blocks={blocks} />
        <ScrollArea className="h-80">
          <p className="p-2 font-bold">Saved Highlights</p>
          <div className="flex flex-col gap-2 pb-2">
            {highlights.map((highlight, idx) => (
              <Highlight highlight={highlight} key={idx} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <Separator />
      <DialogFooter className="justify-end p-2">
        <Button variant="outline" onClick={insertText}>
          Quote Highlights Directly
          <BetweenHorizontalEnd />
        </Button>
        <Button
          variant="secondary"
          style={{
            background:
              "linear-gradient(91.7deg, #3E3850 0%, #29252B 43.5%, #322935 100%)",
          }}
        >
          Add AI Summary to Notes <Brain />
        </Button>
      </DialogFooter>
    </>
  );
}

const blocks: Block[] = [
  {
    id: "block1",
    order: 1,
    noteID: "zquIgHwPNFIxahfXfzmH",
    links: ["https://example.com", "https://example.org"],
    content: ["<p>This is the content of block 1</p>"],
    rawText: "This is the content of block 1",
  },
  {
    id: "block2",
    order: 2,
    noteID: "zquIgHwPNFIxahfXfzmH",
    links: ["https://example.com/block2"],
    content: ["<p>This is the content of block 2</p>"],
    rawText: "This is the content of block 2",
  },
  {
    id: "block3",
    order: 3,
    noteID: "zquIgHwPNFIxahfXfzmH",
    links: [],
    content: ["<p>This is the content of block 3</p>"],
    rawText: "This is the content of block 3",
  },
];
