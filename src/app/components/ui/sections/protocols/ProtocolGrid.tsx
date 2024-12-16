import * as React from "react";
import { ProtocolsGridProps } from "./types";
import { ProtocolCard } from "./ProtocolCard";

export const ProtocolGrid: React.FC<ProtocolsGridProps> = ({ grants }) => {
  return (
    <div className="flex flex-wrap gap-16 items-start">
      {grants.map((grant, index) => (
        <ProtocolCard key={index} {...grant} />
      ))}
    </div>
  );
};
