import type { Metadata } from 'next';
import PerformanceCenter from '@/components/PerformanceCenter';
import { PageIntro } from '@/components/InstitutionalShell';
import { PageShell } from '@/components/PageChrome';
export const metadata: Metadata = { title:'Fund Performance Center | QSentia', description:'Source-backed fund strategy performance, benchmark, return, and drawdown analytics with net/gross context.' };
export default function PerformancePage(){return <PageShell active="/performance"><PageIntro eyebrow="Fund performance" title="Performance, with the method visible" body="Evaluate QSentia strategy returns, monthly outcomes, rolling risk, drawdown, and benchmark context from source-backed observations. Figures must be reviewed with their period, benchmark, and net or gross basis before any investor use."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><PerformanceCenter/></section></PageShell>}
