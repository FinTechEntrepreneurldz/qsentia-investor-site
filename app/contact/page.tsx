import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, FileText, Mail, ShieldCheck } from 'lucide-react';
import { ContactLeadForm } from '@/components/LeadCaptureForms';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell } from '@/components/PageChrome';

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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-[#09090b]">
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Primary channel</div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Institutional inquiries inbox</h2>
            </div>
          </div>

          <div className="mt-6 border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-[#09090b]">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Email</div>
            <a
              href="mailto:inquiries@qsentia.com?subject=QSentia%20Institutional%20Inquiry"
              className="mt-2 block text-2xl font-bold text-zinc-950 underline-offset-4 hover:underline dark:text-white"
            >
              inquiries@qsentia.com
            </a>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              If your request involves diligence, secure materials, or commercial review, initiate
              from your institutional email address.
            </p>
          </div>

          <ContactLeadForm />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:inquiries@qsentia.com?subject=QSentia%20Institutional%20Inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-none bg-zinc-950 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Start email inquiry
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center rounded-none border border-zinc-300 bg-transparent px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white"
            >
              Review models first
            </Link>
          </div>
        </div>

        <div className="border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black md:p-8">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Before you contact us</div>
          <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">Include operational context</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Clear initial context speeds up routing and keeps the conversation relevant to your review process.
          </p>
          <ul className="mt-6 space-y-3">
            {prepItems.map((item) => (
              <li key={item} className="border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:bg-[#09090b] dark:text-zinc-400">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
          {inquiryTracks.map((track) => {
            const Icon = track.icon;
            return (
              <div key={track.title} className="border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-[#09090b]">
                <span className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-black">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 text-xl font-bold text-zinc-950 dark:text-white">{track.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{track.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
