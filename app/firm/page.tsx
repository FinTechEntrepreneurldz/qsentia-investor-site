import type { Metadata } from 'next';
import { Building2, Scale, SearchCheck } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Firm | QSentia',
  description: 'Operating principles, values, and objectives of systematic research and monitoring.',
};

export default function FirmPage() {
  return (
    <PageShell active="/firm">
      <PageIntro
        eyebrow="Firm"
        title="Systematic research, operated with accountability"
        body="QSentia develops model telemetry and systematic investment infrastructure around inspectable evidence, explicit controls, and disciplined change management."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Value
            icon={<SearchCheck />}
            title="Research philosophy"
            body="Treat every result as a claim that needs source data, methodology, and repeatable evidence."
          />
          <Value
            icon={<Scale />}
            title="Operating discipline"
            body="Separate model research, commercial approval, risk review, and production publication."
          />
          <Value
            icon={<Building2 />}
            title="Institutional objective"
            body="Make model diligence and execution monitoring legible to investors and platform customers."
          />
        </div>
      </section>
    </PageShell>
  );
}

function Value({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <SectionCard className="p-6 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px] flex flex-col justify-between h-full">
      <div>
        <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white [&>svg]:h-4.5 [&>svg]:w-4.5">
          {icon}
        </span>
        <h2 className="mt-5 font-mono text-sm sm:text-base font-bold tracking-wider uppercase text-zinc-955 dark:text-white">
          {title}
        </h2>
      </div>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
        {body}
      </p>
    </SectionCard>
  );
}
