import type { Metadata } from 'next';
import { Activity, Bot, Database, Gauge, Radio, ShieldCheck } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Investment Methodology | QSentia',
  description: 'The six stages of the QSentia systematic investment process.',
};

const steps = [
  {
    title: 'Signal inputs',
    body: 'Market, text, sentiment, and model-specific source inputs are ingested by each registered strategy.',
    icon: Database,
  },
  {
    title: 'Model inference',
    body: 'Approved model code transforms source inputs into a directional or allocation signal.',
    icon: Bot,
  },
  {
    title: 'Confidence scoring',
    body: 'The model reports confidence and component evidence where those fields are available.',
    icon: Gauge,
  },
  {
    title: 'Risk sizing',
    body: 'Target exposure is constrained by the strategy implementation and approved account controls.',
    icon: ShieldCheck,
  },
  {
    title: 'Execution',
    body: 'Paper or live orders are routed through the configured broker only after applicable gates pass.',
    icon: Radio,
  },
  {
    title: 'Monitoring',
    body: 'Portfolio, decision, position, and order logs flow into telemetry for review and reconciliation.',
    icon: Activity,
  },
];

export default function MethodologyPage() {
  return (
    <PageShell active="/methodology">
      <PageIntro
        eyebrow="Investment process"
        title="From information to monitored execution"
        body="QSentia separates research, signal generation, risk sizing, execution, and evidence so each stage can be inspected without pretending the model is a black box."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-white dark:bg-[#09090b] p-8 flex flex-col justify-between h-full transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">
                      0{index + 1}
                    </span>
                  </div>
                  <h2 className="mt-5 font-mono text-base sm:text-lg font-bold tracking-wider text-zinc-950 dark:text-white uppercase">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
