import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CarouselItem } from "../ui/carousel";
import { Separator } from "../ui/separator";

export function MatchSnippet() {
  return (
    <CarouselItem className="basis-1/3">
      <Card className="flex h-60 flex-col bg-[#202020]">
        <div className="flex items-center justify-end gap-2 p-3">
          <p className="mr-auto">Transition Function</p>
          <p className="text-sm text-muted-foreground">99.46% match</p>
          <Button variant="secondary" size="icon">
            <PlusIcon />
          </Button>
        </div>
        <Separator />
        <p className="p-3 text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti nam
          error labore explicabo. Magnam dolores porro consectetur labore
          deserunt veritatis a sequi nostrum, perspiciatis accusamus. Nemo non
          nulla laudantium sunt.
        </p>
      </Card>
    </CarouselItem>
  );
}
