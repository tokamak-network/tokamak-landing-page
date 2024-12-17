import { ProtocolCardProps } from "../types";
import infrastructureIcon from "@/assets/icons/protocols/1.svg";
import applicationL2Icon from "@/assets/icons/protocols/2.svg";
import zkEvmIcon from "@/assets/icons/protocols/3.svg";
import blobSharingIcon from "@/assets/icons/protocols/4.svg";
import crossChainIcon from "@/assets/icons/protocols/5.svg";
import securityIcon from "@/assets/icons/protocols/6.svg";
import watchtowerIcon from "@/assets/icons/protocols/7.svg";
import randomnessIcon from "@/assets/icons/protocols/8.svg";
import sybilIcon from "@/assets/icons/protocols/9.svg";
import governanceIcon from "@/assets/icons/protocols/10.svg";
import daoIcon from "@/assets/icons/protocols/11.svg";
import gemStonIcon from "@/assets/icons/protocols/12.svg";
import websiteIcon from "@/assets/icons/common/website.svg";
import githubIcon from "@/assets/icons/common/github-white.svg";
import notionIcon from "@/assets/icons/common/notion.svg";

const commonLinks = [
  {
    icon: websiteIcon,
    label: "Website",
    alt: "Website icon",
  },
  {
    icon: githubIcon,
    label: "Github",
    alt: "Github icon",
  },
  {
    icon: notionIcon,
    label: "Notion",
    alt: "Notion icon",
  },
];

export const protocolsData: ProtocolCardProps[] = [
  {
    icon: infrastructureIcon,
    title: "L2 Infrastructure & Scalability",
    description:
      "Protocols related to L2 infrastructure and technical scalability",
    alt: "L2 Infrastructure icon",
    links: commonLinks,
  },
  {
    icon: applicationL2Icon,
    title: "Applications-specific L2",
    description:
      "Creating specialized L2s like super private and gaming networks that can be deployed on Tokamak Rollup Hub.",
    alt: "Applications L2 icon",
    links: commonLinks,
  },
  {
    icon: zkEvmIcon,
    title: "New class of zk-EVM",
    description:
      "Enabling anyone to become a prover with minimal hardware requirements, making it possible to launch a new zk-based L2",
    alt: "zk-EVM icon",
    links: commonLinks,
  },
  {
    icon: blobSharingIcon,
    title: "Blob sharing for L2s",
    description:
      "Reducing data availability costs through rollup collaboration.",
    alt: "Blob sharing icon",
    links: commonLinks,
  },
  {
    icon: crossChainIcon,
    title: "Cross chain swap",
    description:
      "Developing a cross-chain swap system that relies solely on L1 & L2 security, rather than whitelisting or third-party consensus.",
    alt: "Cross chain swap icon",
    links: commonLinks,
  },
  {
    icon: securityIcon,
    title: "Enhanced security, reliability, and identity",
    description: "Security/reliability and identity enhancement protocols",
    alt: "Security icon",
    links: commonLinks,
  },
  {
    icon: watchtowerIcon,
    title: "L2 Watchtower",
    description:
      "Using staking and challenging mechanisms to detect and prevent malicious activity on L2s.",
    alt: "Watchtower icon",
    links: commonLinks,
  },
  {
    icon: randomnessIcon,
    title: "Veriable randomness",
    description:
      "Completing development of a minimal distributed randomness protocol and releasing it as open source.",
    alt: "Randomness icon",
    links: commonLinks,
  },
  {
    icon: sybilIcon,
    title: "Sybil resistance",
    description:
      "Creating an identity-proving algorithm and zk-rollup network for user identification.",
    alt: "Sybil resistance icon",
    links: commonLinks,
  },
  {
    icon: governanceIcon,
    title: "Expanding governance and token utility",
    description: "Protocols related to governance and token utility extension",
    alt: "Governance icon",
    links: commonLinks,
  },
  {
    icon: daoIcon,
    title: "DAO",
    description:
      "Implementing a security council while removing the three-member DAO committee structure to give TON holders greater freedom in governance.",
    alt: "DAO icon",
    links: commonLinks,
  },
  {
    icon: gemStonIcon,
    title: "GemSton",
    description:
      "Expanding staked TON utility beyond L2 watchtower functions by introducing gameplay elements with NFTs linked to staked TON.",
    alt: "GemSton icon",
    links: commonLinks,
  },
];
