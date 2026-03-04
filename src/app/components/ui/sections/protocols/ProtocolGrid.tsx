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
        <div className="grid grid-cols-1 [@media(min-width:768px)]:grid-cols-2 [@media(min-width:1200px)]:grid-cols-3 gap-[60px]">
          {protocols.map((protocol) => (
            <ProtocolCard key={protocol.title} {...protocol} />
          ))}
        </div>
      </div>
    </div>
  );
};
