import type { Metadata } from 'next';
import { BookOpen, CalendarClock, FileText } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Research and Monthly Letters | QSentia',
  description: 'Firm-approved commentary and systematic research insights.',
};

const publicationTypes = [
  {
    title: 'Monthly investor letter',
    body: 'Portfolio commentary, material developments, risk observations, and the period under review.',
    icon: CalendarClock,
  },
  {
    title: 'Market research',
    body: 'Firm-approved analysis of market structure, sentiment, volatility, and systematic investment themes.',
    icon: BookOpen,
  },
  {
    title: 'Strategy and methodology notes',
    body: 'Documented changes to model research, validation methods, risk controls, and performance methodology.',
    icon: FileText,
  },
];

export default function InsightsPage() {
  return (
    <PageShell active="/insights">
      <PageIntro
        eyebrow="Research"
        title="Monthly letters and market research"
        body="Firm-approved commentary and research will be published with a named author, publication date, review period, and relevant disclosures."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {publicationTypes.map((item) => {
            const Icon = item.icon;
            return (
              <SectionCard
                key={item.title}
                className="p-6 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px] flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                      Coming soon
                    </span>
                  </div>
                  <h2 className="mt-5 font-mono text-base sm:text-lg font-bold tracking-wider uppercase text-zinc-950 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.body}
                  </p>
                </div>
                <div className="mt-5 border-t border-zinc-200 dark:border-zinc-850 pt-4 font-mono text-[10px] tracking-wide text-zinc-550">
                  No publication released
                </div>
              </SectionCard>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-wide text-zinc-550 leading-relaxed">
          QSentia does not publish generated, backdated, or unapproved investment commentary.
        </p>
      </section>
    </PageShell>
  );
}
