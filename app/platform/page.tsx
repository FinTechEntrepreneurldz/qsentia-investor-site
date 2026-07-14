import type { Metadata } from 'next';
import { Activity, Braces, ClipboardCheck, GitCompareArrows, Radio, ShieldCheck } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Platform Overview | QSentia',
  description: 'Operating layer and validation tools for systematic investment models.',
};

const capabilities = [
  {
    title: 'Model telemetry',
    body: 'Normalize portfolio, decisions, positions, orders, and model health into one review surface.',
    icon: Activity,
  },
  {
    title: 'Research validation',
    body: 'Compare reported outcomes, source history, drawdown, and benchmark behavior.',
    icon: GitCompareArrows,
  },
  {
    title: 'Paper/live monitoring',
    body: 'Keep operating mode, account status, positions, and execution evidence visible.',
    icon: Radio,
  },
  {
    title: 'Broker readiness',
    body: 'Review entitlement, broker, scheduler, and risk gates before execution is enabled.',
    icon: ShieldCheck,
  },
  {
    title: 'API access',
    body: 'Issue scoped credentials and expose documented model and dashboard endpoints.',
    icon: Braces,
  },
  {
    title: 'Audit trails',
    body: 'Record commercial, credential, deployment, and operating changes for review.',
    icon: ClipboardCheck,
  },
];

export default function PlatformPage() {
  return (
    <PageShell active="/platform">
      <PageIntro
        eyebrow="Platform lane"
        title="The operating layer for systematic models"
        body="QSentia brings research validation, model telemetry, paper and live monitoring, broker readiness, API access, and auditable controls into one platform."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white dark:bg-[#1A1A1D] p-8 flex flex-col justify-between h-full transition-colors"
              >
                <div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h2 className="mt-5 font-mono text-sm sm:text-base font-bold tracking-wider uppercase text-zinc-955 dark:text-white">
                    {item.title}
                  </h2>
                </div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-450">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
