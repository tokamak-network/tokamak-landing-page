import * as React from "react";
import { ProtocolsGridProps } from "./types";
import { ProtocolCard } from "./ProtocolCard";

export const ProtocolGrid: React.FC<ProtocolsGridProps> = ({ protocols }) => {
  return (
    <div className="w-full flex flex-col items-center ">
      <h1 className="text-[30px] font-bold text-center text-white mb-[45px]">
        Protocols
      </h1>
      <div className="w-[1200px] grid grid-cols-3 gap-[60px]">
        {protocols.map((protocol, index) => (
          <ProtocolCard key={index} {...protocol} />
        ))}
      </div>
    </div>
  );
};
