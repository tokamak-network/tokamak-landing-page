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
      className="flex flex-col p-8 rounded-2xl glass-panel
        hover:border-primary/50 transition-all duration-200 group flex-1 min-w-[280px]"
    >
      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-[20px] font-[600] text-white mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-[15px] text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      <ul className="flex flex-col gap-2 mt-auto">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-[13px] text-slate-500"
          >
            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <span className="text-[14px] font-[500] text-primary mt-6 group-hover:translate-x-1 transition-transform">
        Learn more &rarr;
      </span>
    </a>
  );
}
