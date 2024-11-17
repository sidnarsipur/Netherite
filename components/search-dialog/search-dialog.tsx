import { DialogContent } from "@/components/ui/dialog";
import FancyCard from "../fancy-card";
import { DialogTitle } from "@radix-ui/react-dialog";

export async function SearchDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DialogContent
      className="flex max-w-6xl flex-col gap-0 p-0"
      style={{
        backdropFilter: "blur(90px)",
        boxShadow: "0px 0px 50px 0px rgba(145, 135, 162, 0.30)",
      }}
    >
      <DialogTitle></DialogTitle>
      <FancyCard
        backgroundGradient="#111"
        borderGradient="linear-gradient(0deg, rgba(47, 47, 47, 0), rgba(47, 47, 47, 0)), linear-gradient(68.6deg, #41468A 26.03%, #C4B1CF 53.09%, #2C2C2C 99.99%)"
      >
        {children}
      </FancyCard>
    </DialogContent>
  );
}
