import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MatchSnippet } from "./match-snippet";

const customStyle = {
  mask: `linear-gradient(to right, 
  rgba(0, 0, 0, 0) 0%,       /* Fully transparent at the start */
  rgba(0, 0, 0, 1) 30%,      /* Fully opaque from 20% */
  rgba(0, 0, 0, 1) 70%,      /* Opaque until 80% */
  rgba(0, 0, 0, 0) 100%)     /* Fully transparent at the end */
  100% 50% / 100% 100% repeat-x`,
};

const LENGTH = 5;
export function Matches() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <div style={customStyle}>
        <CarouselContent>
          {Array.from({ length: LENGTH }).map((_, idx) => {
            let maskDirection = "none";
            if (idx === 0) maskDirection = "left";
            if (idx === LENGTH - 1) maskDirection = "right";
            return <MatchSnippet key={idx} />;
          })}
        </CarouselContent>
      </div>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
