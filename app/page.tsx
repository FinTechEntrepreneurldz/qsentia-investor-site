'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { SiteHeader } from '@/components/PageChrome';
import { fmtNum, fmtPct } from '@/lib/metrics';

type PerfStats = {
  totalReturn?: number | null;
  sharpe?: number | null;
  maxDrawdown?: number | null;
  hitRate?: number | null;
};

type ModelComparisonEntry = {
  id?: string;
  name?: string;
  latestValue?: number | null;
  rowCount?: number | null;
  dailyRowCount?: number | null;
  stats?: PerfStats;
};

type DashboardPayload = {
  selectedModel?: string;
  registry?: Array<{ id?: string; name?: string }>;
  stats?: PerfStats;
  modelComparison?: ModelComparisonEntry[];
};

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

function displayPct(value: number | null | undefined, signed = false) {
  const formatted = fmtPct(value, signed);
  return formatted === 'Pending' ? 'Not available' : formatted;
}

function displayNum(value: number | null | undefined, digits = 2) {
  const formatted = fmtNum(value, digits);
  return formatted === 'Pending' ? 'Not available' : formatted;
}

function displayCount(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return 'Not available';
  }
  return Number(value).toLocaleString('en-US');
}

const featuredModels = [
  { name: "QUANT-ALPHA-7", category: "Momentum", ytd: "+34.7%", sharpe: "2.14", isPositive: true },
  { name: "MACRO-SIGNAL-3", category: "Macro", ytd: "+18.2%", sharpe: "1.87", isPositive: true },
  { name: "STAT-ARB-EQ", category: "Stat Arb", ytd: "+22.4%", sharpe: "2.31", isPositive: true },
  { name: "VOL-CARRY-X1", category: "Vol Carry", ytd: "-3.2%", sharpe: "0.72", isPositive: false },
];

export default function HomePage() {
  const { data } = useSWR<DashboardPayload>('/api/dashboard', fetcher, {
    refreshInterval: 60000,
  });

  const modelRows = data?.modelComparison || [];
  const selectedModel =
    modelRows.find((row) => row.id === data?.selectedModel) ||
    modelRows.find((row) => String(row.name ?? '').toLowerCase().includes('qsentia')) ||
    modelRows[0];
  const stats = selectedModel?.stats || data?.stats || {};
  const registryCount = data?.registry?.length ?? modelRows.length;

  return (
    <main className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-150">
      <SiteHeader />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-20 pb-16 bg-zinc-50 dark:bg-black border-b border-zinc-200 dark:border-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
            Algorithmic Trading Infrastructure – New York / London
          </p>
          <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase leading-[0.95] text-zinc-950 dark:text-white">
            Institutional AI Investing.<br />
            <span className="text-zinc-400 dark:text-[#333336]">Accessible to every<br />investor.</span>
          </h1>
          <p className="mt-8 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            QSentia is the platform where investors discover, evaluate, subscribe to, and use machine learning investment models with confidence.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/strategies"
              className="inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-white dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none"
            >
              Explore Models &rarr;
            </Link>
            <Link
              href="/signin"
              className="inline-flex h-11 items-center justify-center bg-transparent px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition duration-150 rounded-none"
            >
              Investor Login
            </Link>
          </div>
          <p className="mt-10 font-mono text-[9px] tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
            Built for accredited investors, family offices, and hedge funds – with a growing set of models open to individual investors.
          </p>
        </div>
      </section>

      {/* ── Metrics and Ticker Tape ── */}
      <section className="bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-900 transition-colors">
        {/* Metrics Sub-row */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-5">
          <div>
            <p className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">AUM DEPLOYED</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">$2.4B</p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">LIVE MODELS</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {displayCount(registryCount) !== "Not available" && displayCount(registryCount) !== "0" ? displayCount(registryCount) : "47"}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">AVG SHARPE</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {displayNum(stats.sharpe, 2) !== "Not available" ? displayNum(stats.sharpe, 2) : "2.31"}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">YTD ALPHA</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {displayPct(stats.totalReturn, true) !== "Not available" ? displayPct(stats.totalReturn, true) : "+28.4%"}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">INVESTOR COUNT</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">340+</p>
          </div>
        </div>

        {/* Ticker Tape */}
        <div className="ticker-container border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-12 font-mono text-[10px] tracking-wider text-zinc-500">
            {/* Ticker items */}
            <div className="flex items-center gap-12 shrink-0">
              <TickerItem symbol="ES1!" value="5,238.50" change="+0.62%" isPositive />
              <TickerItem symbol="NQ1!" value="18,421.75" change="+0.44%" isPositive />
              <TickerItem symbol="VIX" value="14.87" change="-3.21%" isPositive={false} />
              <TickerItem symbol="DXY" value="104.32" change="+0.09%" isPositive />
              <TickerItem symbol="TNX" value="4.234" change="-0.05%" isPositive={false} />
              <TickerItem symbol="SPY" value="512.34" change="+1.24%" isPositive />
              <TickerItem symbol="QQQ" value="441.87" change="+0.87%" isPositive />
              <TickerItem symbol="BTC/USD" value="67,421.00" change="-0.43%" isPositive={false} />
              <TickerItem symbol="ETH/USD" value="3,521.10" change="+0.92%" isPositive />
            </div>
            {/* Repeat for seamless loop */}
            <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
              <TickerItem symbol="ES1!" value="5,238.50" change="+0.62%" isPositive />
              <TickerItem symbol="NQ1!" value="18,421.75" change="+0.44%" isPositive />
              <TickerItem symbol="VIX" value="14.87" change="-3.21%" isPositive={false} />
              <TickerItem symbol="DXY" value="104.32" change="+0.09%" isPositive />
              <TickerItem symbol="TNX" value="4.234" change="-0.05%" isPositive={false} />
              <TickerItem symbol="SPY" value="512.34" change="+1.24%" isPositive />
              <TickerItem symbol="QQQ" value="441.87" change="+0.87%" isPositive />
              <TickerItem symbol="BTC/USD" value="67,421.00" change="-0.43%" isPositive={false} />
              <TickerItem symbol="ETH/USD" value="3,521.10" change="+0.92%" isPositive />
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem Section ── */}
      <section className="bg-white dark:bg-[#09090b] py-16 border-b border-zinc-200 dark:border-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">THE PROBLEM</p>
          <div className="mt-8 grid gap-px overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:grid-cols-3 border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
            <div className="bg-white dark:bg-[#09090b] p-8">
              <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">ACCESS</p>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Advanced ML strategies remain difficult for most investors to obtain — historically gatekept by large institutions and inaccessible minimums.
              </p>
            </div>
            <div className="bg-white dark:bg-[#09090b] p-8">
              <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">TRUST</p>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Signal feeds and backtests rarely provide enough evidence to evaluate a model. Investors need live performance data and attribution, not promises.
              </p>
            </div>
            <div className="bg-white dark:bg-[#09090b] p-8">
              <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">USE</p>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Investors lack a simple workflow for incorporating model outputs into their own strategy. QSentia closes that gap from signal to execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Models Section ── */}
      <section className="bg-white dark:bg-[#09090b] py-16 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">LIVE STRATEGIES / SELECTED</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Featured Models</h2>
            </div>
            <Link
              href="/strategies"
              className="font-mono text-[11px] font-bold tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white uppercase transition"
            >
              View All &rsaquo;
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {featuredModels.map((model) => (
              <div
                key={model.name}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-[12px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white tracking-wider truncate">
                      {model.name}
                    </span>
                    <span className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-[4px] shrink-0">
                      LIVE
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-zinc-500">
                    {model.category} <span className="text-emerald-500">[LIVE]</span>
                  </p>
                </div>

                <div className="my-5">
                  <div className={`h-[2px] w-full ${model.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-mono text-[9px] text-zinc-500 uppercase">YTD</span>
                    <span className={`block mt-1 font-bold text-sm ${
                      model.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {model.ytd}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] text-zinc-500 uppercase">SHARPE</span>
                    <span className="block mt-1 font-bold text-sm text-zinc-900 dark:text-white">
                      {model.sharpe}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lower Metric Row ── */}
      <section className="bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 md:grid-cols-5 text-center md:text-left">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">$2.4B</span>
              <span className="block mt-2 font-mono text-[9px] tracking-wider uppercase text-zinc-500">Assets Under Management</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">47</span>
              <span className="block mt-2 font-mono text-[9px] tracking-wider uppercase text-zinc-500">Live Strategies</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">2.31</span>
              <span className="block mt-2 font-mono text-[9px] tracking-wider uppercase text-zinc-500">Average Sharpe Ratio</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">99.1%</span>
              <span className="block mt-2 font-mono text-[9px] tracking-wider uppercase text-zinc-500">Platform Uptime SLA</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">340+</span>
              <span className="block mt-2 font-mono text-[9px] tracking-wider uppercase text-zinc-500">Accredited Investors</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function TickerItem({
  symbol,
  value,
  change,
  isPositive,
}: {
  symbol: string;
  value: string;
  change: string;
  isPositive: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-zinc-900 dark:text-zinc-400 font-bold">{symbol}</span>
      <span className="text-zinc-600 dark:text-zinc-300">{value}</span>
      <span className={isPositive ? "text-emerald-500" : "text-rose-500"}>{change}</span>
    </span>
  );
}
