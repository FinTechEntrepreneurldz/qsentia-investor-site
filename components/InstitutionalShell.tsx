import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Eyebrow, PageShell, TechnicalBackdrop } from '@/components/PageChrome';

export function InstitutionalHero({
  active,
  eyebrow,
  title,
  body,
  actions,
}: {
  active: string;
  eyebrow: string;
  title: string;
  body: string;
  actions?: Array<{ href: string; label: string; primary?: boolean }>;
}) {
  return (
    <PageShell active={active}>
      <section className="relative overflow-hidden border-b border-[#e2e7fb] bg-[#f8faff]">
        <TechnicalBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[1.04] tracking-normal text-[#06130c] md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#46554b] md:text-lg">{body}</p>
          {actions?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={action.primary
                    ? 'inline-flex items-center gap-2 rounded-md bg-[#172554] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2437b5]'
                    : 'inline-flex items-center gap-2 rounded-md border border-[#cbd5ff] bg-white px-5 py-3 text-sm font-semibold text-[#172554] hover:border-[#3d52da]'}
                >
                  {action.label}<ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black py-12 sm:py-16 transition-colors">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">{eyebrow}</p>
        <h1 className="mt-6 max-w-5xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95] text-zinc-950 dark:text-white">{title}</h1>
        <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
      </div>
    </section>
  );
}

export function DataLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs font-bold uppercase tracking-wide text-[#647269]">{children}</span>;
}
