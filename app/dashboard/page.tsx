'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Percent,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import useSWR from 'swr';
import { PageShell } from '@/components/PageChrome';
import {
  SectionCard,
  EmptyState,
  ApiLoadingPanel,
  Eyebrow,
} from '@/components/PageChrome';

type CurveRange = '1M' | '3M' | 'YTD' | '1Y' | 'ALL';
type CurveMetric = 'equity' | 'drawdown';

const curveRanges: CurveRange[] = ['1M', '3M', 'YTD', '1Y', 'ALL'];
const curveMetrics = [
  { key: 'equity', label: 'Equity curve' },
  { key: 'drawdown', label: 'Drawdown' },
];

interface ModelStats {
  ytdReturn?: number;
  sharpe?: number;
  maxDrawdown?: number;
  nReturns?: number;
  totalReturn?: number;
  status?: string;
}

interface ModelEntry {
  id: string;
  name?: string;
  slug?: string;
  category?: string;
  performance?: {
    sharpeRatio?: number;
    annualizedReturn?: number;
    maxDrawdown?: number;
  };
  accessStatus?: string;
  dailyRowCount?: number;
  rowCount?: number;
  stats?: ModelStats;
}

interface PortfolioHistoryEntry {
  portfolioValue?: number;
  portfolioValueTimestamp?: string;
  paperStatus?: string;
  paperReplayStatus?: string;
  lastRun?: string;
  submittedOrderCount?: number;
}

interface BenchmarkEntry {
  ticker?: string;
  name?: string;
  stats?: {
    totalReturn?: number;
  };
  rowCount?: number;
}

interface ChartEntry {
  timestamp: string;
  equity: number;
  drawdown: number;
}

interface MetricTile {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const [selectedId, setSelectedModel] = useState<string>('mleq-v2');
  const [curveRange, setCurveRange] = useState<CurveRange>('YTD');
  const [curveMetric, setCurveMetric] = useState<CurveMetric>('equity');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    const timer = setTimeout(checkDark, 0);
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const { data, error, isLoading } = useSWR('/api/dashboard', fetcher);

  const registry: ModelEntry[] = useMemo(() => data?.modelRegistry || [], [data]);
  const activeModel = useMemo(
    () => registry.find((m: ModelEntry) => m.id === selectedId),
    [registry, selectedId]
  );
  const selectedName = activeModel?.name || selectedId;

  const portfolioRows: PortfolioHistoryEntry[] = useMemo(() => data?.portfolioHistory || [], [data]);
  const decisionRows = useMemo(() => data?.decisions || [], [data]);

  const latest: PortfolioHistoryEntry = useMemo(() => {
    if (!portfolioRows.length) return {} as PortfolioHistoryEntry;
    return portfolioRows[0];
  }, [portfolioRows]);

  const stats: ModelStats = useMemo(() => {
    if (!data?.stats) return {} as ModelStats;
    return data.stats[selectedId] || {};
  }, [data, selectedId]);

  const chartRows = useMemo(() => {
    if (!data?.chartData) return [];
    const series: ChartEntry[] = data.chartData[selectedId] || [];
    return series.map((item: ChartEntry) => ({
      timestamp: item.timestamp,
      value: curveMetric === 'equity' ? item.equity : item.drawdown,
    }));
  }, [data, selectedId, curveMetric]);

  const selectedCurveMetric = curveMetrics.find((m) => m.key === curveMetric)!;
  const hasChartRows = chartRows.length > 1;
  const initialLoading = isLoading && !error;

  const metricTiles: MetricTile[] = [
    {
      label: 'Portfolio value',
      value: fmtDollar(latest.portfolioValue),
      detail: latest.portfolioValueTimestamp
        ? `As of ${formatDate(latest.portfolioValueTimestamp)}`
        : 'Value history empty',
      icon: TrendingUp,
    },
    {
      label: 'YTD return',
      value: displayPct(stats.ytdReturn, true),
      detail: 'Annualized backtest performance',
      icon: Percent,
    },
    {
      label: 'Sharpe ratio',
      value: displayNum(stats.sharpe),
      detail: 'Risk-adjusted return ratio',
      icon: Calendar,
    },
    {
      label: 'Max drawdown',
      value: displayPct(stats.maxDrawdown, true),
      detail: `${displayCount(stats.nReturns ?? null)} return rows`,
      icon: ShieldCheck,
    },
  ];

  const tooltipStyle = {
    background: isDark ? '#1A1A1D' : '#ffffff',
    border: isDark ? '1px solid #27272a' : '1px solid #e4e4e7',
    borderRadius: '8px',
    color: isDark ? '#ffffff' : '#09090b',
    boxShadow: '0 16px 50px rgba(15,31,22,0.12)',
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: 600,
  };

  return (
    <PageShell active="/dashboard">
      {/* ── Title Banner ── */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
        <TechnicalBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Live dashboard</Eyebrow>
              <h1 className="mt-5 max-w-4xl text-4xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-955 dark:text-white md:text-6xl">
                QSentia telemetry terminal
              </h1>
              <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
                Live portfolio, model registry, benchmark, and execution data from the dashboard API.
                Source coverage, execution state, and portfolio observations remain available for review.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <Link
                href="/customer"
                className="inline-flex h-11 items-center justify-center bg-zinc-955 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none"
              >
                Open settings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-4 shadow-sm">
                <label className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500" htmlFor="model-select">
                  Selected model
                </label>
                <select
                  id="model-select"
                  value={selectedId}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  className="mt-2 w-full min-w-[280px] rounded-none border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 font-mono text-xs uppercase tracking-wider text-zinc-955 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-white transition"
                >
                  {registry.length ? (
                    registry.map((model: ModelEntry) => (
                      <option key={model.id} value={model.id}>
                        {model.name || model.id}
                      </option>
                    ))
                  ) : (
                    <option value={selectedId}>{selectedName}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {error && (
          <EmptyState
            title="Dashboard API unavailable"
            body="The dashboard endpoint did not respond successfully. Reload the page or check upstream connectivity."
          />
        )}

        {initialLoading && (
          <ApiLoadingPanel
            title="Loading dashboard telemetry"
            body="Preparing model registry, portfolio history, benchmarks, and execution rows."
            items={['Model registry', 'Equity curves', 'Execution audit']}
          />
        )}

        {!error && !initialLoading && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricTiles.map((metric: MetricTile) => {
                const Icon = metric.icon;
                return (
                  <SectionCard key={metric.label} className="relative overflow-hidden p-5">
                    <div aria-hidden className="absolute -right-5 -top-5 h-20 w-20 rounded-full border border-zinc-955/10 dark:border-white/10" />
                    <div aria-hidden className="absolute right-12 top-8 h-7 w-7 rotate-[18deg] rounded-[4px] border border-zinc-955/14 dark:border-white/14" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">{metric.label}</div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-white">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="mt-4 text-2xl font-semibold text-zinc-955 dark:text-white">{isLoading ? 'Loading' : metric.value}</div>
                      <div className="mt-2 min-h-5 text-xs leading-5 text-zinc-650 dark:text-zinc-400">{metric.detail}</div>
                    </div>
                  </SectionCard>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Fact label="Current model" value={selectedName} />
              <Fact label="Portfolio rows" value={displayCount(portfolioRows.length)} />
              <Fact label="Decision rows" value={displayCount(decisionRows.length)} />
              <Fact label="Last refresh" value={formatDate(data?.updatedAt)} />
            </div>
          </>
        )}
      </section>

      {!error && !initialLoading && (
        <>
          {/* ── Equity Curves Section ── */}
          <section className="relative overflow-hidden border-y border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
            <TechnicalBackdrop className="opacity-80" />
            <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]">
              <SectionCard className="p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-955 dark:text-white">Normalized equity curves</h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-550 dark:text-zinc-400">
                      Range and metric controls are computed from published portfolio observations.
                    </p>
                  </div>
                  <RefreshCw className="h-4 w-4 text-zinc-500" />
                </div>

                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                  <SegmentedControl
                    label="Range"
                    options={curveRanges.map((range) => ({ key: range, label: range }))}
                    value={curveRange}
                    onChange={(value) => setCurveRange(value as CurveRange)}
                  />
                  <SegmentedControl
                    label="Metric"
                    options={curveMetrics}
                    value={curveMetric}
                    onChange={(value) => setCurveMetric(value as CurveMetric)}
                  />
                </div>

                {hasChartRows ? (
                  <div className="h-[360px] overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-black p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartRows}>
                        <CartesianGrid stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }} minTickGap={24} />
                        <YAxis tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }} width={56} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <ReferenceLine
                          y={curveMetric === 'equity' ? 100 : 0}
                          stroke="currentColor"
                          className="text-zinc-300 dark:text-zinc-700"
                          strokeDasharray="4 4"
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={selectedCurveMetric.label}
                          stroke="#0F8F5A"
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 5, fill: '#0F8F5A', stroke: '#ffffff', strokeWidth: 2 }}
                          connectNulls
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    title={`${selectedCurveMetric.label} unavailable`}
                    body="The selected model has not published enough observations for this view."
                  />
                )}
              </SectionCard>

              {/* ── Execution Status Section ── */}
              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold text-zinc-955 dark:text-white">Execution status</h2>
                <dl className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  <InfoRow label="Paper status" value={latest.paperStatus || 'Not available'} />
                  <InfoRow label="Paper replay" value={latest.paperReplayStatus || 'Not available'} />
                  <InfoRow label="Last run" value={formatDate(latest.lastRun)} />
                  <InfoRow label="Portfolio timestamp" value={formatDate(latest.portfolioValueTimestamp)} />
                  <InfoRow label="Submitted orders" value={displayCount(latest.submittedOrderCount ?? data?.submittedOrders?.length ?? null)} />
                </dl>
              </SectionCard>
            </div>
          </section>

          {/* ── Comparison Sections ── */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold text-zinc-955 dark:text-white">Model registry comparison</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-[760px] text-left text-sm">
                    <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-550 dark:bg-zinc-900 dark:text-zinc-400">
                      <tr>
                        <th className="px-3 py-3">Model</th>
                        <th className="px-3 py-3 text-right">Rows</th>
                        <th className="px-3 py-3 text-right">Return</th>
                        <th className="px-3 py-3 text-right">Sharpe</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {(data?.modelComparison || []).map((model: ModelEntry) => (
                        <tr key={model.id || model.name}>
                          <td className="px-3 py-3 font-semibold text-zinc-955 dark:text-white">{model.name || model.id}</td>
                          <td className="px-3 py-3 text-right text-zinc-650 dark:text-zinc-300">{displayCount(model.dailyRowCount ?? model.rowCount ?? null)}</td>
                          <td className="px-3 py-3 text-right text-zinc-650 dark:text-zinc-300">{displayPct(model.stats?.totalReturn, true)}</td>
                          <td className="px-3 py-3 text-right text-zinc-650 dark:text-zinc-300">{displayNum(model.stats?.sharpe)}</td>
                          <td className="px-3 py-3 text-zinc-650 dark:text-zinc-300">{model.stats?.status || 'Not available'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!(data?.modelComparison || []).length && (
                    <EmptyState title="No registry rows" body="Model comparison rows are not available yet." />
                  )}
                </div>
              </SectionCard>

              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold text-zinc-955 dark:text-white">Benchmarks</h2>
                <div className="mt-5 space-y-3">
                  {(data?.benchmarks || []).length ? (
                    (data?.benchmarks || []).map((benchmark: BenchmarkEntry) => (
                      <div key={benchmark.ticker || benchmark.name} className="rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-zinc-955 dark:text-white">{benchmark.name || benchmark.ticker}</div>
                            <div className="mt-1 text-xs text-zinc-550 dark:text-zinc-400">{benchmark.ticker || 'Benchmark'}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-zinc-955 dark:text-white">{displayPct(benchmark.stats?.totalReturn, true)}</div>
                            <div className="mt-1 text-xs text-zinc-550 dark:text-zinc-400">{displayCount(benchmark.rowCount ?? null)} rows</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState title="No benchmark data" body="Benchmark rows are not available for this model yet." />
                  )}
                </div>
              </SectionCard>
            </div>
          </section>

          {/* ── Data Tables Section ── */}
          <section className="relative overflow-hidden border-y border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
            <TechnicalBackdrop className="opacity-60" />
            <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
              <DataTable title="Decisions" rows={data?.decisions || []} />
              <DataTable title="Submitted orders" rows={data?.submittedOrders || []} />
              <DataTable title="Planned orders" rows={data?.plannedOrders || []} />
              <DataTable title="Positions" rows={data?.positions || []} />
              <DataTable title="Target weights" rows={data?.targetWeights || []} />
              <DataTable title="Signal history" rows={data?.signalHistory || []} />
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}

function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ key: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-none border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2">
      <span className="shrink-0 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-550 dark:text-zinc-400">
        {label}
      </span>
      <div className="flex min-w-0 gap-1 overflow-x-auto">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`shrink-0 rounded px-3 py-1.5 text-xs font-semibold transition ${
              value === option.key
                ? 'border border-zinc-955 dark:border-white bg-white dark:bg-[#1A1A1D] text-zinc-955 dark:text-white'
                : 'border border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-150 dark:hover:bg-zinc-800'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <SectionCard className="p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-zinc-955 dark:text-white">{value}</div>
    </SectionCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3">
      <dt className="font-medium text-zinc-550 dark:text-zinc-400">{label}</dt>
      <dd className="break-words font-semibold text-zinc-955 dark:text-white">{value}</dd>
    </div>
  );
}

function DataTable({ title, rows }: { title: string; rows: Record<string, unknown>[] }) {
  const columns = useMemo(() => {
    const names = new Set<string>();
    rows.slice(0, 20).forEach((row) => Object.keys(row || {}).forEach((key) => names.add(key)));
    return Array.from(names).slice(0, 10);
  }, [rows]);

  return (
    <SectionCard>
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
        <h2 className="text-xl font-semibold text-zinc-955 dark:text-white">{title}</h2>
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-550 dark:text-zinc-400">{displayCount(rows.length)} rows</span>
      </div>
      {rows.length && columns.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-550 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-3">{prettyColumnName(column)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.slice(0, 50).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                     <td key={column} className="max-w-[280px] whitespace-normal break-words px-3 py-3 text-zinc-650 dark:text-zinc-300">
                      {formatCell(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-5">
          <EmptyState title={`No ${title.toLowerCase()} rows`} body="Rows are not available for this table yet." />
        </div>
      )}
    </SectionCard>
  );
}

function prettyColumnName(column: string) {
  return column
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Not available';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'Not available';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function fmtDollar(val: unknown) {
  if (val === null || val === undefined) return 'Not available';
  const num = Number(val);
  if (isNaN(num)) return 'Not available';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function displayPct(val: unknown, signed = false) {
  if (val === null || val === undefined) return 'Not available';
  const num = Number(val);
  if (isNaN(num)) return 'Not available';
  const text = (num * 100).toFixed(2) + '%';
  return signed && num > 0 ? '+' + text : text;
}

function displayNum(val: unknown) {
  if (val === null || val === undefined) return 'Not available';
  const num = Number(val);
  return isNaN(num) ? 'Not available' : num.toFixed(2);
}

function displayCount(val: unknown) {
  if (val === null || val === undefined) return 'Not available';
  const num = Number(val);
  return isNaN(num) ? 'Not available' : num.toLocaleString();
}

function formatDate(val: unknown) {
  if (!val) return 'Not available';
  try {
    const d = new Date(val as string | number | Date);
    if (isNaN(d.getTime())) return 'Not available';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return 'Not available';
  }
}

function TechnicalBackdrop({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none opacity-40 select-none bg-[radial-gradient(ellipse_at_top_right,rgba(113,113,122,0.12),transparent_50%)] ${className}`}
    />
  );
}
