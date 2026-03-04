import Image from "next/image";
import DocIcon from "@/assets/icons/common/doc.svg";
import DocIconHover from "@/assets/icons/common/doc-white.svg";
import GithubIcon from "@/assets/icons/common/github.svg";
import GithubIconHover from "@/assets/icons/common/github-black.svg";
import NotionIcon from "@/assets/icons/common/notion.svg";
import { LINKS } from "@/app/constants/links";
import { CLIP_PATHS } from "@/app/constants/styles";

interface CtaCard {
  readonly title: string;
  readonly description: string;
  readonly buttonLabel: string;
  readonly href: string;
  readonly icon: typeof DocIcon;
  readonly iconHover: typeof DocIconHover;
}

const CTA_CARDS: readonly CtaCard[] = [
  {
    title: "Docs",
    description: "Read the documentation",
    buttonLabel: "Open Docs",
    href: LINKS.DOCS,
    icon: DocIcon,
    iconHover: DocIconHover,
  },
  {
    title: "GitHub",
    description: "Explore the codebase",
    buttonLabel: "View Code",
    href: LINKS.GITHUB,
    icon: GithubIcon,
    iconHover: GithubIconHover,
  },
  {
    title: "Grant",
    description: "Get funded to build",
    buttonLabel: "Apply Now",
    href: LINKS.GRANT,
    icon: NotionIcon,
    iconHover: NotionIcon,
  },
] as const;

function CtaCardItem({ card }: { readonly card: CtaCard }) {
  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-[16px] border border-[#E5E5E5]
        hover:border-[#0078FF] hover:shadow-lg transition-all duration-200 group flex-1 min-w-[240px]"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F5F5F5] group-hover:bg-[#0078FF] transition-colors duration-200">
        <Image
          src={card.icon}
          alt={card.title}
          width={24}
          height={24}
          className="group-hover:hidden"
        />
        <Image
          src={card.iconHover}
          alt={card.title}
          width={24}
          height={24}
          className="hidden group-hover:block"
        />
      </div>
      <h3 className="text-[20px] font-[600] text-[#1C1C1C]">{card.title}</h3>
      <p className="text-[15px] font-[300] text-[#808992] text-center">
        {card.description}
      </p>
      <span className="text-[14px] font-[500] text-[#0078FF] group-hover:text-[#0078FF]">
        {card.buttonLabel} &rarr;
      </span>
    </a>
  );
}

export default function DeveloperCta() {
  return (
    <section
      className="w-full bg-white flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px] py-[90px] [@media(max-width:640px)]:py-[60px]"
      style={{ clipPath: CLIP_PATHS.polygon }}
    >
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[30px] font-[100] text-[#1C1C1C] mb-[9px] text-center">
          Start Building with{" "}
          <span className="font-[600]">Tokamak Network</span>
        </h2>
        <p className="text-[15px] font-[300] text-[#808992] mb-[60px] text-center">
          Everything you need to launch your own L2
        </p>
        <div className="flex gap-[24px] w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
          {CTA_CARDS.map((card) => (
            <CtaCardItem key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
