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
    <div className="w-full flex flex-col items-center">
      <h2 className="text-[30px] font-[100] text-white mb-[9px] text-center">
        Protocol <span className="font-[600]">Overview</span>
      </h2>
      <p className="text-[15px] font-[300] text-white/50 mb-[50px] text-center">
        Active development across the ecosystem
      </p>
      <div className="w-full max-w-[1200px] px-[25px]">
        <div className="flex flex-wrap gap-[60px] [@media(min-width:1200px)]:grid [@media(min-width:1200px)]:grid-cols-3">
          {protocols.map((protocol, index) => (
            <ProtocolCardWithBadge key={index} {...protocol} />
          ))}
        </div>
      </div>
    </div>
  );
};
