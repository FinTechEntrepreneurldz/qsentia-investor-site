import type { Metadata } from 'next';
import StrategyDirectory from '@/components/StrategyDirectory';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell } from '@/components/PageChrome';

export const metadata: Metadata = { title:'Fund Mandate & Strategies | QSentia', description:'QSentia systematic investment strategies, mandate context, risk controls, and source-backed performance fields.' };
export default function StrategiesPage(){return <PageShell active="/strategies"><PageIntro eyebrow="Fund & strategies" title="The fund mandate and published strategies" body="Review QSentia's systematic investment-management program through strategy objectives, instrument context, operating status, capacity context, and currently reported performance evidence. Fund terms and detailed materials are available through investor relations after qualification."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><StrategyDirectory/></section></PageShell>}
