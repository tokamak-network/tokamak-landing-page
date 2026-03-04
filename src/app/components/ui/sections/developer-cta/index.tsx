import { BookOpen, Github, Award } from "lucide-react";
import { LINKS } from "@/app/constants/links";
import type { ReactNode } from "react";

interface CtaCard {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: ReactNode;
}

const CTA_CARDS: readonly CtaCard[] = [
  {
    title: "Documentation",
    description: "Everything you need to build, deploy, and scale your L2.",
    href: LINKS.DOCS,
    icon: <BookOpen size={24} />,
  },
  {
    title: "GitHub",
    description: "Explore our open-source repositories and contribute.",
    href: LINKS.GITHUB,
    icon: <Github size={24} />,
  },
  {
    title: "Grant Program",
    description: "Get funding to build the next big thing on Tokamak Network.",
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
      className="group flex flex-col gap-4 card-charcoal p-8 flex-1 min-w-[240px]"
    >
      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
        {card.icon}
      </div>
      <h3 className="text-[20px] font-[900] text-white group-hover:text-primary transition-colors uppercase tracking-[0.04em]">
        {card.title}
      </h3>
      <p className="text-[14px] text-[#929298] leading-relaxed">
        {card.description}
      </p>
    </a>
  );
}

export default function DeveloperCta() {
  return (
    <section className="relative z-10 w-full bg-black flex justify-center px-6 py-[160px] [@media(max-width:700px)]:py-[80px]">
      <div className="w-full max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CTA_CARDS.map((card) => (
            <CtaCardItem key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
