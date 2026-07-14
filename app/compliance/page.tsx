import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cookie,
  FileCheck2,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PageIntro } from "@/components/InstitutionalShell";
import { PageShell } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "Compliance Centre | QSentia",
  description:
    "QSentia privacy, cookie, acceptable-use, and commercial policy centre.",
};

const policies = [
  {
    href: "/privacy-policy",
    title: "Privacy Policy",
    body: "Personal-data notice, purposes, sharing, retention, rights, and grievances.",
    icon: ShieldCheck,
  },
  {
    href: "/cookie-policy",
    title: "Cookie Policy",
    body: "Cookie inventory, optional categories, durations, and consent controls.",
    icon: Cookie,
  },
  {
    href: "/data-protection",
    title: "GDPR & US Privacy",
    body: "Privacy governance, rights requests, consent, processors, breaches, and readiness.",
    icon: FileCheck2,
  },
  {
    href: "/acceptable-use-policy",
    title: "Acceptable Use",
    body: "Authorized use of models, APIs, data, brokers, automation, and infrastructure.",
    icon: Scale,
  },
  {
    href: "/refund-cancellation-policy",
    title: "Billing & Cancellation",
    body: "Trials, renewals, cancellations, refunds, invoices, and enterprise terms.",
    icon: CheckCircle2,
  },
];

const programme = [
  [
    "Company and regulatory status",
    "Pre-launch disclosure",
    "QSentia LLC operates the public website and platform surfaces. The public site does not state that QSentia is registered as an investment adviser, broker, commodity trading adviser, exchange, or fund manager.",
  ],
  [
    "Current product boundaries",
    "Research and platform workflow",
    "The current public experience presents research infrastructure, model telemetry, diligence workflows, API surfaces, and account/customer operations. It does not itself grant live discretionary trading authority.",
  ],
  [
    "Backtest, paper, and live definitions",
    "Separated",
    "Backtests and simulations are historical or hypothetical. Paper trading is non-client execution or simulated execution. Live trading, if enabled, requires separate account authorization, risk controls, broker readiness, and legal review.",
  ],
  [
    "Performance-presentation policy",
    "Source-backed",
    "Performance pages distinguish source observations, benchmarks, drawdown, rolling measures, and missing values. Missing source data remains visible rather than being replaced with unsupported figures.",
  ],
  [
    "Model-creator approval standards",
    "Controlled access",
    "Models require source identification, methodology review, telemetry availability, and operating-status review before they are presented as published platform products.",
  ],
  [
    "Conflicts and compensation",
    "Disclosure required before paid access",
    "QSentia may receive subscription, enterprise, model-access, onboarding, support, or usage-based revenue. Brokerage, model-provider, and referral compensation must be disclosed when applicable.",
  ],
  [
    "Record retention",
    "Operational baseline",
    "The site maintains privacy, support, audit, account, and security retention principles in the Privacy Policy. Contract-specific retention may be set in customer agreements.",
  ],
  [
    "Complaints and escalation",
    "Contact channel active",
    "Users can submit privacy, compliance, support, or commercial complaints through inquiries@qsentia.com or the contact page. QSentia verifies account-related requests before action.",
  ],
  [
    "Market-data and model-IP rights",
    "Provider dependent",
    "Market data, source logs, model code, and generated outputs remain subject to applicable data, repository, model-provider, and customer agreements.",
  ],
  [
    "Supported jurisdictions",
    "Limited by review",
    "Access is limited where legal, regulatory, data, brokerage, or operational requirements are not satisfied.",
  ],
  [
    "Brokerage and execution status",
    "Not enabled by the public site",
    "The public website does not collect broker passwords or provide live trading authorization. Broker connection and execution workflows require separate controls before use.",
  ],
] as const;

export default function CompliancePage() {
  return (
    <PageShell active="/compliance">
      <PageIntro
        eyebrow="Trust centre"
        title="Compliance centre"
        body="QSentia's public policy set for privacy, security, consent, platform conduct, billing, and digital service delivery."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <Link
                key={policy.href}
                href={policy.href}
                className="group border border-[#e4e4e7] bg-white p-5 transition hover:border-[#18181b]"
              >
                <span className="flex h-10 w-10 items-center justify-center bg-[#f4f4f5] text-[#18181b]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-[#09090b]">
                  {policy.title}
                </h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#52525b]">
                  {policy.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#18181b]">
                  Read policy{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#e4e4e7] bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-wide text-[#71717a]">
              Programme status
            </div>
            <h2 className="mt-2 text-3xl font-semibold text-[#09090b]">
              Controls, evidence, and remaining work
            </h2>
          </div>
          <div className="mt-7 overflow-x-auto border border-[#e4e4e7] bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#e4e4e7] bg-[#fafafa] text-xs uppercase tracking-wide text-[#71717a]">
                <tr>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f5]">
                {programme.map(([area, status, position]) => (
                  <tr key={area}>
                    <td className="px-4 py-4 font-semibold text-[#09090b]">
                      {area}
                    </td>
                    <td className="px-4 py-4">
                      <span className="border border-[#d4d4d8] bg-[#f4f4f5] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#18181b]">
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 leading-6 text-[#52525b]">
                      {position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-6 text-[#52525b]">
            QSentia will update this matrix when the operating model, broker
            connectivity, paid subscriptions, model-provider terms, supported
            jurisdictions, or regulatory status changes.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
