import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function Highlight() {
  return (
    <div className="flex items-center justify-between rounded-md bg-[#202020] p-4">
      <div>
        <p className="">Transition Function</p>
        <p className="text-sm text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nemo,
          consequuntur elige
        </p>
      </div>
      <Button variant="destructive" size="icon">
        <Trash2 />
      </Button>
    </div>
  );
}
