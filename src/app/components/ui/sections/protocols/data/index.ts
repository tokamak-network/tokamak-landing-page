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

export const protocolsData: ProtocolCardProps[] = [
  {
    icon: infrastructureIcon,
    title: "L2 Infrastructure & Scalability",
    description:
      "Protocols related to L2 infrastructure and technical scalability",
    alt: "L2 Infrastructure icon",
  },
  {
    icon: applicationL2Icon,
    title: "Applications-specific L2",
    description:
      "Creating specialized L2s like super private and gaming networks that can be deployed on Tokamak Rollup Hub.",
    alt: "Applications L2 icon",
    links: [
      {
        icon: "Website",
        alt: "Application-specific L2 overview",
        link: "https://tokamak.notion.site/Project-TRH-Overview-daef2d91304d495790732dd93e60c09c",
      },
      {
        icon: "Github",
        alt: "Application-specific L2 github",
        link: "https://github.com/tokamak-network/tokamak-rollup-hub",
      },
    ],
  },
  {
    icon: zkEvmIcon,
    title: "New class of zk-EVM",
    description:
      "Enabling anyone to become a prover with minimal hardware requirements, making it possible to launch a new zk-based L2",
    alt: "zk-EVM icon",
    links: [
      {
        icon: "Website",
        alt: "New class of zk-EVM overview icon",
        link: "https://medium.com/tokamak-network/project-tokamak-zk-evm-67483656fd21",
      },
      {
        icon: "Github",
        alt: "New class of zk-EVM github icon",
        link: "https://github.com/tokamak-network/Tokamak-ZkEVM",
      },
    ],
  },
  {
    icon: blobSharingIcon,
    title: "Blob sharing for L2s",
    description:
      "Reducing data availability costs through rollup collaboration.",
    alt: "Blob sharing icon",
  },
  {
    icon: crossChainIcon,
    title: "Cross chain swap",
    description:
      "Developing a cross-chain swap system that relies solely on L1 & L2 security, rather than whitelisting or third-party consensus.",
    alt: "Cross chain swap icon",
    links: [
      {
        icon: "Website",
        alt: "Cross chain swap website",
        link: "https://tokamak.notion.site/BEE-Tokamak-Bridge-Project-17657e9e9ec44f9dbdb3ef3304724aeb",
      },
      {
        icon: "Github",
        alt: "Cross chain swap github",
        link: "https://github.com/tokamak-network/crossTrade",
      },
    ],
  },
  {
    icon: securityIcon,
    title: "Enhanced security, reliability, and identity",
    description: "Security/reliability and identity enhancement protocols",
    alt: "Security icon",
  },
  {
    icon: watchtowerIcon,
    title: "L2 Watchtower",
    description:
      "Using staking and challenging mechanisms to detect and prevent malicious activity on L2s.",
    alt: "Watchtower icon",
    links: [
      {
        icon: "Website",
        alt: "L2 Watchtower website",
        link: "https://www.notion.so/tokamak/Project-ECO-Tokamak-Economics-Information-49e44e989c514bd683e077c01cc8f143",
      },
      {
        icon: "Github",
        alt: "L2 Watchtower github",
        link: "https://github.com/tokamak-network/simple-staking-v2",
      },
    ],
  },
  {
    icon: randomnessIcon,
    title: "Veriable randomness",
    description:
      "Completing development of a minimal distributed randomness protocol and releasing it as open source.",
    alt: "Randomness icon",
    links: [
      {
        icon: "Website",
        alt: "Veriable randomness website",
        link: "https://www.notion.so/tokamak/Introduction-to-Random-number-generator-project-0606bbad49ba4e63b8500902ba5afd31",
      },
      {
        icon: "Github",
        alt: "Veriable randomness github",
        link: "https://github.com/tokamak-network/Randomness-Beacon",
      },
    ],
  },
  {
    icon: sybilIcon,
    title: "Sybil resistance",
    description:
      "Creating an identity-proving algorithm and zk-rollup network for user identification.",
    alt: "Sybil resistance icon",
    links: [
      {
        icon: "Website",
        alt: "Sybil resistance website",
        link: "https://www.notion.so/tokamak/Tokamak-Sybil-Resistance-Overview-03cc941223844f30ba4473e98b1275a7",
      },
      {
        icon: "Github",
        alt: "Sybil resistance github",
        link: "https://github.com/tokamak-network/tokamak-sybil-resistance",
      },
    ],
  },
  {
    icon: governanceIcon,
    title: "Expanding governance and token utility",
    description: "Protocols related to governance and token utility extension",
    alt: "Governance icon",
  },
  {
    icon: daoIcon,
    title: "DAO",
    description:
      "Implementing a security council while removing the three-member DAO committee structure to give TON holders greater freedom in governance.",
    alt: "DAO icon",
    links: [
      {
        icon: "Github",
        alt: "DAO github",
        link: "https://github.com/tokamak-network/tokamak-dao-contracts",
      },
    ],
  },
  {
    icon: gemStonIcon,
    title: "GemSton",
    description:
      "Expanding staked TON utility beyond L2 watchtower functions by introducing gameplay elements with NFTs linked to staked TON.",
    alt: "GemSton icon",
    links: [
      {
        icon: "Website",
        alt: "GemSton website",
        link: "https://medium.com/tokamak-network/project-opal-a-comprehensive-overview-78b4fdab87f0",
      },
      {
        icon: "Github",
        alt: "GemSton github",
        link: "https://github.com/tokamak-network/gem-nft-contract",
      },
    ],
  },
];
