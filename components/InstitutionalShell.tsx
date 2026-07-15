import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell, TechnicalBackdrop } from '@/components/PageChrome';

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
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
        <TechnicalBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{eyebrow}</p>
          <h1 className="mt-8 max-w-6xl text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-7xl lg:text-[5.5rem]">{title}</h1>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 md:text-base">{body}</p>
          {actions?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={action.primary
                    ? 'inline-flex items-center gap-2 bg-zinc-950 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
                    : 'inline-flex items-center gap-2 border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white'}
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
    <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
      <TechnicalBackdrop />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{eyebrow}</p>
        <h1 className="mt-8 max-w-6xl text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-7xl lg:text-[5.5rem]">{title}</h1>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 md:text-base">{body}</p>
      </div>
    </section>
  );
}

export function DataLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs font-bold uppercase tracking-wide text-[#647269]">{children}</span>;
}
