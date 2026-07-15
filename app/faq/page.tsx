import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CreditCard,
  Database,
  KeyRound,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PageIntro } from "@/components/InstitutionalShell";
import { PageShell, SectionCard } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: 'FAQ | QSentia',
  description: 'Frequently asked questions about QSentia investors, platform access, APIs, billing, security, and careers.',
};

const faqGroups = [
  {
    title: 'Investors',
    icon: Scale,
    items: [
      {
        question: 'What does QSentia help investors evaluate?',
        answer:
          'QSentia helps investors review machine-learning strategy evidence, normalized performance, benchmark context, drawdown controls, and execution-readiness signals before making capital or diligence decisions.',
      },
      {
        question: 'Is the performance data live or manually entered?',
        answer:
          "Research and performance surfaces are designed around source-backed telemetry from the platform APIs and configured model records. When source rows are unavailable, the interface shows missing or unavailable states rather than replacing them with unsupported numbers.",
      },
      {
        question: 'Can investors request diligence materials?',
        answer:
          'Yes. Investor materials are handled through controlled request workflows such as the data room and investor qualification forms. QSentia can route tear sheets, methodology notes, and strategy information after the appropriate review.',
      },
    ],
  },
  {
    title: 'Platform and API access',
    icon: Database,
    items: [
      {
        question: 'What does the platform provide?',
        answer:
          'The platform is built for model telemetry, research validation, paper or live monitoring readiness, API access controls, broker-readiness review, audit trails, and customer account operations.',
      },
      {
        question: 'How are model APIs issued?',
        answer:
          "API access is tied to approved customer accounts, model entitlements, scoped keys, and usage controls. Production credentials are issued only after commercial approval, security review, and broker or deployment-readiness checks where relevant.",
      },
      {
        question: 'Can QSentia connect models to brokerage accounts?',
        answer:
          'Broker execution requires a controlled onboarding flow, customer authorization, risk limits, scheduler controls, kill-switch handling, and audit logging. QSentia treats broker connectivity as a higher-risk operational workflow rather than a simple website toggle.',
      },
    ],
  },
  {
    title: 'Accounts and billing',
    icon: CreditCard,
    items: [
      {
        question: 'Do users need an account?',
        answer:
          'Public pages are available without signing in. Customer dashboards, billing, API credentials, broker setup, deployment controls, and admin operations require authenticated access.',
      },
      {
        question: 'How are plans and trials handled?',
        answer:
          'Plans, trials, discount codes, model access, and billing records are managed through the back-office and customer settings workflows. Enterprise terms may be handled separately through written agreements.',
      },
      {
        question: 'Where can a customer manage settings?',
        answer:
          'After signing in, customers can use Settings to review billing, model access, API credentials, broker setup, deployment controls, and support workflows.',
      },
    ],
  },
  {
    title: 'Security and privacy',
    icon: ShieldCheck,
    items: [
      {
        question: "How do users handle broker credentials or API secrets?",
        answer:
          "Users must never place broker credentials, API secrets, private keys, passwords, or payment-card numbers in ordinary forms, support messages, or application materials. Sensitive integrations use approved secure flows only.",
      },
      {
        question: 'What privacy framework does QSentia reference?',
        answer:
          "QSentia's public policy pages now reference GDPR and US privacy readiness, including state privacy rights, vendor controls, breach workflows, and FTC-style privacy and security safeguards.",
      },
      {
        question: 'Does QSentia claim SOC 2 or GDPR certification?',
        answer:
          "No. Public policy pages describe operating baselines and readiness work. Certification, audit scope, and legal compliance claims are published only after appropriate validation.",
      },
    ],
  },
  {
    title: 'Careers',
    icon: BriefcaseBusiness,
    items: [
      {
        question: 'Where are open roles listed?',
        answer:
          'Open roles appear on the Careers page after the QSentia team publishes them from the admin career board. If no roles are open, the page will show a clear no-open-roles state.',
      },
      {
        question: 'What does a career application require?',
        answer:
          'The careers workflow requires a selected role, full name, email, LinkedIn profile, applicant consent to review the submitted profile, and a CV or resume upload.',
      },
      {
        question: 'Can candidates apply without sending secrets?',
        answer:
          "Yes. Candidates must share only professional information needed for recruitment evaluation. They must not include passwords, private keys, API keys, broker credentials, or confidential employer information.",
      },
    ],
  },
];

const quickLinks = [
  { href: '/careers', label: 'Careers', icon: BriefcaseBusiness },
  { href: '/data-room', label: 'Investor data room', icon: ShieldCheck },
  { href: '/developers', label: 'Developer center', icon: KeyRound },
];

export default function FAQPage() {
  return (
    <PageShell active="/faq">
      <PageIntro
        eyebrow="Help centre"
        title="Frequently asked questions"
        body="Practical answers for investors, platform customers, developers, candidates, and internal teams reviewing QSentia access, telemetry, security, and workflows."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-12 items-center justify-between gap-3 rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm font-semibold text-[#18181b] shadow-sm transition hover:border-[#18181b]"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#18181b]" />
                  {link.label}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {/* Quick Links Row */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[48px] items-center justify-between gap-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-955 dark:text-white transition hover:border-zinc-400 dark:hover:border-zinc-700 rounded-[8px]"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-zinc-550 shrink-0" />
                  {link.label}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-550 shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Sidebar & QA Accordions */}
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="self-start lg:sticky lg:top-24">
            <div className="border-l-2 border-[#d4d4d8] pl-4">
              <div className="text-xs font-bold uppercase tracking-wide text-[#71717a]">
                Categories
              </div>
              <nav className="mt-4 grid gap-2" aria-label="FAQ categories">
                {faqGroups.map((group) => (
                  <a
                    key={group.title}
                    href={`#${slugify(group.title)}`}
                    className="text-sm leading-6 text-[#52525b] transition hover:text-[#18181b]"
                  >
                    {group.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="grid gap-8">
            {faqGroups.map((group) => {
              const Icon = group.icon;
              return (
                <SectionCard
                  key={group.title}
                  className="p-6 md:p-8 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[12px]"
                >
                  <section id={slugify(group.title)} className="scroll-mt-24">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4f4f5] text-[#18181b]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-2xl font-semibold text-[#09090b]">
                        {group.title}
                      </h2>
                    </div>
                    <div className="mt-6 divide-y divide-[#e4e4e7] border-y border-[#e4e4e7]">
                      {group.items.map((item) => (
                        <details key={item.question} className="group py-5">
                          <summary className="cursor-pointer list-none text-base font-semibold text-[#09090b] marker:hidden">
                            <span className="flex items-start justify-between gap-4">
                              {item.question}
                              <span className="mt-1 text-[#18181b] transition group-open:rotate-90">
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </span>
                          </summary>
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#52525b]">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                </SectionCard>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
