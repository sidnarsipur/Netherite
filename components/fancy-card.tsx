const backgroundGradient =
  "linear-gradient(101.16deg, rgba(255, 255, 255, 0.1) -15.74%, rgba(255, 255, 255, 0) 64.28%)";

const borderGradient =
  "linear-gradient(263.62deg, rgba(255, 255, 255, 0.6) 3.64%, rgba(130, 102, 255, 0.0966) 19.2%, rgba(136, 141, 178, 0.6) 71.23%, rgba(184, 188, 255, 0) 110.09%)";

export default function FancyCard({
  topBorderOnly = false,
  children,
}: {
  topBorderOnly?: boolean;
  children: React.ReactNode;
}) {
  const outerStyle = {
    [topBorderOnly ? "border-top" : "border"]: "solid 1px transparent",
    background: `linear-gradient(#000, #000) padding-box, ${borderGradient} border-box`,
  };

  return (
    <div style={outerStyle} className="rounded-lg">
      <div
        className="w-full rounded-lg p-5"
        style={{
          background: backgroundGradient,
        }}
      >
        {children}
      </div>
    </div>
  );
}
