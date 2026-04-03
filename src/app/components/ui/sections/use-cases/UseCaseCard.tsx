import type { ReactNode } from "react";
import { LINKS } from "@/app/constants/links";

interface UseCaseCardProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly features: readonly string[];
}

export default function UseCaseCard({
  icon,
  title,
  description,
  features,
}: UseCaseCardProps) {
  return (
    <a
      href={LINKS.DOCS}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col p-8 card-charcoal group flex-1 min-w-[280px]"
    >
      <div className="w-12 h-12 bg-primary/20 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-[18px] font-[900] text-white mb-3 uppercase tracking-[0.06em] group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-[15px] text-[#929298] mb-6 leading-relaxed">
        {description}
      </p>
      <ul className="flex flex-col gap-2 mt-auto">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-[13px] text-[#929298]"
          >
            <span className="w-1 h-1 bg-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <span className="text-[14px] font-[700] text-primary mt-6 uppercase tracking-[0.04em]">
        Learn more &rarr;
      </span>
    </a>
  );
}
