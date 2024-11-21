import * as React from "react";

import { cn } from "@/lib/util/utils";
import { CornerDownLeft } from "lucide-react";

const Querybar = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-10 w-80 items-center rounded-md border border-input bg-background pr-3",
        className,
      )}
    >
      <input
        placeholder="Search"
        {...props}
        type="search"
        ref={ref}
        className="flex-1 bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      <CornerDownLeft className="h-[16px] w-[16px]" />
    </div>
  );
});
Querybar.displayName = "Input";

export { Querybar };
