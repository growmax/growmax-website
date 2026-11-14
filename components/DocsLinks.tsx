import { ArrowUpRight } from 'lucide-react'

// Contextual links from marketing pages into the product docs at /docs. They help readers, search
// engines and AI answer engines connect a claim on this page with the documentation behind it.
// /docs is served by another app behind this domain (middleware.ts), so these are plain <a> tags.
export type DocsLink = { href: string; title: string; description: string }

export default function DocsLinks({ heading = 'From the documentation', links, dark = false }: { heading?: string; links: DocsLink[]; dark?: boolean }) {
  return (
    <div>
      <p className={`font-mono text-xs font-bold uppercase tracking-widest ${dark ? 'text-gray-400' : 'text-growmax-red'}`}>{heading}</p>
      <ul className={`mt-5 grid gap-px border-2 sm:grid-cols-2 lg:grid-cols-3 ${dark ? 'border-white/25 bg-white/25' : 'border-growmax-black bg-growmax-black'}`}>
        {links.map(link => (
          <li key={link.href} className={dark ? 'bg-growmax-black' : 'bg-white'}>
            <a href={link.href} className={`group flex h-full flex-col p-5 transition-colors ${dark ? 'hover:bg-white/5' : 'hover:bg-[#f1f1ef]'}`}>
              <span className="flex items-start justify-between gap-3 font-bold uppercase leading-snug">
                {link.title}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-growmax-red transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span className={`mt-2 text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{link.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
