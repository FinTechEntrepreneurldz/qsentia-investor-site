import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, FileText, Mail, ShieldCheck } from 'lucide-react';
import { ContactLeadForm } from '@/components/LeadCaptureForms';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Contact Us | QSentia',
  description: 'Institutional contact page for QSentia research, platform access, due diligence, and partnership inquiries.',
};

const inquiryTracks = [
  {
    title: 'Institutional access',
    text: 'Allocator introductions, platform walkthroughs, diligence review, and general institutional outreach.',
    icon: Building2,
  },
  {
    title: 'Model licensing',
    text: 'Commercial review for specific strategies, source repositories, telemetry coverage, and deployment workflow.',
    icon: FileText,
  },
  {
    title: 'Security and compliance',
    text: 'Do not send API keys, broker credentials, passwords, or private tokens by email. Use the inbox to arrange a secure path.',
    icon: ShieldCheck,
  },
];

const prepItems = [
  'Organization name and professional email',
  'Area of interest: dashboard, marketplace, research, or integration',
  'Models or workflows you want to review',
  'Target evaluation or deployment timeline',
  'Relevant compliance or operational constraints',
];

export default function ContactPage() {
  return (
    <PageShell active="/contact">
      <PageIntro
        eyebrow="Institutional contact"
        title="Contact QSentia"
        body="Use the published inbox for institutional access, model licensing, diligence coordination, and research-related outreach. Only currently published channels are listed here."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard className="p-6 md:p-8 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-550">
                Primary channel
              </div>
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-wider uppercase text-zinc-955 dark:text-white">
                Institutional inquiries inbox
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 p-5">
            <div className="font-mono text-[9px] font-bold tracking-wider uppercase text-zinc-550">
              Email
            </div>
            <a
              href="mailto:inquiries@qsentia.com?subject=QSentia%20Institutional%20Inquiry"
              className="mt-2 block font-mono text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white underline-offset-4 hover:underline leading-none"
            >
              inquiries@qsentia.com
            </a>
            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              If your request involves diligence, secure materials, or commercial review, initiate from your institutional email address.
            </p>
          </div>

          <ContactLeadForm />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:inquiries@qsentia.com?subject=QSentia%20Institutional%20Inquiry"
              className="inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none w-full sm:w-auto"
            >
              Start email inquiry
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
            <Link
              href="/marketplace"
              className="inline-flex h-11 items-center justify-center bg-transparent px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400 border border-zinc-350 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition rounded-none w-full sm:w-auto"
            >
              Review models first
            </Link>
          </div>
        </SectionCard>

        <SectionCard className="p-6 md:p-8 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px] h-fit">
          <div className="font-mono text-[9px] font-bold tracking-widest text-zinc-550 uppercase">
            Before you contact us
          </div>
          <h2 className="mt-2 font-mono text-base sm:text-lg font-bold tracking-wider text-zinc-955 dark:text-white uppercase">
            Include operational context
          </h2>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Clear initial context speeds up routing and keeps the conversation relevant to your review process.
          </p>
          <ul className="mt-6 space-y-3">
            {prepItems.map((item) => (
              <li
                key={item}
                className="rounded-[8px] border border-zinc-250 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 px-4 py-3 font-mono text-[10px] text-zinc-650 dark:text-zinc-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      {/* Inquiry Tracks at the bottom */}
      <section className="border-y border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black transition-colors">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
          {inquiryTracks.map((track) => {
            const Icon = track.icon;
            return (
              <SectionCard
                key={track.title}
                className="p-6 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px] flex flex-col justify-between h-full"
              >
                <div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-5 font-mono text-sm sm:text-base font-bold tracking-wider uppercase text-zinc-955 dark:text-white">
                    {track.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
                  {track.text}
                </p>
              </SectionCard>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
