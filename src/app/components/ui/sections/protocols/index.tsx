import * as React from "react";
import { ProtocolGrid } from "./ProtocolGrid";
import { protocolsData } from "./data";

export const Protocols: React.FC = () => {
  return <ProtocolGrid grants={protocolsData} />;
};
