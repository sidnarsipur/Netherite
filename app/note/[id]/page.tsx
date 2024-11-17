import Highlight from "@/components/search-dialog/highlight";
import { Matches } from "@/components/search-dialog/matches";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GetSearchResults } from "@/lib/dataStore";
import { Block } from "@/lib/model";
import { X, BetweenHorizontalEnd, Brain } from "lucide-react";

export default async function Page() {
  // const blocks = await GetSearchResults("");
  // console.log("fsefas henrnrnr", blocks);

  return (
    <>
      <div className="flex flex-row items-center justify-between p-2">
        <Input
          className="max-w-sm"
          placeholder="help me write more about dfas"
        />
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
        <p className="p-2 font-bold">Saved Highlights</p>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_) => (
            <Highlight />
          ))}
        </div>
      </div>
      <Separator />
      <DialogFooter className="justify-end p-2">
        <Button variant="outline">
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
    noteID: "VWrZKnSSaYImpplNqGDB",
    links: ["https://example.com", "https://example.org"],
    content: ["<p>This is the content of block 1</p>"],
    rawText: "This is the content of block 1",
  },
  {
    id: "block2",
    order: 2,
    noteID: "VWrZKnSSaYImpplNqGDB",
    links: ["https://example.com/block2"],
    content: ["<p>This is the content of block 2</p>"],
    rawText: "This is the content of block 2",
  },
  {
    id: "block3",
    order: 3,
    noteID: "VWrZKnSSaYImpplNqGDB",
    links: [],
    content: ["<p>This is the content of block 3</p>"],
    rawText: "This is the content of block 3",
  },
];
