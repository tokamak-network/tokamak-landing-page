import * as React from "react";
import { ProtocolGridC } from "./ProtocolGridC";
import { protocolsDataC } from "./data/approachC";

export const ProtocolsC: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-white text-[24px] font-[700] tracking-tight">
        Ecosystem Protocols
      </h2>
      <ProtocolGridC protocols={protocolsDataC} />
    </div>
  );
};
