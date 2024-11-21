import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { IHighlight } from "@/lib/note/highlightStore";

export default function Highlight({ highlight }: { highlight: IHighlight }) {
  return (
    <div className="mx-2 flex flex-col gap-4 rounded-md bg-[#202020] p-4">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="font-semibold">{highlight.title}</p>
        <Button variant="destructive" size="icon" className="shrink-0">
          <Trash2 />
        </Button>
      </div>
      <p className="text-sm text-gray-400">{highlight.description}</p>
    </div>
  );
}
