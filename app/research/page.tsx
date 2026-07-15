import Link from 'next/link';
import { ArrowRight, BarChart3, Database, Workflow } from 'lucide-react';
import { PageShell, SectionCard } from '@/components/PageChrome';
import { ResearchTerminal } from '@/components/ResearchTerminal';
import { PageIntro } from '@/components/InstitutionalShell';

const thesis = [
  {
    number: '01',
    title: 'Source transparency',
    text: 'We link every active strategy to its exact source code repository and telemetry log path. Anyone can inspect how the models operate, ensuring total logic honesty.',
  },
  {
    number: '02',
    title: 'Verified Benchmarks',
    text: 'Returns are calculated and displayed only when backed by genuine historical tracking logs. We never show synthetic, hand-picked performance curves.',
  },
  {
    number: '03',
    title: 'Risk-First Approach',
    text: 'Maximum drawdown, historic volatility, and current safety states are highlighted directly next to returns. We show you the potential downside, not just the upside.',
  },
  {
    number: '04',
    title: 'Full Execution Audits',
    text: 'Every routing decision, position adjustment, and execution speed log is recorded as a structured table. Performance is clear, traceable, and easy to audit.',
  },
] as const;

export default function ResearchPage() {
  return (
    <PageShell active="/research">
      <PageIntro
        eyebrow="Research overview"
        title="Model research, grounded in published telemetry"
        body="QSentia presents systematic model context, benchmark comparison, and operational auditability in a focused research workspace for both institutional and general review."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none"
          >
            Open live dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex h-11 items-center justify-center bg-transparent px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition rounded-none"
          >
            View registry
          </Link>
        </div>
      </PageIntro>

      {/* ── Research Terminal Section ── */}
      <ResearchTerminal />

      {/* ── Thesis Section ── */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-4">
        {thesis.map((item) => (
          <SectionCard
            key={item.number}
            className="p-6 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px] flex flex-col justify-between h-full"
          >
            <div>
              <div className="font-mono text-xs font-bold text-[#0F8F5A] dark:text-[#12B76A]">
                {item.number}
              </div>
              <h2 className="mt-4 font-mono text-sm sm:text-base font-bold tracking-wider text-zinc-950 dark:text-white uppercase">
                {item.title}
              </h2>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.text}
            </p>
          </SectionCard>
        ))}
      </section>

      {/* ── Bottom Explainer Cards ── */}
      <section className="border-y border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black transition-colors">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          <ResearchCard icon={<Database className="h-5 w-5" />} title="Open Repository Linking">
            Our model cards link directly to active repositories and branch histories, letting investors audit the real code running behind the scenes.
          </ResearchCard>
          <ResearchCard icon={<BarChart3 className="h-5 w-5" />} title="Direct Status Reporting">
            If a strategy has a short or insufficient history, we call it out explicitly with status tags rather than hiding it behind smooth charts.
          </ResearchCard>
          <ResearchCard icon={<Workflow className="h-5 w-5" />} title="Traceable Order Logs">
            All trading decisions, positions, and routed orders are preserved as clean tables, providing complete visibility from signal to execution.
          </ResearchCard>
        </div>
      </section>
    </PageShell>
  );
}

function ResearchCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <SectionCard className="p-6 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
      <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
        {icon}
      </span>
      <h2 className="mt-5 font-mono text-sm sm:text-base font-bold tracking-wider text-zinc-950 dark:text-white uppercase">
        {title}
      </h2>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>
    </SectionCard>
  );
}
