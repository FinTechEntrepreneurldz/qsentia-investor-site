import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BellRing, BriefcaseBusiness, ChartNoAxesCombined, FileText, ShieldCheck, Users } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'For Professionals | QSentia',
  description: 'QSentia workflows for advisors, family offices, and institutional teams reviewing machine-learning investment models.',
};

const workflows = [
  {
    title: 'Model subscription review',
    body: 'Compare approved models by objective, source evidence, return history, drawdown, benchmark context, and current operating status.',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'Client and committee evidence',
    body: 'Package model evidence, telemetry, trade logs, attribution, and methodology notes for internal review without relying on screenshots.',
    icon: FileText,
  },
  {
    title: 'Risk and controls',
    body: 'Keep confidence thresholds, drawdown controls, shadow mode, broker-readiness checks, and permission boundaries visible before use.',
    icon: ShieldCheck,
  },
  {
    title: 'Team workflows',
    body: 'Support multi-user research, model watchlists, alerts, exports, and API access as subscription scope expands.',
    icon: Users,
  },
];

export default function ForProfessionalsPage() {
  return (
    <PageShell active="/for-professionals">
      <PageIntro
        eyebrow="For professionals"
        title="Machine-learning model access for advisors, family offices, and institutions."
        body="QSentia gives professional teams a structured way to evaluate, subscribe to, monitor, and govern machine-learning investment model outputs."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[12px] border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 md:grid-cols-2">
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            return (
              <div key={workflow.title} className="bg-white p-7 dark:bg-[#09090b]">
                <Icon className="h-5 w-5 text-zinc-950 dark:text-white" />
                <h2 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-white">{workflow.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{workflow.body}</p>
              </div>
            );
          })}
        </div>

        <SectionCard className="mt-8 grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              <BriefcaseBusiness className="h-4 w-4" />
              Professional onboarding
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
              Request a model-access pilot for your team.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Share intended use case, desired broker, API requirements, number of users, and pilot timeline so QSentia can scope the right subscription workflow.
            </p>
          </div>
          <Link
            href="/data-room"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Request Beta Access
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Advisor use', 'Research model outputs before applying them to client workflows or educational review.'],
            ['Family office use', 'Evaluate multiple model categories with common telemetry, risk views, and exportable evidence.'],
            ['Institutional use', 'Connect diligence, API access, operating review, and governance requirements in one workspace.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[12px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
              <BellRing className="h-5 w-5 text-zinc-950 dark:text-white" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
