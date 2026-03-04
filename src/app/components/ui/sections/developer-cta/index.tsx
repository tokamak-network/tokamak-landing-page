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
    title: "Documentation",
    description: "Everything you need to build, deploy, and scale your L2.",
    buttonLabel: "Open Docs",
    href: LINKS.DOCS,
    icon: DocIcon,
    iconHover: DocIconHover,
  },
  {
    title: "GitHub",
    description: "Explore our open-source repositories and contribute.",
    buttonLabel: "View Code",
    href: LINKS.GITHUB,
    icon: GithubIcon,
    iconHover: GithubIconHover,
  },
  {
    title: "Grant Program",
    description: "Get funding to build the next big thing on Tokamak Network.",
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
      className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-[#0078FF] hover:shadow-md flex-1 min-w-[240px]"
    >
      <div className="w-12 h-12 rounded-lg bg-[#0078FF]/10 text-[#0078FF] flex items-center justify-center mb-2">
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
      <h3 className="text-[20px] font-[700] text-slate-900 group-hover:text-[#0078FF] transition-colors">
        {card.title}
      </h3>
      <p className="text-[14px] text-slate-500 leading-relaxed">
        {card.description}
      </p>
    </a>
  );
}

export default function DeveloperCta() {
  return (
    <section className="w-full bg-background-light flex justify-center px-6 py-[100px] [@media(max-width:700px)]:py-[60px]">
      <div className="w-full max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CTA_CARDS.map((card) => (
            <CtaCardItem key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
