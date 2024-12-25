import * as React from "react";
import { ProtocolGrid } from "./ProtocolGrid";
import { protocolsData } from "./data";

export const Protocols: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center pt-[60px] pb-[90px]">
      <ProtocolGrid protocols={protocolsData} />
    </div>
  );
};
