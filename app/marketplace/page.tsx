'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronRight, LockKeyhole, ShieldCheck, WalletCards } from 'lucide-react';
import { SiteHeader } from '@/components/PageChrome';
import { MOCK_MARKETPLACE_MODELS } from '@/lib/mockMarketplace';
import type { MarketplaceModel } from '@/lib/modelCatalog';

const strategyFilters = ['Momentum', 'Macro', 'Stat Arb', 'Vol Carry', 'CTA / Trend', 'ML / Factor', 'HFT', 'Mean Reversion'];
const riskFilters = ['Low', 'Medium', 'High'];
const assetFilters = ['Equities', 'Multi-Asset', 'Derivatives', 'Futures', 'Crypto'];

function pct(value: number | null | undefined, signed = false) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'N/A';
  return `${signed && value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
}

function strategyName(category: MarketplaceModel['category']) {
  const map: Record<MarketplaceModel['category'], string> = {
    crypto: 'HFT',
    macro: 'Mean Reversion',
    sentiment: 'Stat Arb',
    equity: 'Momentum',
    'multi-strategy': 'Macro',
    'reinforcement-learning': 'Vol Carry',
  };

  return map[category] || 'ML / Factor';
}

function assetClass(model: MarketplaceModel) {
  if (model.category === 'crypto' || model.tags.includes('crypto')) return 'Crypto';
  if (model.tags.includes('futures') || model.category === 'sentiment') return 'Futures';
  if (model.category === 'macro') return 'Multi-Asset';
  if (model.category === 'reinforcement-learning') return 'Derivatives';
  return 'Equities';
}

function riskLabel(model: MarketplaceModel) {
  const drawdown = Math.abs(model.performance.maxDrawdown || 0);
  if (drawdown < 0.05) return 'Low';
  if (drawdown < 0.1) return 'Medium';
  return 'High';
}

function shortName(model: MarketplaceModel) {
  const names: Record<string, string> = {
    model_c_etf: 'QUANT-ALPHA-7',
    crypto_sentiment_mlp: 'MACRO-SIGNAL-3',
    qsentia_eth_micro_futures_sentiment_alpha: 'STAT-ARB-EQ',
    br_ppo_crypto_v15: 'VOL-CARRY-X1',
    brppo_fixed_income_regime: 'MEAN-REV-INT',
  };

  return names[model.id] || model.name.toUpperCase().slice(0, 18);
}

function operatingMode(model: MarketplaceModel) {
  if (model.accessStatus === 'waitlist') return 'Paper';
  return 'Live';
}

function modelStatus(model: MarketplaceModel) {
  if (model.accessStatus === 'active') return 'Allocation-ready';
  if (model.accessStatus === 'waitlist') return 'Waitlist';
  return 'Review';
}

function sparklinePath(model: MarketplaceModel) {
  const values = model.chart.map((point) => point.value);
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 72;
      const y = 24 - ((value - min) / spread) * 20;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

type SessionPayload = {
  authenticated: boolean;
  user: null | {
    name?: string | null;
    email?: string | null;
    provider?: string | null;
  };
};

function allocationHref(model: MarketplaceModel, authenticated: boolean, sessionLoaded: boolean) {
  const modelHref = `/user/models/${model.slug}`;
  return authenticated || !sessionLoaded ? modelHref : `/signin?next=${encodeURIComponent(modelHref)}`;
}

export default function MarketplacePage() {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch('/api/auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: SessionPayload) => {
        if (mounted) setSession(payload);
      })
      .catch(() => {
        if (mounted) setSession({ authenticated: false, user: null });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredModels = useMemo(() => {
    return MOCK_MARKETPLACE_MODELS.filter((model) => {
      if (selectedStrategy && strategyName(model.category) !== selectedStrategy) return false;
      if (selectedRisk && riskLabel(model) !== selectedRisk) return false;
      if (selectedAsset && assetClass(model) !== selectedAsset) return false;
      return true;
    });
  }, [selectedAsset, selectedRisk, selectedStrategy]);

  const authenticated = Boolean(session?.authenticated && session.user);
  const sessionLoaded = session !== null;
  const hasFilters = Boolean(selectedStrategy || selectedRisk || selectedAsset);
  const walletHref = authenticated || !sessionLoaded ? '/user/wallet' : '/signin?next=%2Fuser%2Fwallet';
  const walletCta = session === null ? 'Checking wallet' : authenticated ? 'Open wallet' : 'Sign in to fund wallet';

  return (
    <main className="min-h-screen bg-[#F5F5F6] text-zinc-950 transition-colors duration-150 dark:bg-[#09090b] dark:text-zinc-50">
      <SiteHeader active="/marketplace" />

      <section className="border-b border-zinc-100 bg-[#F5F5F6] px-5 py-8 transition-colors dark:border-zinc-900 dark:bg-[#09090b] sm:py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#0F8F5A] dark:text-[#8ee0b8]">
              Model marketplace
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-[#171c24] dark:text-white sm:text-5xl">
              Explore ML trading models built for allocation.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Compare model health, return history, drawdown, Sharpe, win rate, fees, and minimum
              allocation before reserving capital from your investor wallet.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-[#111113] dark:text-zinc-300">
                {MOCK_MARKETPLACE_MODELS.length} live models
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-[#111113] dark:text-zinc-300">
                Evidence-first review
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-[#111113] dark:text-zinc-300">
                Wallet allocation flow
              </span>
            </div>
          </div>
          <section className="w-full rounded-[12px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-850 dark:bg-black">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#0F8F5A] ring-1 ring-zinc-200 dark:bg-[#111113] dark:text-[#8ee0b8] dark:ring-zinc-800">
                <WalletCards className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Investor wallet
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171c24] dark:text-white">
                  {authenticated ? 'Wallet ready for allocations.' : 'Fund once. Allocate with control.'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {authenticated
                    ? 'Manage wallet cash, review allocation reserves, and open your investment workspace.'
                    : 'Wallet balance, allocation reserves, KYC status, and execution activity stay inside the protected investor dashboard after login.'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-850 sm:grid-cols-2">
              <div className="rounded-[8px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-[#111113]">
                <LockKeyhole className="h-4 w-4 text-[#0F8F5A] dark:text-[#8ee0b8]" />
                <div className="mt-2 text-sm font-semibold text-[#171c24] dark:text-white">Protected capital</div>
                <p className="mt-1 text-xs leading-5 text-zinc-500">Balances and transactions appear only after login.</p>
              </div>
              <div className="rounded-[8px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-[#111113]">
                <ShieldCheck className="h-4 w-4 text-[#00A76F]" />
                <div className="mt-2 text-sm font-semibold text-[#171c24] dark:text-white">Evidence first</div>
                <p className="mt-1 text-xs leading-5 text-zinc-500">Review model metrics before reserving wallet capital.</p>
              </div>
            </div>
            <Link
              href={walletHref}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#171c24] px-5 text-sm font-semibold text-white transition hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {walletCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[12px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-850 dark:bg-black lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#171c24] dark:text-white">Filters</h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedStrategy(null);
                  setSelectedRisk(null);
                  setSelectedAsset(null);
                }}
                className="text-xs font-semibold text-[#0F8F5A]"
              >
                Clear
              </button>
            ) : null}
          </div>
          <FilterGroup
            title="Strategy"
            items={strategyFilters}
            selected={selectedStrategy}
            onSelect={setSelectedStrategy}
          />
          <FilterGroup title="Risk level" items={riskFilters} selected={selectedRisk} onSelect={setSelectedRisk} />
          <FilterGroup title="Asset class" items={assetFilters} selected={selectedAsset} onSelect={setSelectedAsset} />
        </aside>

        <div className="overflow-hidden rounded-[12px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-850 dark:bg-black">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-5 dark:border-zinc-900">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Available strategies</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">{filteredModels.length} models</h2>
            </div>
            <p className="text-sm text-zinc-500">Click a model to review evidence before allocation.</p>
          </div>

          <div className="grid gap-3 p-4 lg:hidden">
            {filteredModels.map((model) => (
              <ModelMobileCard
                key={model.id}
                model={model}
                authenticated={authenticated}
                sessionLoaded={sessionLoaded}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1040px] border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:border-zinc-900 dark:text-zinc-600">
                <th className="px-6 py-5 font-normal">Model</th>
                <th className="px-6 py-5 font-normal">Strategy</th>
                <th className="px-6 py-5 font-normal">Asset class</th>
                <th className="px-6 py-5 font-normal">Min inv.</th>
                <th className="px-6 py-5 font-normal">YTD return</th>
                <th className="px-6 py-5 font-normal">Sharpe</th>
                <th className="px-6 py-5 font-normal">Max DD</th>
                <th className="px-6 py-5 font-normal">Win rate</th>
                <th className="px-6 py-5 font-normal">Chart</th>
                <th className="px-6 py-5 font-normal" />
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model) => {
                const positive = (model.performance.totalReturn || 0) >= 0;
                return (
                  <tr key={model.id} className="group border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-white/[0.03]">
                    <td className="px-6 py-5">
                      <Link
                        href={`/marketplace/${model.slug}`}
                        className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.08em] text-[#171c24] transition hover:text-[#0F8F5A] dark:text-white dark:hover:text-[#8ee0b8]"
                      >
                        {shortName(model)}
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                        <span className="text-emerald-600 dark:text-[#31f495]">Live</span>
                        <span className="text-zinc-400 dark:text-zinc-600">[{operatingMode(model)}]</span>
                        <span className="text-emerald-600 dark:text-[#31f495]">{modelStatus(model)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-500 dark:text-zinc-500">{strategyName(model.category)}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500 dark:text-zinc-500">{assetClass(model)}</td>
                    <td className="px-6 py-5 font-mono text-sm text-zinc-500 dark:text-zinc-500">{model.minimumCapital || '$50,000'}</td>
                    <td className={`px-6 py-5 font-mono text-sm font-bold ${positive ? 'text-emerald-600 dark:text-[#31f495]' : 'text-rose-600 dark:text-[#ff4b4b]'}`}>
                      {pct(model.performance.totalReturn, true)}
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-[#171c24] dark:text-white">
                      {model.performance.sharpeRatio?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-rose-600 dark:text-[#ff4b4b]">
                      {pct(model.performance.maxDrawdown)}
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-zinc-500 dark:text-zinc-500">
                      {pct(model.performance.winRate)}
                    </td>
                    <td className="px-6 py-5">
                      <svg width="78" height="28" viewBox="0 0 78 28" aria-hidden="true">
                        <path
                          d={sparklinePath(model)}
                          fill="none"
                          stroke={positive ? '#00d595' : '#ff4b4b'}
                          strokeWidth="2"
                        />
                      </svg>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/marketplace/${model.slug}`}
                        className="inline-flex h-9 items-center justify-center rounded-[6px] border border-zinc-200 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#171c24] transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-white/[0.03]"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function ModelMobileCard({
  model,
  authenticated,
  sessionLoaded,
}: {
  model: MarketplaceModel;
  authenticated: boolean;
  sessionLoaded: boolean;
}) {
  const positive = (model.performance.totalReturn || 0) >= 0;

  return (
    <article className="rounded-[10px] border border-zinc-200 bg-white p-4 dark:border-zinc-850 dark:bg-[#050507]">
      <Link href={`/marketplace/${model.slug}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.08em] text-[#171c24] dark:text-white">
              {shortName(model)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{model.name}</p>
          </div>
          <span className="rounded-full bg-[#ECFDF3] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#027A48] dark:bg-[#052E1B] dark:text-[#7CE3B1]">
            {modelStatus(model)}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Metric label="Strategy" value={strategyName(model.category)} />
          <Metric label="Asset" value={assetClass(model)} />
          <Metric label="Min inv." value={model.minimumCapital || '$50,000'} />
          <Metric label="Sharpe" value={model.performance.sharpeRatio?.toFixed(2) || 'N/A'} />
          <Metric
            label="YTD return"
            value={pct(model.performance.totalReturn, true)}
            tone={positive ? 'positive' : 'negative'}
          />
          <Metric label="Max DD" value={pct(model.performance.maxDrawdown)} tone="negative" />
        </div>
      </Link>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/marketplace/${model.slug}`}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#171c24] px-4 text-sm font-semibold text-white"
        >
          Review model
        </Link>
        <Link
          href={allocationHref(model, authenticated, sessionLoaded)}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-[#171c24] dark:border-zinc-800 dark:text-white"
        >
          Allocate
        </Link>
      </div>
    </article>
  );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'positive' | 'negative' | 'neutral' }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400">{label}</div>
      <div
        className={`mt-1 font-mono text-sm font-bold ${
          tone === 'positive'
            ? 'text-[#00A76F]'
            : tone === 'negative'
              ? 'text-[#D92D20]'
              : 'text-[#171c24] dark:text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="mb-8">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-600">{title}</div>
      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(selected === item ? null : item)}
            className="flex w-full items-center gap-3 text-left text-sm text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"
          >
            <span
              className={`h-3.5 w-3.5 border ${
                selected === item ? 'border-[#0F8F5A] bg-[#0F8F5A]' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
