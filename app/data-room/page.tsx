import type { Metadata } from 'next';
import { FileCheck2, FileLock2 } from 'lucide-react';
import InvestorQualificationForm from '@/components/InvestorQualificationForm';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = { title: 'Strategy Diligence Room | QSentia' };

const documents = [
  'Model evidence summaries',
  'Performance methodology',
  'Risk analytics overview',
  'Signal and trade-log samples',
  'Attribution framework',
  'Broker-readiness workflow',
  'API access overview',
  'Platform security overview',
];

export default function DataRoomPage() {
  return (
    <PageShell active="/data-room">
      <PageIntro
        eyebrow="Model access request"
        title="Strategy Diligence Room"
        body="Request access to model evidence, platform workflow materials, and subscription-readiness information. This is a SaaS model-access workflow, not a fund offering or capital-raising data room."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold text-[#09090b] dark:text-white">Diligence materials</h2>
          <div className="mt-5 divide-y divide-[#e4e4e7] border-y border-[#e4e4e7] dark:divide-zinc-800 dark:border-zinc-800">
            {documents.map((doc) => (
              <div key={doc} className="flex items-center justify-between gap-3 py-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#27272a] dark:text-zinc-200">
                  <FileCheck2 className="h-4 w-4 text-[#18181b] dark:text-zinc-200" />
                  {doc}
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#71717a]">
                  <FileLock2 className="h-4 w-4 text-[#a1a1aa]" />
                  Access controlled
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#71717a]">
            QSentia venture fundraising materials, if any, are kept separate from customer model-access materials.
          </p>
        </div>
        <SectionCard className="p-6 sm:p-8">
          <div className="text-xs font-bold uppercase tracking-wide text-[#18181b] dark:text-zinc-200">
            Subscription access
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-[#09090b] dark:text-white">
            Request model access
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#52525b] dark:text-zinc-400">
            Tell us how you plan to use QSentia, which model categories matter, and what platform access your team needs.
          </p>
          <div className="mt-7">
            <InvestorQualificationForm />
          </div>
        </SectionCard>
      </section>
    </PageShell>
  );
}
