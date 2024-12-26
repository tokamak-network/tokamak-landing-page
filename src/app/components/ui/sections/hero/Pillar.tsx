import "./pillar.css";

export const Pillar = () => {
  return (
    <div
      className="relative"
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateX(-19deg) rotateY(45deg)",
        width: "66px",
        height: "282px",
      }}
    >
      {/* Front face */}
      <div
        className="absolute animate-grow-height-front origin-bottom"
        style={{
          width: "320px",
          height: "400px",
          background: "linear-gradient(to top, #FFF 0%, #E9F2FD 100%)",
          borderRight: "1px solid #257EEE",
          borderBottom: "1px solid #257EEE",
          zIndex: 1,
        }}
      />

      {/* Right face */}
      <div
        className="absolute animate-grow-height-right origin-bottom"
        style={{
          width: "280px",
          height: "400px",
          background: "linear-gradient(to top, #FFF 0%, #E9F2FD 100%)",
          borderRight: "1px solid #257EEE",
          borderBottom: "1px solid #257EEE",
          borderLeft: "1px solid #257EEE",
          zIndex: 1,
        }}
      />

      {/* Top face */}
      <div
        className="absolute animate-rise-top"
        style={{
          width: "80px",
          height: "100px",
          background: "linear-gradient(to top, #FFF 0%, #E9F2FD 100%)",
          border: "1px solid #257EEE",
          zIndex: 2,
          // transform: "rotateX(85deg) rotateY(-5deg) ",
        }}
      />
    </div>
  );
};
