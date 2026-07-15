import type { Metadata } from 'next';
import { Building2, Layers3, Scale, SearchCheck } from 'lucide-react';
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
        title="Built at the intersection of finance, machine learning, and model governance"
        body="QSentia exists to make machine-learning investing accessible without asking investors to trust a black box."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionCard className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-zinc-200 bg-zinc-950 p-8 text-white dark:border-zinc-800 lg:border-b-0 lg:border-r">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white">
                <Layers3 className="h-5 w-5" />
              </div>
              <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
                Founder-market fit
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-normal md:text-4xl">
                From doctoral AI research to accountable investment model infrastructure.
              </h2>
            </div>
            <div className="p-8 md:p-10">
              <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                QSentia was founded to make machine-learning investing accessible
                without asking investors to trust a black box. Founder and CEO
                Lucas Zarzeczny is a doctoral researcher in machine learning,
                artificial intelligence, and quantitative finance and has built
                enterprise AI platforms across financial services and technology.
              </p>
              <p className="mt-6 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                He personally designed and built QSentia&apos;s first nine
                investment models and leads the company&apos;s product,
                research, and technical architecture. QSentia&apos;s long-term
                goal is to become the trusted platform through which investors
                access, evaluate, monitor, and use machine-learning investment
                models.
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Value icon={<SearchCheck />} title="Research philosophy" body="Treat every result as a claim that needs source data, methodology, and repeatable evidence." />
          <Value icon={<Scale />} title="Operating discipline" body="Separate model research, commercial approval, risk review, and production publication." />
          <Value icon={<Building2 />} title="Institutional objective" body="Make model diligence and execution monitoring legible to investors and platform customers." />
        </div>
      </section>
    </PageShell>
  );
}

function Value({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <SectionCard className="p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4f4f5] text-[#18181b] [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <h2 className="mt-5 text-xl font-semibold text-[#09090b]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#52525b]">{body}</p>
    </SectionCard>
  );
}
