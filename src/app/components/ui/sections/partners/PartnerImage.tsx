import * as React from "react";
import { PartnerImageProps } from "./types";

export const PartnerImage: React.FC<PartnerImageProps> = ({
  src,
  width,
  aspectRatio,
}) => {
  return (
    <img
      loading="lazy"
      src={src}
      alt=""
      className={`object-contain shrink-0 self-stretch my-auto ${aspectRatio} ${width} `}
    />
  );
};
