import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { IHighlight } from "@/lib/highlightStore";

export default function Highlight({ highlight }: { highlight: IHighlight }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-[#202020] p-4">
      <div>
        <p className="">{highlight.title}</p>
        <p className="text-sm text-gray-400">{highlight.description}</p>
      </div>
      <Button variant="destructive" size="icon">
        <Trash2 />
      </Button>
    </div>
  );
}
