import * as React from "react";

import { cn } from "@/lib/util/utils";
import { SearchIcon } from "lucide-react";

const Searchbar = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-full border-2 border-neutral-500 bg-transparent pl-3 text-sm ring-offset-background",
        className,
      )}
    >
      <SearchIcon className="h-[16px] w-[16px]" />
      <input
        placeholder="Search"
        {...props}
        type="search"
        ref={ref}
        className="w-full rounded-full bg-transparent p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
});
Searchbar.displayName = "Input";

export { Searchbar };
