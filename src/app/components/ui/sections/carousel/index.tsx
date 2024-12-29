import * as React from "react";
import CarouselWrapper from "./CarouselWapper";

const Hourglass = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="110"
      viewBox="0 0 120 110"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 0H42H78H120L78 42V68L120 110H78H42H0L42 68V42L0 0Z"
        fill="white"
      />
    </svg>
  );
};

export const Carousel: React.FC = () => {
  return (
    <div
      className="w-full h-[110px] overflow-hidden flex align-baseline relative
    "
    >
      <CarouselWrapper />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 100 }}
      >
        <Hourglass />
      </div>
    </div>
  );
};
