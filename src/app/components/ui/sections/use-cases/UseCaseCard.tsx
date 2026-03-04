import { LINKS } from "@/app/constants/links";

interface UseCaseCardProps {
  readonly icon: string;
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
      className="flex flex-col p-8 rounded-[16px] bg-[#1C1C1C] border border-[#2A2A2A]
        hover:border-[#0078FF]/50 transition-all duration-200 group flex-1 min-w-[280px]"
    >
      <div className="text-[36px] mb-4">{icon}</div>
      <h3 className="text-[20px] font-[600] text-white mb-2 group-hover:text-[#0078FF] transition-colors">
        {title}
      </h3>
      <p className="text-[15px] font-[300] text-white/60 mb-6 leading-relaxed">
        {description}
      </p>
      <ul className="flex flex-col gap-2 mt-auto">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-[13px] text-white/50"
          >
            <span className="w-1 h-1 rounded-full bg-[#0078FF] flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <span className="text-[14px] font-[500] text-[#0078FF] mt-6 group-hover:translate-x-1 transition-transform">
        Learn more &rarr;
      </span>
    </a>
  );
}
