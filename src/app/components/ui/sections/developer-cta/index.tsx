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
      className="flex flex-col items-center justify-center gap-5 p-10 card-charcoal group flex-1 min-w-[240px]"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
        {card.icon}
      </div>
      <h3 className="text-[16px] font-[900] text-white uppercase tracking-[0.06em] group-hover:text-primary transition-colors duration-300">
        {card.title}
      </h3>
      <p className="text-[15px] text-[#929298] text-center">
        {card.description}
      </p>
      <span className="text-[14px] font-[700] text-primary uppercase tracking-[0.04em]">
        {card.buttonLabel} &rarr;
      </span>
    </a>
  );
}

export default function DeveloperCta() {
  return (
    <section className="relative z-10 w-full flex justify-center px-6 py-[160px] [@media(max-width:640px)]:py-[80px]">
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <h2 className="text-[38px] md:text-[48px] font-[900] text-white tracking-[0.06em] uppercase mb-3 text-center">
          Start Building
        </h2>
        <div className="w-10 h-[3px] bg-primary mx-auto mb-5" />
        <p className="text-[16px] text-[#929298] mb-[80px] text-center">
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
