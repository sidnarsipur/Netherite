import { BetweenHorizontalEnd, Brain, Copy, X } from "lucide-react";

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

export function SearchDialog() {
  return (
    <DialogContent className="flex flex-col gap-0 p-0">
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
        <Matches />
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
        <Button variant="secondary">
          Add AI Summary to Notes <Brain />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}