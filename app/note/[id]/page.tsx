"use client";

import Highlight from "@/components/search-dialog/highlight";
import { Matches } from "@/components/search-dialog/matches";
import { Querybar } from "@/components/search-dialog/querybar";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GetSearchResults } from "@/lib/dataStore";
import { HighlightStore } from "@/lib/highlightStore";
import { Block } from "@/lib/model";
import { X, BetweenHorizontalEnd, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Page() {
  const highlights = HighlightStore.useState((s) => s.highlights);
  const [blocks, setBlocks] = useState<Block[]>(
    HighlightStore.useState((s) => s.blocks),
  );
  const [query, setQuery] = useState(HighlightStore.useState((s) => s.query));
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = useDebouncedCallback(async (term) => {
    if (term === "") {
      setBlocks([]);
      return;
    }
    const blocks = await GetSearchResults(term);
    setBlocks(blocks);
    HighlightStore.update((s) => {
      s.query = term;
      s.blocks = blocks;
    });
    setIsProcessing(false);
  }, 500);

  useEffect(() => {
    setIsProcessing(true);
    handleSearch(query);
  }, [query]);

  const insertText = () => {
    const text = highlights
      .map((highlight) => highlight.description)
      .join("\n");
    HighlightStore.update((s) => {
      s.insertText = text;
    });
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between p-2">
        <Querybar value={query} onChange={(e) => setQuery(e.target.value)} />
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
        <Matches blocks={blocks} isProcessing={isProcessing} />
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
        <DialogClose asChild>
          <Button variant="outline" onClick={insertText}>
            Quote Highlights Directly
            <BetweenHorizontalEnd />
          </Button>
        </DialogClose>
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
