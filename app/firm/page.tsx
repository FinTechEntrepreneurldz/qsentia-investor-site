import type { Metadata } from 'next';
import { Building2, Scale, SearchCheck } from 'lucide-react';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Investment Management Firm | QSentia',
  description:
    'QSentia is a systematic investment-management firm developing machine-learning equity strategies with source-backed transparency and disciplined risk controls.',
};

export default function FirmPage() {
  return (
    <PageShell active="/firm">
      <PageIntro
        eyebrow="Investment management firm"
        title="Systematic hedge fund strategies, operated with evidence"
        body="QSentia is building an investment-management company focused on machine-learning driven equity strategies. The firm pairs quantitative research with a platform layer that keeps evidence, controls, and operating state inspectable for investor review."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 grid gap-px overflow-hidden rounded-[10px] border border-[#d7c18f] bg-[#d7c18f] md:grid-cols-4">
          {[
            ['Type', 'Systematic investment manager'],
            ['Mandate', 'Machine-learning equity strategies'],
            ['Investor access', 'Qualified investors only'],
            ['Regulatory status', 'To be confirmed by counsel'],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#0b1430] p-5 text-white">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-[#d7b56d]">
                {label}
              </div>
              <div className="mt-2 text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Value icon={<SearchCheck />} title="Investment research" body="Treat every return, signal, and model output as a claim that needs source data, methodology, and repeatable evidence." />
          <Value icon={<Scale />} title="Operating discipline" body="Separate research, risk review, investor materials, commercial approval, and production publication." />
          <Value icon={<Building2 />} title="Institutional objective" body="Make the fund mandate, risk controls, performance basis, and execution readiness legible to qualified investors." />
        </div>
        <SectionCard className="mt-6 p-6 md:p-8">
          <div className="text-xs font-bold uppercase tracking-wide text-[#8b6a1f]">
            Fund-first, platform-enabled
          </div>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-[#06130c]">
            QSentia leads with investment management and uses its platform as the transparency layer.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#5a685f]">
            The QSentia Platform supports the investment-management process by collecting
            portfolio observations, model decisions, benchmark context, and control-state
            evidence. That operating evidence is what makes strategy review, investor
            diligence, and partner licensing more accountable.
          </p>
        </SectionCard>
      </section>
    </PageShell>
  );
}

function Value({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <SectionCard className="p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#eef2ff] text-[#3d52da] [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <h2 className="mt-5 text-xl font-semibold text-[#06130c]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#5a685f]">{body}</p>
    </SectionCard>
  );
}
