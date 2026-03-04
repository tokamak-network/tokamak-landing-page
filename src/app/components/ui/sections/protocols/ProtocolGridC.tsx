import * as React from "react";
import {
  ProtocolCardWithBadge,
  type ProtocolCardWithBadgeProps,
} from "./ProtocolCardWithBadge";

interface ProtocolGridCProps {
  readonly protocols: readonly ProtocolCardWithBadgeProps[];
}

export const ProtocolGridC: React.FC<ProtocolGridCProps> = ({ protocols }) => {
  return (
    <div className="grid grid-cols-1 [@media(min-width:641px)_and_(max-width:1023px)]:grid-cols-2 gap-4">
      {protocols.map((protocol) => (
        <ProtocolCardWithBadge key={protocol.title} {...protocol} />
      ))}
    </div>
  );
};
