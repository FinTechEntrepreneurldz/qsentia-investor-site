import type { Metadata } from 'next';
import { PageShell } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Disclaimer | QSentia',
  description: 'Important legal and risk disclaimer for QSentia users.',
};

const sections = [
  ['Informational use only', 'QSentia content is provided for educational, research, diligence, and informational purposes only. It is not professional investment, legal, accounting, tax, or financial planning advice.'],
  ['Simulated and paper-trading results', 'Performance information may include backtests, simulations, paper-trading outputs, and hypothetical allocation models. Such results are not actual client returns and are not guarantees of future performance.'],
  ['No offer or solicitation', 'Nothing on the platform constitutes an offer to sell, a solicitation to buy, or a recommendation regarding any security, derivative, strategy, or investment product.'],
  ['No suitability assessment', 'QSentia does not determine whether a model, strategy, broker connection, asset class, account type, or allocation is suitable for any specific user unless a separate signed agreement expressly states otherwise. Users remain responsible for their own diligence and suitability review.'],
  ['No trading discretion through the public site', 'The public website and research interfaces do not grant QSentia discretionary authority to trade a user account. Any live trading, if enabled in the future, requires a separate account-connection workflow, user authorization, risk controls, and applicable legal review.'],
  ['Model creator responsibility', 'Third-party or contributor-created models remain the responsibility of their creators for strategy design, source data, methodology, disclosures, intellectual-property rights, and update discipline unless QSentia separately accepts responsibility in a signed agreement.'],
  ['Conflicts and compensation', 'QSentia may receive subscription, platform, enterprise, model-access, onboarding, support, or usage-based revenue. Revenue arrangements, model-provider relationships, brokerage relationships, and other conflicts will be disclosed where applicable before a paid or connected-account workflow is enabled.'],
  ['Risk warning', 'Trading and investing involve substantial risk, including potential loss of principal. Market conditions may change quickly, and model behavior can degrade under unseen regimes.'],
  ['Automated execution', 'Broker connections, schedulers, APIs, and automated order workflows introduce operational, connectivity, credential, slippage, liquidity, model, and human-oversight risks. Paper validation, capital limits, monitoring, approvals, and an accessible kill switch are essential but cannot eliminate loss.'],
  ['AI and model descriptions', 'QSentia describes machine learning, reinforcement learning, large-language-model, and conventional quantitative methods only where they are used in the relevant workflow. Users must not assume every model, page, or output uses AI merely because the platform supports AI-assisted research infrastructure.'],
  ['Regulatory status and jurisdiction limits', 'QSentia does not represent that publication of research, model access, software, or telemetry constitutes registration as an investment adviser, broker, commodity trading adviser, portfolio manager, exchange, or other regulated financial intermediary. Access may be unavailable in jurisdictions where legal, regulatory, brokerage, data, or operational requirements are not satisfied.'],
  ['Data and availability', 'QSentia does not warrant uninterrupted availability, data completeness, or error-free operation. Platform outputs may be delayed, unavailable, or inaccurate due to upstream dependencies.'],
  ['Limitation of liability', 'To the maximum extent permitted by law, QSentia and its operators are not liable for losses or damages arising from reliance on platform content, strategy outputs, service interruptions, or technical failures.'],
  ['User responsibility', 'You are solely responsible for your own decisions, due diligence process, and compliance with applicable laws and regulations in your jurisdiction.'],
] as const;

export default function DisclaimerPage() {
  return (
    <PageShell>
      <LegalHero title="Disclaimer" subtitle="Effective date: May 2026" />
      <LegalBody sections={sections} />
    </PageShell>
  );
}

function LegalHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
<<<<<<< HEAD
    <section className="border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
=======
    <section className="border-b border-[#E5E5E7] bg-[#F5F5F6]">
>>>>>>> origin/main
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          Legal notice
        </p>
        <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-6xl">{title}</h1>
        <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">{subtitle}</p>
      </div>
    </section>
  );
}

function LegalBody({ sections }: { sections: ReadonlyArray<readonly [string, string]> }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
<<<<<<< HEAD
      <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
=======
      <SectionCard className="divide-y divide-[#E5E5E7]">
>>>>>>> origin/main
        {sections.map(([title, body], index) => (
          <section key={title} className="py-7">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              Section {index + 1}
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-normal text-zinc-950 dark:text-white">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{body}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
