import * as React from "react";
import { ProtocolsGridProps } from "./types";
import { ProtocolCard } from "./ProtocolCard";

export const ProtocolGrid: React.FC<ProtocolsGridProps> = ({ protocols }) => {
  return (
    <div className="flex flex-wrap gap-16 items-start">
      {protocols.map((protocol, index) => (
        <ProtocolCard key={index} {...protocol} />
      ))}
    </div>
  );
};
