import { cn } from "@/lib/utils";

const backgroundGradient =
  "linear-gradient(101.16deg, rgba(255, 255, 255, 0.1) -15.74%, rgba(255, 255, 255, 0) 64.28%)";

export default function FancyCard({
  topBorderOnly = false,
  borderGradient = "linear-gradient(263.62deg, rgba(255, 255, 255, 0.6) 3.64%, rgba(130, 102, 255, 0.0966) 19.2%, rgba(136, 141, 178, 0.6) 71.23%, rgba(184, 188, 255, 0) 110.09%)",
  backgroundGradient = "linear-gradient(101.16deg, rgba(255, 255, 255, 0.1) -15.74%, rgba(255, 255, 255, 0) 64.28%)",
  children,
  className,
  ...props
}: {
  topBorderOnly?: boolean;
  borderGradient?: string;
  backgroundGradient?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const outerStyle = {
    [topBorderOnly ? "border-top" : "border"]: "solid 1px transparent",
    background: `linear-gradient(#000, #000) padding-box, ${borderGradient} border-box`,
  };

  return (
    <div style={outerStyle} className={cn("rounded-lg", className)} {...props}>
      <div
        className="w-full rounded-lg"
        style={{
          background: backgroundGradient,
        }}
      >
        {children}
      </div>
    </div>
  );
}
