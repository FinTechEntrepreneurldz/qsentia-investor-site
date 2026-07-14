import type { Metadata } from 'next';
import { CheckCircle2, Database, GitBranch, Waypoints } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Integrations | QSentia',
  description: 'Connected connectors and system integrations for live telemetry.',
};

const connected = [
  {
    title: 'GitHub model logs',
    body: 'Repository registry and source-backed telemetry ingestion.',
    icon: GitBranch,
  },
  {
    title: 'Supabase',
    body: 'Authentication and production data persistence when configured.',
    icon: Database,
  },
  {
    title: 'IBKR',
    body: 'Broker/account fields are present in registered model telemetry.',
    icon: Waypoints,
  },
  {
    title: 'Alpaca',
    body: 'Registered strategies include Alpaca-routed model implementations.',
    icon: Waypoints,
  },
];

export default function IntegrationsPage() {
  return (
    <PageShell active="/integrations">
      <PageIntro
        eyebrow="Integrations"
        title="Connected where evidence exists"
        body="Integration status reflects this application’s current code and model registry. Planned connectors are never presented as live."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="w-full">
          <h2 className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-zinc-950 dark:text-white uppercase border-b border-zinc-200 dark:border-zinc-850 pb-4">
            Connected or represented
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {connected.map((item) => {
              const Icon = item.icon;
              return (
                <SectionCard
                  key={item.title}
                  className="flex flex-col p-6 justify-between h-full bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]"
                >
                  <div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                      <h3 className="font-mono text-sm sm:text-base font-bold tracking-wider uppercase text-zinc-950 dark:text-white">
                        {item.title}
                      </h3>
                      <CheckCircle2 className="h-4 w-4 text-[#0F8F5A] dark:text-[#12B76A] shrink-0" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.body}
                  </p>
                </SectionCard>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
