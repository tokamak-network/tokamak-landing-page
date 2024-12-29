import * as React from "react";
// import { PartnerImage } from "./PartnerImage";
import { PartnerImageProps } from "./types";
import "./partner.css";
import Partner1 from "@/assets/images/partners/1.svg";
import Partner2 from "@/assets/images/partners/2.svg";
import Partner3 from "@/assets/images/partners/3.svg";
import Partner4 from "@/assets/images/partners/4.svg";
import Partner5 from "@/assets/images/partners/5.svg";
import Partner6 from "@/assets/images/partners/6.svg";
import Partner7 from "@/assets/images/partners/7.svg";
import Partner8 from "@/assets/images/partners/8.svg";
import Partner9 from "@/assets/images/partners/9.svg";
import Partner10 from "@/assets/images/partners/10.svg";
import Partner11 from "@/assets/images/partners/11.svg";
import Partner12 from "@/assets/images/partners/12.svg";
import Partner13 from "@/assets/images/partners/13.svg";
import Partner14 from "@/assets/images/partners/14.svg";
import Partner15 from "@/assets/images/partners/15.svg";
import Partner16 from "@/assets/images/partners/16.svg";
import Partner17 from "@/assets/images/partners/17.svg";
import Partner18 from "@/assets/images/partners/18.svg";
import Partner19 from "@/assets/images/partners/19.svg";
import Partner20 from "@/assets/images/partners/20.svg";
import Partner21 from "@/assets/images/partners/21.svg";
import Partner22 from "@/assets/images/partners/22.svg";

const partnerImages: PartnerImageProps[] = [
  {
    src: Partner1,
    alt: "100&100",
  },
  {
    src: Partner2,
    alt: "BLOCOORE",
  },
  {
    src: Partner3,
    alt: "Alphain",
  },
  {
    src: Partner4,
    alt: "Skytale",
  },
  {
    src: Partner5,
    alt: "Onther",
  },
  {
    src: Partner6,
    alt: "Ethereum",
  },
  {
    src: Partner7,
    alt: "Maker",
  },
  {
    src: Partner8,
    alt: "Polygon",
  },
  {
    src: Partner9,
    alt: "Meter",
  },
  {
    src: Partner10,
    alt: "DSRV",
  },
  {
    src: Partner11,
    alt: "Bounce",
  },
  {
    src: Partner12,
    alt: "Paycoin",
  },
  {
    src: Partner13,
    alt: "Bifrost",
  },
  {
    src: Partner14,
    alt: "Korea Digital",
  },
  {
    src: Partner15,
    alt: "Dcent",
  },
  {
    src: Partner16,
    alt: "Ozys",
  },
  {
    src: Partner17,
    alt: "Panony",
  },

  {
    src: Partner18,
    alt: "Staked",
  },
  {
    src: Partner19,
    alt: "Chainlink",
  },
  {
    src: Partner20,
    alt: "Decipher",
  },
  {
    src: Partner21,
    alt: "DeSpread",
  },
  {
    src: Partner22,
    alt: "Ciphers",
  },
];

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

export const Partners: React.FC = () => {
  return (
    <div
      className="w-full h-[110px] overflow-hidden flex align-baseline relative
    "
    >
      <div className="flex gap-10 items-center animate-marquee [&:has(img:hover)]:[animation-play-state:paused]"></div>

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 100 }}
      >
        <Hourglass />
      </div>
    </div>
  );
};
