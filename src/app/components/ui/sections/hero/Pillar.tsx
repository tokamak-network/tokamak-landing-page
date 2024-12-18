import "./pillar.css";

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
        className="absolute 
        animate-grow-height-front origin-bottom"
        style={{
          width: "95px",
          height: "142px",
          background: "linear-gradient(to top, #FFF 0%, #E9F2FD 100%)",
          border: "1px solid #257EEE",
        }}
      />

      {/* Right face */}
      <div
        className="absolute animate-grow-height-right origin-bottom"
        style={{
          width: "95px",
          height: "142px",
          background: "linear-gradient(to top, #FFF 0%, #E9F2FD 100%)",
          border: "1px solid #257EEE",
          opacity: 0.7,
        }}
      />

      {/* Top face */}
      <div
        className="absolute animate-rise-top"
        style={{
          width: "85px",
          height: "85px",
          background: "linear-gradient(to top, #FFF 0%, #E9F2FD 100%)",
          border: "1px solid #257EEE",
          opacity: 0.85,
        }}
      />
    </div>
  );
};
