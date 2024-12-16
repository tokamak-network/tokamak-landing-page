import * as React from "react";

interface HeroSectionProps {
  imageUrl: string;
  imageAlt: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  imageUrl,
  imageAlt,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-end px-20 pt-48 w-full bg-black pb-[464px] max-md:px-5 max-md:py-24 max-md:max-w-full">
        <img
          loading="lazy"
          src={imageUrl}
          alt={imageAlt}
          className="object-contain mb-0 max-w-full aspect-[1.76] w-[367px] max-md:mb-2.5"
        />
      </div>
    </div>
  );
};
