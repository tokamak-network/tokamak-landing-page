import Link from "next/link";
import type { NavColumn } from "./navData";

interface FooterNavColumnProps {
  readonly column: NavColumn;
  readonly headingClass: string;
  readonly linkClass: string;
  readonly className?: string;
}

export default function FooterNavColumn({
  column,
  headingClass,
  linkClass,
  className = "w-[180px] [@media(max-width:1000px)]:w-[175px]",
}: FooterNavColumnProps) {
  return (
    <div className={className}>
      <h3 className={headingClass}>{column.title}</h3>
      <ul className="space-y-2 text-sm font-[400]">
        {column.links.map((link) =>
          link.isInternal ? (
            <li key={link.label}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ) : (
            <li key={link.label}>
              <a
                href={link.href}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
