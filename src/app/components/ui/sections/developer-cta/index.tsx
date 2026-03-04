import type { ReactNode } from "react";
import { BookOpen, Github, Award } from "lucide-react";
import { LINKS } from "@/app/constants/links";

interface CtaCard {
  readonly title: string;
  readonly description: string;
  readonly buttonLabel: string;
  readonly href: string;
  readonly icon: ReactNode;
}

const CTA_CARDS: readonly CtaCard[] = [
  {
    title: "Docs",
    description: "Read the documentation",
    buttonLabel: "Open Docs",
    href: LINKS.DOCS,
    icon: <BookOpen size={24} />,
  },
  {
    title: "GitHub",
    description: "Explore the codebase",
    buttonLabel: "View Code",
    href: LINKS.GITHUB,
    icon: <Github size={24} />,
  },
  {
    title: "Grant",
    description: "Get funded to build",
    buttonLabel: "Apply Now",
    href: LINKS.GRANT,
    icon: <Award size={24} />,
  },
] as const;

function CtaCardItem({ card }: { readonly card: CtaCard }) {
  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl glass-panel
        hover:border-primary/50 transition-all duration-200 group flex-1 min-w-[240px]"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
        {card.icon}
      </div>
      <h3 className="text-[20px] font-[600] text-white group-hover:text-primary transition-colors">
        {card.title}
      </h3>
      <p className="text-[15px] text-slate-400 text-center">
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
    <section className="relative z-10 w-full flex justify-center px-6 py-[100px] [@media(max-width:640px)]:py-[60px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[36px] md:text-[40px] font-[700] text-white tracking-[-0.02em] mb-4 text-center">
          Start Building
        </h2>
        <p className="text-[16px] text-slate-400 mb-[60px] text-center">
          Everything you need to launch your own L2
        </p>
        <div className="flex gap-6 w-full [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center">
          {CTA_CARDS.map((card) => (
            <CtaCardItem key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
