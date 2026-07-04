import type { Metadata } from 'next';
import RiskCenter from '@/components/RiskCenter';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell } from '@/components/PageChrome';
export const metadata: Metadata = { title:'Fund Risk Management | QSentia', description:'QSentia investment risk controls, observed states, and execution evidence.' };
export default function RiskPage(){return <PageShell active="/risk-management"><PageIntro eyebrow="Risk management" title="Controls before capital" body="Inspect the firm's risk framework for protecting investor capital: signal gates, position state, execution evidence, reconciliation, stale-data checks, and policy fields required before a strategy can operate with live capital."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><RiskCenter/></section></PageShell>}
