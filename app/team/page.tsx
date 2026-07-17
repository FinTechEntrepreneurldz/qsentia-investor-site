import type { Metadata } from 'next';
import { PageShell } from '@/components/PageChrome';
import TeamDirectory from '@/components/TeamDirectory';
import ScrollSpyOutline from '@/components/ScrollSpyOutline';

export const metadata: Metadata = {
  title: 'Team | QSentia',
  description: 'The QSentia team building investor telemetry, model research workflows, and API infrastructure.',
};

export default function TeamPage() {
  return (
    <PageShell active="/team">
      {/* ── Page Intro Banner ── */}
      <section className="border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            QSentia team
          </p>
          <h1 className="mt-8 max-w-5xl text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-955 dark:text-white md:text-7xl">
            Research, engineering, and investment infrastructure.
          </h1>
          <p className="mt-8 max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Meet the people building QSentia&apos;s investor telemetry, model research workflows, customer dashboards, and API infrastructure for systematic investment operations.
          </p>
        </div>
      </section>

      {/* ── Content Grid with Sticky Sidebar Outline ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <ScrollSpyOutline
              items={[
                { id: 'founder', label: 'Founder' },
                { id: 'quantitative-team', label: 'Quantitative Team' },
                { id: 'software-team', label: 'Software Team' },
              ]}
            />
          </aside>
          <main>
            <TeamDirectory />
          </main>
        </div>
      </div>
    </PageShell>
  );
}
