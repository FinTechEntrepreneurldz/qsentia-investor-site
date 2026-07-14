'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowRight, BarChart3, Database, Filter, Search, ShieldCheck } from 'lucide-react';
import { ApiLoadingPanel, EmptyState, PageShell, SectionCard } from '@/components/PageChrome';
import { PageIntro } from '@/components/InstitutionalShell';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

type Model = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  performance: {
    sharpeRatio: number | null;
    annualizedReturn: number | null;
    maxDrawdown: number | null;
    winRate: number | null;
  };
  pricing: string | null;
  accessStatus?: string;
  minimumCapital?: string | null;
  commercialUpdatedAt?: string;
  tags: string[];
  repo?: string | null;
  logsPath?: string | null;
};

type ModelsResponse = {
  models?: Model[];
};

function formatNum(value: number | null | undefined, digits = 2) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not available';
  return value.toFixed(digits);
}

function formatPct(value: number | null | undefined, signed = false) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not available';
  const prefix = signed && value > 0 ? '+' : '';
  return `${prefix}${(value * 100).toFixed(2)}%`;
}

function categoryLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function accessLabel(value: string | undefined) {
  if (!value) return null;
  return value
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function accessBadgeClass(value: string | undefined) {
  if (value === 'active') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  }
  if (value === 'private') {
    return 'border-zinc-200 bg-zinc-50 text-zinc-650 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400';
  }
  if (value === 'waitlist') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }
  if (value === 'retired') {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400';
  }
  return 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400';
}

export default function MarketplacePage() {
  const { data, error, isLoading } = useSWR<ModelsResponse>('/api/models', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const initialLoading = isLoading && !data;

  const models = useMemo(() => data?.models || [], [data?.models]);
  const categories = useMemo(
    () => ['all', ...Array.from(new Set(models.map((model) => model.category))).sort()],
    [models]
  );

  const filteredModels = models.filter((model) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageShell active="/marketplace">
      <PageIntro
        eyebrow="Model registry"
        title="Trading model products, sourced from live telemetry"
        body="Browse registered strategies with source-backed metrics. Missing performance values remain unavailable until repository logs publish the required observations."
      />

      {/* ── Search & Filter Panel ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionCard className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Filter by model, strategy, tag, or repository..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-3 pl-12 pr-4 font-mono text-xs uppercase tracking-wider text-zinc-950 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-650 transition"
              />
            </div>

            <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-none border px-3 py-2 font-mono text-[9px] font-bold tracking-widest uppercase transition ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {category === 'all' ? 'All models' : categoryLabel(category)}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>
      </section>

      {/* ── Models Grid ── */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        {initialLoading && (
          <ApiLoadingPanel
            title="Loading model marketplace"
            body="Preparing registered strategies, source metrics, categories, and model access details."
            items={['Registered models', 'Source metrics', 'Access details']}
          />
        )}

        {error && (
          <EmptyState
            title="Model registry unavailable"
            body="The model list API did not respond successfully. Reload the page or check the API connection."
          />
        )}

        {!initialLoading && !error && filteredModels.length === 0 && (
          <EmptyState
            title="No matching models"
            body="Try a broader search or choose a different category."
          />
        )}

        {!initialLoading && !error && filteredModels.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <Link key={model.id} href={`/marketplace/${model.slug}`} className="group flex flex-col h-full">
                <SectionCard className="flex h-full flex-col p-6 transition group-hover:border-zinc-400 dark:group-hover:border-zinc-650 justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                          {categoryLabel(model.category)}
                        </span>
                        {model.commercialUpdatedAt && (
                          <span
                            className={`rounded-[4px] border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${accessBadgeClass(
                              model.accessStatus
                            )}`}
                          >
                            {accessLabel(model.accessStatus)}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500 transition group-hover:translate-x-1 group-hover:text-zinc-950 dark:group-hover:text-white" />
                    </div>

                    <h2 className="mt-5 font-mono text-base sm:text-lg font-bold tracking-wider text-zinc-950 dark:text-white uppercase truncate">
                      {model.name}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {model.description}
                    </p>
                  </div>

                  <div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <Metric label="Sharpe" value={formatNum(model.performance.sharpeRatio)} />
                      <Metric label="Annualized" value={formatPct(model.performance.annualizedReturn, true)} />
                      <Metric label="Drawdown" value={formatPct(model.performance.maxDrawdown, true)} />
                      <Metric label="Win rate" value={formatPct(model.performance.winRate)} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {model.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 font-mono text-[8px] tracking-wider uppercase text-zinc-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-zinc-200 dark:border-zinc-850 pt-5 flex justify-between items-end">
                      <div>
                        <div className="font-mono text-[9px] font-bold tracking-wider uppercase text-zinc-500">
                          Access
                        </div>
                        <div className="mt-1 font-mono text-sm font-bold text-zinc-950 dark:text-white leading-none">
                          {model.pricing || 'Contact sales'}
                        </div>
                      </div>
                      {model.minimumCapital && (
                        <div className="font-mono text-[9px] tracking-wide text-zinc-400 dark:text-zinc-500 leading-none">
                          Min: {model.minimumCapital}
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Info Cards Section ── */}
      <section className="border-y border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black transition-colors">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
          <InfoCard icon={<Database className="h-5 w-5" />} title="Registry-backed">
            Names, categories, repositories, and log paths are sourced through the live model API.
          </InfoCard>
          <InfoCard icon={<BarChart3 className="h-5 w-5" />} title="No synthetic metrics">
            Performance values remain unavailable until the model has enough source observations.
          </InfoCard>
          <InfoCard icon={<ShieldCheck className="h-5 w-5" />} title="Audit context">
            Detail pages preserve source, status, and latest telemetry fields for review.
          </InfoCard>
        </div>
      </section>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-black/40 p-3">
      <div className="font-mono text-[9px] tracking-wider uppercase text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">{value}</div>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <SectionCard className="p-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
        {icon}
      </span>
      <h2 className="mt-5 font-mono text-sm font-bold tracking-wider text-zinc-950 dark:text-white uppercase">
        {title}
      </h2>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>
    </SectionCard>
  );
}
