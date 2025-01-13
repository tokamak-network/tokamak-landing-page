"use client";

import Image from "next/image";
import { PartnerItem } from "./types";

import OneHundred from "@/assets/partners/name=100n100, Hover=off.svg";
import AlphainVentures from "@/assets/partners/name=Alphain Ventures, Hover=off.svg";
import BifROST from "@/assets/partners/name=BIFROST, Hover=off.svg";
import BLOCORE from "@/assets/partners/name=BLOCORE, Hover=off.svg";
import Bounce from "@/assets/partners/name=Bounce, Hover=off.svg";
import Chainlink from "@/assets/partners/name=chainlink, Hover=off.svg";
import Ciphers from "@/assets/partners/name=ciphers, Hover=off.svg";
import Dcent from "@/assets/partners/name=dcent, Hover=off.svg";
import Decipher from "@/assets/partners/name=decipher, Hover=off.svg";
import Despread from "@/assets/partners/name=despread, Hover=off.svg";
import DSRV from "@/assets/partners/name=DSRV, Hover=off.svg";
import Efg from "@/assets/partners/name=efg, Hover=off.svg";
import Kdac from "@/assets/partners/name=kdac, Hover=off.svg";
import METER from "@/assets/partners/name=METER, Hover=off.svg";
import Onther from "@/assets/partners/name=Onther, Hover=off.svg";
import Ozys from "@/assets/partners/name=ozys, Hover=off.svg";
import Panony from "@/assets/partners/name=panony, Hover=off.svg";
import Paycoin from "@/assets/partners/name=paycoin, Hover=off.svg";
import Polygon from "@/assets/partners/name=Polygon, Hover=off.svg";
import SKY from "@/assets/partners/name=SKY, Hover=off.svg";
import SkytaleCapital from "@/assets/partners/name=Skytale Capital, Hover=off.svg";
import Staked from "@/assets/partners/name=Staked, Hover=off.svg";
import OneHundredHover from "@/assets/partners/name=100n100, Hover=on.svg";
import BLOCOREHover from "@/assets/partners/name=BLOCORE, Hover=on.svg";
import AlphainVenturesHover from "@/assets/partners/name=Alphain Ventures, Hover=on.svg";
import ChainlinkHover from "@/assets/partners/name=chainlink, Hover=on.svg";
import BifROSTHover from "@/assets/partners/name=BIFROST, Hover=on.svg";
import BounceHover from "@/assets/partners/name=Bounce, Hover=on.svg";
import CiphersHover from "@/assets/partners/name=ciphers, Hover=on.svg";
import DcentHover from "@/assets/partners/name=dcent, Hover=on.svg";
import DecipherHover from "@/assets/partners/name=decipher, Hover=on.svg";
import DespreadHover from "@/assets/partners/name=despread, Hover=on.svg";
import DSRVHover from "@/assets/partners/name=DSRV, Hover=on.svg";
import EfgHover from "@/assets/partners/name=efg, Hover=on.svg";
import KdacHover from "@/assets/partners/name=kdac, Hover=on.svg";
import METERHover from "@/assets/partners/name=METER, Hover=on.svg";
import OntherHover from "@/assets/partners/name=Onther, Hover=on.svg";
import OzysHover from "@/assets/partners/name=ozys, Hover=on.svg";
import PanonyHover from "@/assets/partners/name=panony, Hover=on.svg";
import PaycoinHover from "@/assets/partners/name=paycoin, Hover=on.svg";
import PolygonHover from "@/assets/partners/name=Polygon, Hover=on.svg";
import SKYHover from "@/assets/partners/name=SKY, Hover=on.svg";
import StakedHover from "@/assets/partners/name=Staked, Hover=on.svg";
import SkytaleCapitalHover from "@/assets/partners/name=Skytale Capital, Hover=on.svg";
import { useState } from "react";

const backedPartners: PartnerItem[] = [
  {
    name: "100n100",
    logo: OneHundred,
    hoverLogo: OneHundredHover,
    link: "http://100and100capital.com",
  },
  {
    name: "BLOCORE",
    logo: BLOCORE,
    hoverLogo: BLOCOREHover,
    link: "https://www.blocore.com",
  },
  {
    name: "Alphain Ventures",
    logo: AlphainVentures,
    hoverLogo: AlphainVenturesHover,
  },
  {
    name: "Skytale Capital",
    logo: SkytaleCapital,
    hoverLogo: SkytaleCapitalHover,
  },
];

const partners: PartnerItem[] = [
  {
    name: "EFG",
    logo: Efg,
    hoverLogo: EfgHover,
    link: "https://medium.com/tokamak-network/vitalik-buterins-big-announcements-about-plasma-evm-tokamak-network-636dc11ea257",
  },
  {
    name: "SKY",
    logo: SKY,
    hoverLogo: SKYHover,
    link: "https://sky.money",
  },
  {
    name: "Polygon",
    logo: Polygon,
    hoverLogo: PolygonHover,
    link: "https://polygon.technology",
  },
  {
    name: "METER",
    logo: METER,
    hoverLogo: METERHover,
    link: "https://meter.io",
  },
  {
    name: "DSRV",
    logo: DSRV,
    hoverLogo: DSRVHover,
    link: "https://www.dsrvlabs.com",
  },
  {
    name: "Bounce",
    logo: Bounce,
    hoverLogo: BounceHover,
    link: "https://bounce.finance",
  },
  {
    name: "Paycoin",
    logo: Paycoin,
    hoverLogo: PaycoinHover,
    link: "https://payprotocol.io",
  },
  {
    name: "BifROST",
    logo: BifROST,
    hoverLogo: BifROSTHover,
    link: "https://thebifrost.io",
  },
  {
    name: "KDAC",
    logo: Kdac,
    hoverLogo: KdacHover,
    link: "https://www.kdac.io/",
  },
  {
    name: "D'CENT",
    logo: Dcent,
    hoverLogo: DcentHover,
    link: "https://dcentwallet.com",
  },
  {
    name: "Ozys",
    logo: Ozys,
    hoverLogo: OzysHover,
    link: "https://orbitchain.io",
  },
  {
    name: "Panony",
    logo: Panony,
    hoverLogo: PanonyHover,
    link: "https://www.panony.com",
  },
  {
    name: "Staked",
    logo: Staked,
    hoverLogo: StakedHover,
    link: "https://staked.us",
  },
  {
    name: "Chainlink",
    logo: Chainlink,
    hoverLogo: ChainlinkHover,
    link: "https://chain.link",
  },
  {
    name: "Despread",
    logo: Despread,
    hoverLogo: DespreadHover,
    link: "https://www.despread.io",
  },
  {
    name: "Onther",
    logo: Onther,
    hoverLogo: OntherHover,
    link: "https://onther.io",
  },
  {
    name: "Decipher",
    logo: Decipher,
    hoverLogo: DecipherHover,
    link: "https://medium.com/decipher-media",
  },
  {
    name: "Ciphers",
    logo: Ciphers,
    hoverLogo: CiphersHover,
  },
];

const GridWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-y-[30px] px-[15px]">
      <h1 className="text-tokamak-black text-[21px] leading-[22px] text-center 550px:text-left">
        {title}
      </h1>
      <div className="w-full max-w-[995px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[25px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PartnersGrid() {
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-y-[90px]">
      <GridWrapper title="Partners & Grants">
        {partners.map((partner, index) =>
          partner.link ? (
            <a
              key={index}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center border border-[#DEDEDE]
              w-[160px] h-[70px]
              550px:w-[230px] 550px:h-[100px]"
              onMouseEnter={() => setHoveredPartner(partner.name)}
              onMouseLeave={() => setHoveredPartner(null)}
            >
              <Image
                src={
                  hoveredPartner === partner.name
                    ? partner.hoverLogo
                    : partner.logo
                }
                alt={partner.name}
                className="object-contain"
              />
            </a>
          ) : (
            <div
              key={index}
              className="flex items-center justify-center border border-[#DEDEDE]
              w-[160px] h-[70px]
              550px:w-[230px] 550px:h-[100px]"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                className="object-contain"
              />
            </div>
          )
        )}
      </GridWrapper>
      <GridWrapper title="Backed by">
        {backedPartners.map((partner, index) => (
          <a
            key={index}
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center border border-[#DEDEDE]
            w-[160px] h-[70px]
            550px:w-[230px] 550px:h-[100px]"
            onMouseEnter={() => setHoveredPartner(partner.name)}
            onMouseLeave={() => setHoveredPartner(null)}
          >
            <Image
              src={
                hoveredPartner === partner.name
                  ? partner.hoverLogo
                  : partner.logo
              }
              alt={partner.name}
              className="object-contain"
            />
          </a>
        ))}
      </GridWrapper>
    </div>
  );
}
