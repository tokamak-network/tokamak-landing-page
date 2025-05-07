import * as React from "react";
import { ProtocolsGridProps } from "./types";
import { ProtocolCard } from "./ProtocolCard";

export const ProtocolGrid: React.FC<ProtocolsGridProps> = ({ protocols }) => {
  return (
    <div className="w-full flex flex-col items-center ">
      <h1 className="text-[30px] font-[600] text-center text-white mb-[45px]">
        Protocols
      </h1>
      <div className="w-full max-w-[1200px] px-[25px]">
        <div className="flex flex-wrap gap-[60px] [@media(min-width:1200px)]:grid [@media(min-width:1200px)]:grid-cols-3">
          {protocols.map((protocol, index) => (
            <ProtocolCard key={index} {...protocol} />
          ))}
        </div>
      </div>
    </div>
  );
};
