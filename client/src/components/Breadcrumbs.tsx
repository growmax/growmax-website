import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-widest text-gray-500" data-testid="nav-breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-growmax-red transition-colors" data-testid="breadcrumb-home">
            HOME
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-gray-300 mx-1">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-growmax-red transition-colors" data-testid={`breadcrumb-${i}`}>
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-400" data-testid={`breadcrumb-${i}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
