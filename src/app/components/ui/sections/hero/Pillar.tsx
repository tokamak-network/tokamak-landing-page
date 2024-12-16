export const Pillar = () => {
  return (
    <div
      className="relative"
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateX(-19deg) rotateY(45deg)",
        width: "66px",
        height: "142px",
      }}
    >
      {/* Front face */}
      <div
        className="absolute"
        style={{
          width: "85px",
          height: "142px",
          background: "rgba(0, 120, 255, 0.2)",
          borderRight: "1px solid rgb(0, 120, 255)",
          borderBottom: "1px solid rgb(0, 120, 255)",
          transform: "rotateY(90deg) translateZ(-36px) translateX(5px)",
        }}
      />

      {/* Right face */}
      <div
        className="absolute"
        style={{
          width: "85px",
          height: "142px",
          background: "rgba(0, 120, 255, 0.1)",
          borderLeft: "1px solid rgb(0, 120, 255)",
          borderRight: "1px solid rgb(0, 120, 255)",
          borderBottom: "1px solid rgb(0, 120, 255)",
          transform: "rotateY(180deg) translateZ(-39px) translateX(-5px)",
        }}
      />

      {/* Top face */}
      <div
        className="absolute"
        style={{
          width: "85px",
          height: "85px",
          background: "rgba(0, 120, 255, 0.3)",
          border: "1px solid rgb(0, 120, 255)",
          transform: "rotateX(90deg) translateZ(45px)",
        }}
      />
    </div>
  );
};
