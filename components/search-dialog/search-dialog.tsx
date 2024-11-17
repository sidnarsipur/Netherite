import { BetweenHorizontalEnd, Brain, Copy, Fan, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Matches } from "./matches";
import Highlight from "./highlight";
import FancyCard from "../fancy-card";
import { GetSearchResults } from "@/lib/dataStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Block } from "@/lib/model";

export async function SearchDialog() {
  // const blocks = await GetSearchResults("dfa");

  return (
    <DialogContent
      className="flex max-w-6xl flex-col gap-0 p-0"
      style={{
        backdropFilter: "blur(90px)",
        boxShadow: "0px 0px 50px 0px rgba(145, 135, 162, 0.30)",
      }}
    >
      <DialogTitle></DialogTitle>
      <FancyCard
        backgroundGradient="#111"
        borderGradient="linear-gradient(0deg, rgba(47, 47, 47, 0), rgba(47, 47, 47, 0)), linear-gradient(68.6deg, #41468A 26.03%, #C4B1CF 53.09%, #2C2C2C 99.99%)"
      >
        <div className="flex flex-row items-center justify-between">
          <Input
            className="m-2 max-w-sm"
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
      </FancyCard>
    </DialogContent>
  );
}

const blocks: Block[] = [
  {
    id: "block1",
    order: 1,
    noteID: "note1",
    links: ["https://example.com", "https://example.org"],
    content: "<p>This is the content of block 1</p>",
    rawText: "This is the content of block 1",
  },
  {
    id: "block2",
    order: 2,
    noteID: "note1",
    links: ["https://example.com/block2"],
    content: "<p>This is the content of block 2</p>",
    rawText: "This is the content of block 2",
  },
  {
    id: "block3",
    order: 3,
    noteID: "note2",
    links: [],
    content: "<p>This is the content of block 3</p>",
    rawText: "This is the content of block 3",
  },
];
