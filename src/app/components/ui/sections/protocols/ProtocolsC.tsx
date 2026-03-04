import * as React from "react";
import { ProtocolGridC } from "./ProtocolGridC";
import { protocolsDataC } from "./data/approachC";

export const ProtocolsC: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center pt-[60px] pb-[90px]">
      <ProtocolGridC protocols={protocolsDataC} />
    </div>
  );
};
