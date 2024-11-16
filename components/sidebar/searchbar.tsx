import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

const Searchbar = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-full border border-input bg-black pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      <SearchIcon className="h-[16px] w-[16px]" />
      <input
        placeholder="Search"
        {...props}
        type="search"
        ref={ref}
        className="w-full rounded-full bg-black p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
});
Searchbar.displayName = "Input";

export { Searchbar };
