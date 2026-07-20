'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/PageChrome';

const workflowCards = [
  {
    title: 'Deposit',
    body: 'Add capital to a protected QSentia wallet after KYC and risk checks are complete.',
  },
  {
    title: 'Allocate',
    body: 'Choose a model, review risk, set an amount, and reserve capital from wallet balance.',
  },
  {
    title: 'Execute',
    body: 'QSentia routes approved model activity through controlled execution and audit workflows.',
  },
  {
    title: 'Monitor',
    body: 'Track performance, trade logs, model health, drawdown, and allocation status in one place.',
  },
];

const investorCards = [
  {
    title: 'Public model diligence',
    body: 'Review return history, Sharpe, drawdown, win rate, model health, and minimum allocation before creating an account.',
    tone: 'target',
  },
  {
    title: 'Wallet-funded allocation',
    body: 'After login, deposit funds once and allocate capital across eligible ML trading models from the same wallet.',
    tone: 'split',
  },
  {
    title: 'Ongoing capital control',
    body: 'Monitor active allocations, execution activity, trade logs, risk movement, and withdrawal-ready cash from one dashboard.',
    tone: 'grid',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F5F6] text-[#111827] antialiased transition-colors duration-150 dark:bg-[#09090b] dark:text-zinc-50">
      <SiteHeader />

      <section className="border-b border-[#dedfdf] bg-[#F5F5F6] pb-20 pt-14 transition-colors dark:border-zinc-900 dark:bg-[#09090b] sm:pb-24 sm:pt-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0F8F5A] dark:text-[#8ee0b8]">
            QSentia investment intelligence
          </p>
          <h1 className="mt-7 max-w-5xl text-[44px] font-medium leading-[1.02] tracking-[-0.045em] text-[#101820] sm:text-[70px] lg:text-[92px] dark:text-white">
            <span className="font-semibold text-[#0F8F5A]">Allocate capital</span> to monitored ML trading models.
          </h1>
          <p className="mt-8 max-w-4xl text-lg font-normal leading-8 text-[#4b5563] sm:text-[22px] sm:leading-9 dark:text-zinc-300">
            QSentia lets investors fund a wallet, choose{' '}
            <span className="font-medium text-[#0F8F5A]">machine-learning investment models</span>,
            allocate capital, and monitor trade signals, position changes, trade logs, performance history,{' '}
            <span className="font-medium text-[#0F8F5A]">risk analytics</span>, attribution, and{' '}
            <span className="font-medium text-[#0F8F5A]">live model telemetry</span> in one place.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/marketplace"
              className="inline-flex h-[56px] min-w-[228px] items-center justify-center rounded-[4px] bg-[#0F8F5A] px-8 text-[15px] font-semibold text-white shadow-[0_16px_38px_rgba(15,143,90,0.16)] transition hover:bg-[#0b7549] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Explore Models
              <span aria-hidden="true" className="ml-2">
                -&gt;
              </span>
            </Link>
            <Link
              href="/signin"
              className="inline-flex h-[56px] min-w-[204px] items-center justify-center rounded-[4px] border border-[#cfd7d2] bg-white px-8 text-[15px] font-semibold text-[#101820] shadow-[0_12px_34px_rgba(15,23,42,0.04)] transition hover:border-[#0F8F5A] hover:text-[#0F8F5A] dark:border-zinc-800 dark:bg-[#09090b] dark:text-white dark:hover:border-zinc-600"
            >
              Investor Login
            </Link>
          </div>
          <p className="mt-5 max-w-4xl text-[11px] font-semibold uppercase leading-6 tracking-[0.22em] text-zinc-500 dark:text-zinc-500">
            Public model diligence before login. Wallet, allocation, execution, and monitoring after login.
          </p>
        </div>
      </section>

      <section className="border-b border-[#dedfdf] bg-white py-16 transition-colors dark:border-zinc-900 dark:bg-black sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative min-h-[280px] overflow-hidden rounded-[8px] border border-[#d9dcda] bg-[#F5F5F6] p-6 shadow-[0_18px_54px_rgba(15,23,42,0.045)] dark:border-zinc-800 dark:bg-[#111113]">
            <div className="absolute inset-x-6 top-8 h-px bg-[#d9dcda] dark:bg-zinc-800" />
            <div className="absolute inset-y-6 left-10 w-px bg-[#d9dcda] dark:bg-zinc-800" />
            <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full border border-[#0F8F5A]/35" />
            <div className="absolute bottom-14 right-14 h-16 w-16 rounded-full bg-[#0F8F5A]" />
            <div className="absolute left-10 top-8 flex h-14 w-14 items-center justify-center rounded-[6px] border border-[#0F8F5A]/30 bg-white text-lg font-semibold text-[#0F8F5A] dark:bg-black">
              Q
            </div>
            <div className="relative mt-24 grid gap-3 sm:grid-cols-3">
              <AboutSignal label="Predictive models" value="ML" />
              <AboutSignal label="Adaptive control" value="RL" />
              <AboutSignal label="Evidence-backed" value="01" />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0F8F5A] dark:text-[#8ee0b8]">
              About QSentia
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-[#101820] sm:text-5xl dark:text-white">
              Quantitative research built for transparent model allocation.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-600 dark:text-zinc-400">
              QSentia is a quantitative research company bringing institutional-grade machine learning models to
              everyone. We combine advanced predictive models with adaptive reinforcement learning to manage risk,
              control drawdowns, and respond to changing market conditions.
            </p>
            <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-zinc-400">
              By making every model transparent, measurable, and evidence-backed, QSentia gives investors access to
              intelligence once reserved for institutional trading desks.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dedfdf] bg-white py-20 transition-colors dark:border-zinc-900 dark:bg-[#09090b] sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mx-auto max-w-5xl text-center text-4xl font-medium tracking-[-0.035em] text-[#101820] sm:text-6xl dark:text-white">
            Built around the investor capital journey.
          </h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {investorCards.map((card) => (
              <InvestorCard
                key={card.title}
                title={card.title}
                body={card.body}
                tone={card.tone}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#dedfdf] bg-[#F5F5F6] py-20 transition-colors dark:border-zinc-900 dark:bg-[#09090b] sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0F8F5A] dark:text-[#8ee0b8]">
              Why QSentia exists
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-[#101820] sm:text-5xl dark:text-white">
              Discover models, fund your wallet, allocate capital, and monitor execution in one platform.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <ProblemCard title="Fund" body="Investors deposit capital into a protected wallet only after account, KYC, and suitability steps are complete." />
            <ProblemCard title="Allocate" body="Each model exposes its return profile, risk, fee, minimum allocation, health, and evidence before capital is reserved." />
            <ProblemCard title="Monitor" body="After allocation, investors can track model activity, trade logs, risk movement, and available cash from the dashboard." />
          </div>
        </div>
      </section>

      <section className="border-b border-[#dedfdf] bg-white py-20 transition-colors dark:border-zinc-900 dark:bg-black sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0F8F5A] dark:text-[#8ee0b8]">
              North star workflow
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-[#101820] sm:text-5xl dark:text-white">
              From available cash to active model allocation.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-600 dark:text-zinc-400">
              Investors start by exploring models publicly. After login, they complete onboarding, fund the wallet, allocate to a strategy, and monitor how QSentia executes and reports model-driven trading activity.
            </p>
          </div>

          <div className="rounded-[6px] border border-[#d9dcda] bg-[#F5F5F6] p-6 shadow-[0_18px_54px_rgba(15,23,42,0.045)] dark:border-zinc-800 dark:bg-[#111113]">
            <NorthStarItem
              step="01"
              title="Explore before login"
              body="Compare strategy, return, Sharpe, drawdown, win rate, model health, fees, and minimum allocation."
            />
            <NorthStarItem
              step="02"
              title="Fund after approval"
              body="Complete KYC, add capital to wallet, and see available, allocated, pending, and withdrawable balances."
            />
            <NorthStarItem
              step="03"
              title="Allocate and supervise"
              body="Reserve capital to a model, approve required terms, then monitor execution, trades, telemetry, and risk."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F6] py-20 transition-colors dark:bg-[#09090b] sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-5 border-b border-[#d9dcda] pb-7 dark:border-zinc-900 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0F8F5A] dark:text-[#8ee0b8]">
                Product surfaces
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-[#101820] sm:text-4xl dark:text-white">
                What investors act on
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-sm font-semibold text-zinc-500 transition hover:text-[#0F8F5A] dark:hover:text-white"
            >
              Explore marketplace &rsaquo;
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {workflowCards.map((card) => (
              <WorkflowCard key={card.title} title={card.title} body={card.body} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#dedfdf] bg-white py-20 transition-colors dark:border-zinc-900 dark:bg-[#09090b]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Team
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-0.035em] text-[#101820] sm:text-5xl dark:text-white">
              See the professionals building the QSentia platform.
            </h2>
          </div>
          <Link
            href="/team"
            className="inline-flex h-12 items-center justify-center rounded-[4px] border border-[#0F8F5A] bg-[#0F8F5A] px-6 text-sm font-semibold text-white transition hover:bg-[#0b7549] dark:border-white dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Meet the team
          </Link>
        </div>
      </section>
    </main>
  );
}

function InvestorCard({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <article className="rounded-[6px] border border-transparent p-2 transition hover:border-[#d9dcda] dark:hover:border-zinc-800">
      <InvestorIcon tone={tone} />
      <h3 className="mt-10 text-2xl font-medium tracking-[-0.025em] text-[#101820] sm:text-3xl dark:text-white">
        {title}
      </h3>
      <p className="mt-5 max-w-sm text-base leading-8 text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </article>
  );
}

function AboutSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-[#d9dcda] bg-white/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.035)] backdrop-blur dark:border-zinc-800 dark:bg-black/70">
      <div className="font-mono text-lg font-bold text-[#101820] dark:text-white">{value}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase leading-5 tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
    </div>
  );
}

function InvestorIcon({ tone }: { tone: string }) {
  if (tone === 'split') {
    return (
      <div className="relative h-20 w-20 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-[#dceee6]" />
        <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-full bg-[#0F8F5A]" />
        <div className="absolute right-0 top-0 h-10 w-10 rounded-tr-full bg-[#b8ddcb]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/75" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/75" />
      </div>
    );
  }

  if (tone === 'grid') {
    return (
      <div className="grid h-20 w-20 grid-cols-2 gap-1.5">
        <span className="rounded-full bg-[#bddfcc]" />
        <span className="rounded-full bg-[#dceee6]" />
        <span className="rounded-br-[26px] rounded-tl-[26px] bg-[#0F8F5A]" />
        <span className="rounded-full bg-[#bddfcc]" />
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dceee6]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8fc6aa]">
        <div className="h-9 w-9 rounded-full bg-[#0F8F5A]" />
      </div>
    </div>
  );
}

function ProblemCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[6px] border border-[#d9dcda] bg-white p-7 shadow-[0_14px_38px_rgba(15,23,42,0.035)] transition hover:border-[#0F8F5A]/45 dark:border-zinc-800 dark:bg-[#111113]">
      <p className="text-sm font-medium text-[#101820] dark:text-white">{title}</p>
      <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">{body}</p>
    </article>
  );
}

function WorkflowCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[6px] border border-[#d9dcda] bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.03)] transition hover:border-[#0F8F5A]/45 dark:border-zinc-800 dark:bg-[#111113]">
      <p className="text-sm font-medium text-[#101820] dark:text-white">{title}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{body}</p>
    </article>
  );
}

function NorthStarItem({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-5 border-b border-[#d9dcda] py-5 first:pt-0 last:border-b-0 last:pb-0 dark:border-zinc-800">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[#dceee6] text-sm font-semibold text-[#0F8F5A] dark:bg-[#113227] dark:text-[#8ee0b8]">
        {step}
      </div>
      <div>
        <p className="text-base font-medium text-[#101820] dark:text-white">{title}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{body}</p>
      </div>
    </div>
  );
}
