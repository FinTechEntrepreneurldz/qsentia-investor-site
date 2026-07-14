'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { BarChart3, Clock3, Gauge, Layers3 } from 'lucide-react';
import { ApiLoadingPanel, EmptyState, SectionCard } from '@/components/PageChrome';
import { fmtNum, fmtPct } from '@/lib/metrics';

type Model = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category?: string;
  accessStatus?: string;
  performance?: {
    sharpeRatio?: number | null;
    annualizedReturn?: number | null;
    maxDrawdown?: number | null;
    winRate?: number | null;
  };
};

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load strategy registry');
  return response.json();
};

function metric(value: string) {
  return value === 'Pending' ? 'Not reported' : value;
}

export default function StrategyDirectory() {
  const { data, error, isLoading } = useSWR<{ models?: Model[] }>('/api/models', fetcher, {
    refreshInterval: 60000,
  });

  if (isLoading && !data) {
    return (
      <ApiLoadingPanel
        title="Loading strategy registry"
        items={['Model cards', 'Performance fields', 'Operating status']}
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Strategy registry unavailable"
        body="The live models endpoint could not be reached. No replacement figures are shown."
      />
    );
  }

  const models = data?.models || [];
  if (!models.length) {
    return (
      <EmptyState
        title="No published strategies"
        body="Approved models will appear here after publication through the model registry."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {models.map((model) => {
        const isLive =
          String(model.accessStatus).toLowerCase() === 'public' ||
          String(model.accessStatus).toLowerCase() === 'live';

        return (
          <SectionCard key={model.id} className="flex h-full flex-col p-6 justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                  {model.category || 'Systematic strategy'}
                </span>
                <span
                  className={`inline-flex items-center border font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-[4px] ${
                    isLive
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {model.accessStatus || 'Not reported'}
                </span>
              </div>
              <h2 className="mt-4 font-mono text-lg sm:text-xl font-bold tracking-wider text-zinc-950 dark:text-white uppercase truncate">
                {model.name}
              </h2>
              <p className="mt-3 min-h-20 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {model.description}
              </p>
            </div>

            <div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Mini
                  icon={<BarChart3 />}
                  label="Return"
                  value={metric(fmtPct(model.performance?.annualizedReturn, true))}
                />
                <Mini
                  icon={<Gauge />}
                  label="Sharpe"
                  value={metric(fmtNum(model.performance?.sharpeRatio, 2))}
                />
                <Mini
                  icon={<Layers3 />}
                  label="Drawdown"
                  value={metric(fmtPct(model.performance?.maxDrawdown, true))}
                />
                <Mini icon={<Clock3 />} label="Holding" value="Not reported" />
              </div>

              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-850 pt-4 flex justify-end">
                <Link
                  href={`/strategies/${model.slug}`}
                  className="font-mono text-[11px] font-bold tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white uppercase transition"
                >
                  Review strategy &rarr;
                </Link>
              </div>
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-black/40 p-3">
      <span className="block h-4 w-4 text-zinc-400 dark:text-zinc-500 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <div className="mt-3 font-mono text-[9px] tracking-wider uppercase text-zinc-500">{label}</div>
      <div className="mt-1 truncate font-mono text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">{value}</div>
    </div>
  );
}
