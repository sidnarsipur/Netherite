import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MatchSnippet } from "./match-snippet";
import { Block } from "@/lib/util/model";

const customStyle = {
  mask: `linear-gradient(to right, 
  rgba(0, 0, 0, 0) 0%,       /* Fully transparent at the start */
  rgba(0, 0, 0, 1) 30%,      /* Fully opaque from 20% */
  rgba(0, 0, 0, 1) 70%,      /* Opaque until 80% */
  rgba(0, 0, 0, 0) 100%)     /* Fully transparent at the end */
  100% 50% / 100% 100% repeat-x`,
};

const LENGTH = 3;
export function Matches({
  blocks,
  isProcessing,
}: {
  blocks: Block[];
  isProcessing: boolean;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <div style={customStyle}>
        <CarouselContent className="h-80">
          {blocks.length > 0 && (
            <>
              <MatchSnippet />
              {blocks.map((block, idx) => (
                <MatchSnippet
                  key={idx}
                  block={block}
                  isProcessing={isProcessing}
                />
              ))}
              <MatchSnippet />
            </>
          )}
        </CarouselContent>
      </div>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
