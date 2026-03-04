import Image from "next/image";
import DocIcon from "@/assets/icons/common/doc.svg";
import DocIconHover from "@/assets/icons/common/doc-white.svg";
import GithubIcon from "@/assets/icons/common/github.svg";
import GithubIconHover from "@/assets/icons/common/github-black.svg";
import NotionIcon from "@/assets/icons/common/notion.svg";
import { LINKS } from "@/app/constants/links";

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
      className="flex flex-col items-center justify-center gap-4 p-8 bg-surface rounded-xl border border-border-color
        hover:border-primary/50 transition-all duration-200 group flex-1 min-w-[240px]"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary transition-colors duration-200">
        <Image
          src={card.icon}
          alt={card.title}
          width={24}
          height={24}
          className="brightness-0 invert group-hover:hidden"
        />
        <Image
          src={card.iconHover}
          alt={card.title}
          width={24}
          height={24}
          className="hidden group-hover:block"
        />
      </div>
      <h3 className="text-[20px] font-[700] text-white">{card.title}</h3>
      <p className="text-[14px] text-slate-400 text-center">
        {card.description}
      </p>
      <span className="text-[14px] font-[500] text-primary">
        {card.buttonLabel} &rarr;
      </span>
    </a>
  );
}

export default function DeveloperCta() {
  return (
    <section className="w-full flex justify-center px-6 [@media(max-width:1000px)]:px-4 py-[90px] [@media(max-width:640px)]:py-[60px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[24px] font-[700] text-white mb-2 text-center tracking-tight">
          Start Building with Tokamak Network
        </h2>
        <p className="text-[14px] text-slate-400 mb-[60px] text-center">
          Everything you need to launch your own L2
        </p>
        <div className="flex gap-4 w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
          {CTA_CARDS.map((card) => (
            <CtaCardItem key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
