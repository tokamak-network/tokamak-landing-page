import * as React from "react";
import { PartnerImageProps } from "./types";
import Image from "next/image";

export const PartnerImage: React.FC<PartnerImageProps> = ({ src }) => {
  return (
    <Image
      src={src}
      alt=""
      priority
      className={`object-contain shrink-0 self-stretch my-auto
        opacity-75 hover:opacity-100 transition-opacity cursor-pointer
        `}
    />
  );
};
