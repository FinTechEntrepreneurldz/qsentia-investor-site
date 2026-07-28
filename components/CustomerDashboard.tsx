"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Landmark,
  LineChart as LineChartIcon,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MOCK_MARKETPLACE_MODELS } from "@/lib/mockMarketplace";
import type { MarketplaceModel } from "@/lib/modelCatalog";

type CustomerUser = {
  name: string;
  email: string;
  organization: string;
};

type HoldingSeed = {
  modelId: string;
  invested: number;
  investedAt: string;
  risk: "Low" | "Medium" | "High";
};

type Holding = HoldingSeed & {
  model: MarketplaceModel;
  current: number;
  dayReturn: number;
  totalReturn: number;
};

const WALLET_BALANCE = 47850;

const HOLDING_SEEDS: HoldingSeed[] = [
  { modelId: "model_c_etf", invested: 42000, investedAt: "2026-02-14", risk: "Medium" },
  { modelId: "crypto_sentiment_mlp", invested: 17500, investedAt: "2026-03-05", risk: "High" },
  { modelId: "qsentia_eth_micro_futures_sentiment_alpha", invested: 15260, investedAt: "2026-03-28", risk: "High" },
  { modelId: "brppo_fixed_income_regime", invested: 15000, investedAt: "2026-04-12", risk: "Low" },
];

const QUICK_AMOUNTS = [10000, 25000, 50000];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function pct(value: number | null | undefined) {
  if (value === null || value === undefined) return "n/a";
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;
}

function compactDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function modelCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildHoldings(): Holding[] {
  return HOLDING_SEEDS.map((seed) => {
    const model = MOCK_MARKETPLACE_MODELS.find((item) => item.id === seed.modelId) || MOCK_MARKETPLACE_MODELS[0];
    const modelReturn = model.performance.totalReturn || 0;
    const current = Math.round(seed.invested * (1 + modelReturn * 0.68));
    const dayReturn = Math.round(seed.invested * (modelReturn >= 0 ? 0.0026 : -0.0038));

    return {
      ...seed,
      model,
      current,
      dayReturn,
      totalReturn: current - seed.invested,
    };
  });
}

function buildChart(selected: Holding) {
  const start = selected.invested;
  const modelTotal = selected.model.performance.totalReturn || 0;
  const benchmarkTotal = modelTotal * 0.58;
  const points = selected.model.chart.length ? selected.model.chart : [{ timestamp: "2026-01-01", value: 100 }];

  return points.map((point, index) => {
    const progress = points.length === 1 ? 1 : index / (points.length - 1);
    const modelValue = Math.round(start * (point.value / 100));
    const benchmarkNoise = Math.sin(index * 0.8) * 0.008;
    const benchmarkValue = Math.round(start * (1 + benchmarkTotal * progress + benchmarkNoise));
    return {
      date: compactDate(point.timestamp),
      fullDate: point.timestamp,
      modelValue,
      benchmarkValue,
      investedValue: start,
    };
  });
}

function sparklinePath(points: Array<{ value: number }>) {
  if (points.length < 2) return "";
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 92;
      const y = 28 - ((value - min) / range) * 24;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function StatBlock({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const color =
    tone === "positive" ? "text-[#0F8F5A]" : tone === "negative" ? "text-[#c2413a]" : "text-[#171c24]";

  return (
    <div>
      <p className="text-[12px] font-medium text-[#7b8493]">{label}</p>
      <p className={`mt-1 text-[18px] font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function DashboardTab({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`border-b-2 px-1 pb-3 text-[13px] font-semibold transition ${
        active ? "border-[#0F8F5A] text-[#171c24]" : "border-transparent text-[#697386] hover:text-[#171c24]"
      }`}
    >
      {children}
    </button>
  );
}

export default function CustomerDashboard({ user }: { user: CustomerUser }) {
  const searchParams = useSearchParams();
  const queryModel = searchParams.get("model");
  const holdings = useMemo(() => buildHoldings(), []);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selected =
    holdings.find((holding) => holding.model.slug === (selectedSlug || queryModel)) ||
    holdings[0];

  const chartData = useMemo(() => buildChart(selected), [selected]);
  const investedValue = holdings.reduce((sum, holding) => sum + holding.invested, 0);
  const currentValue = holdings.reduce((sum, holding) => sum + holding.current, 0);
  const dayReturn = holdings.reduce((sum, holding) => sum + holding.dayReturn, 0);
  const totalReturn = currentValue - investedValue;
  const totalReturnPct = totalReturn / investedValue;
  const allocationPct = selected.current / currentValue;
  const modelTone = (selected.model.performance.totalReturn || 0) >= 0 ? "positive" : "negative";

  return (
    <div className="min-h-screen bg-[#F5F5F6] text-[#171c24]">
      <section className="border-b border-[#dfe4e1] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5 lg:px-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0F8F5A]">Investor workspace</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171c24]">
                Capital, models, and performance in one place
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-[#dfe4e1] bg-[#fafafa] px-3 text-[#7b8493]">
                <Search className="h-4 w-4" />
                <span className="text-[13px]">Search models, orders, reports</span>
                <span className="ml-auto text-[10px] font-semibold text-[#9aa1ad]">Ctrl+K</span>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe4e1] bg-white text-[#5a6270] transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-7 overflow-x-auto">
            <DashboardTab active>Holdings</DashboardTab>
            <DashboardTab>Explore models</DashboardTab>
            <DashboardTab>Wallet</DashboardTab>
            <DashboardTab>Orders</DashboardTab>
            <DashboardTab>Reports</DashboardTab>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-0">
        <section className="grid gap-5">
          <div className="rounded-lg border border-[#dfe4e1] bg-white">
            <div className="flex flex-col gap-6 border-b border-[#eef0ef] p-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8493]">Portfolio value</p>
                <div className="mt-2 flex items-end gap-3">
                  <h2 className="text-3xl font-semibold tracking-tight">{money(currentValue)}</h2>
                  <span className="pb-1 text-[13px] font-semibold text-[#0F8F5A]">{pct(totalReturnPct)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-7 md:grid-cols-3">
                <StatBlock label="Invested" value={money(investedValue)} />
                <StatBlock
                  label="1D returns"
                  value={`${dayReturn >= 0 ? "+" : ""}${money(dayReturn)}`}
                  tone={dayReturn >= 0 ? "positive" : "negative"}
                />
                <StatBlock
                  label="Total returns"
                  value={`${totalReturn >= 0 ? "+" : ""}${money(totalReturn)}`}
                  tone={totalReturn >= 0 ? "positive" : "negative"}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-[#eef0ef] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a93a1]">
                    <th className="px-5 py-4">Model</th>
                    <th className="px-5 py-4">Strategy</th>
                    <th className="px-5 py-4">Health</th>
                    <th className="px-5 py-4">Performance</th>
                    <th className="px-5 py-4 text-right">Current</th>
                    <th className="px-5 py-4 text-right">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => {
                    const isSelected = holding.model.slug === selected.model.slug;
                    const positive = holding.totalReturn >= 0;
                    return (
                      <tr
                        key={holding.model.id}
                        className={`cursor-pointer border-b border-[#eef0ef] transition hover:bg-[#fbfcfb] ${
                          isSelected ? "bg-[#f1f8f5]" : "bg-white"
                        }`}
                        onClick={() => setSelectedSlug(holding.model.slug)}
                      >
                        <td className="px-5 py-4">
                          <button type="button" className="text-left">
                            <span className="block max-w-[220px] text-[14px] font-semibold text-[#171c24]">
                              {holding.model.name}
                            </span>
                            <span className="mt-1 block text-[12px] text-[#697386]">
                              Allocated {compactDate(holding.investedAt)}
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#3a414b]">{modelCategory(holding.model.category)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              holding.risk === "Low"
                                ? "bg-[#e8f6ef] text-[#0F8F5A]"
                                : holding.risk === "Medium"
                                  ? "bg-[#fff8e5] text-[#8a6112]"
                                  : "bg-[#fff0ed] text-[#bd4238]"
                            }`}
                          >
                            {holding.risk} risk
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <svg viewBox="0 0 96 32" className="h-8 w-24" aria-hidden="true">
                            <path d={sparklinePath(holding.model.chart)} fill="none" stroke={positive ? "#0F8F5A" : "#c2413a"} strokeWidth="2.2" />
                          </svg>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="block text-[14px] font-semibold">{money(holding.current)}</span>
                          <span className="text-[12px] text-[#7b8493]">of {money(holding.invested)}</span>
                        </td>
                        <td className={`px-5 py-4 text-right text-[13px] font-semibold ${positive ? "text-[#0F8F5A]" : "text-[#c2413a]"}`}>
                          {positive ? "+" : ""}
                          {money(holding.totalReturn)}
                          <span className="block text-[12px] font-medium">{pct(holding.totalReturn / holding.invested)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-[#dfe4e1] bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8493]">Model vs benchmark</p>
                <h2 className="mt-2 text-xl font-semibold">{selected.model.name}</h2>
                <p className="mt-1 max-w-2xl text-[13px] leading-6 text-[#697386]">
                  Shows your allocation path from the investment date against {selected.model.benchmarkLabel || "benchmark"}.
                </p>
              </div>
              <div className="flex gap-4 text-[12px] text-[#697386]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0F8F5A]" />
                  QSentia model
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9aa1ad]" />
                  {selected.model.benchmarkLabel || "Benchmark"}
                </span>
              </div>
            </div>

            <div className="mt-6 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#eef0ef" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#7b8493", fontSize: 12 }} />
                  <YAxis
                    width={74}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#7b8493", fontSize: 12 }}
                    tickFormatter={(value) => money(Number(value))}
                  />
                  <Tooltip
                    cursor={{ stroke: "#dfe4e1", strokeWidth: 1 }}
                    contentStyle={{
                      border: "1px solid #dfe4e1",
                      borderRadius: 8,
                      boxShadow: "0 14px 40px rgba(20,28,24,0.12)",
                    }}
                    formatter={(value, name) => [
                      money(Number(value)),
                      name === "modelValue" ? "QSentia model" : name === "benchmarkValue" ? selected.model.benchmarkLabel || "Benchmark" : "Invested",
                    ]}
                  />
                  <ReferenceLine y={selected.invested} stroke="#cfd7d2" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="benchmarkValue" stroke="#9aa1ad" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="modelValue" stroke="#0F8F5A" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <aside className="grid content-start gap-5">
          <div className="rounded-lg border border-[#dfe4e1] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8493]">Selected model</p>
                <h2 className="mt-2 text-xl font-semibold leading-tight">{selected.model.name}</h2>
              </div>
              <Link
                href={`/marketplace/${selected.model.slug}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dfe4e1] text-[#5a6270] transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
                aria-label="Open model page"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-[#697386]">{selected.model.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 border-y border-[#eef0ef] py-4">
              <StatBlock label="Allocation" value={money(selected.current)} />
              <StatBlock label="Weight" value={`${(allocationPct * 100).toFixed(1)}%`} />
              <StatBlock label="Sharpe" value={String(selected.model.performance.sharpeRatio ?? "n/a")} />
              <StatBlock label="Model return" value={pct(selected.model.performance.totalReturn)} tone={modelTone} />
              <StatBlock label="Max drawdown" value={pct(selected.model.performance.maxDrawdown)} tone="negative" />
              <StatBlock label="Win rate" value={pct(selected.model.performance.winRate)} tone="positive" />
            </div>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0F8F5A] px-4 text-[13px] font-semibold text-white transition hover:bg-[#0b7549]"
              >
                <Plus className="h-4 w-4" />
                Add allocation
              </button>
              <Link
                href={`/marketplace/${selected.model.slug}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe4e1] bg-white px-4 text-[13px] font-semibold text-[#171c24] transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
              >
                View evidence and trade log
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div id="wallet" className="rounded-lg border border-[#dfe4e1] bg-white">
            <div className="flex border-b border-[#dfe4e1]">
              <button type="button" className="flex-1 border-b-2 border-[#0F8F5A] py-4 text-[13px] font-semibold text-[#0F8F5A]">
                Add money
              </button>
              <button type="button" className="flex-1 py-4 text-[13px] font-semibold text-[#697386]">Withdraw</button>
            </div>
            <div className="p-5 text-center">
              <p className="text-[12px] font-medium text-[#7b8493]">Available wallet balance</p>
              <div className="mt-2 text-4xl font-semibold tracking-tight">{money(WALLET_BALANCE)}</div>
              <div className="mt-5 flex justify-center gap-2">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="rounded-full border border-[#dfe4e1] px-3 py-2 text-[11px] font-semibold text-[#3a414b] transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
                  >
                    +{money(amount)}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-y border-[#eef0ef] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e2f4ec] text-[#0F8F5A]">
                  <Landmark className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">Verified bank transfer</p>
                  <p className="truncate text-[11px] text-[#7b8493]">HDFC Bank ending 6252</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9aa1ad]" />
              </div>
            </div>
            <div className="p-5">
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0F8F5A] text-[13px] font-semibold text-white transition hover:bg-[#0b7549]"
              >
                Add money
              </button>
            </div>
          </div>

          <div id="orders" className="rounded-lg border border-[#dfe4e1] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">Recent activity</h2>
              <Link href="#reports" className="text-[12px] font-semibold text-[#0F8F5A]">View all</Link>
            </div>
            <div className="mt-4 grid gap-4">
              {[
                ["Allocated to Model C ETF Regime Alpha", "-$12,000", "Today, 10:32 AM"],
                ["Wallet deposit settled", "+$25,000", "Yesterday"],
                ["Rebalanced ETH Futures Sentiment - Hourly sleeve", "$0", "Jul 15"],
              ].map(([label, amount, date]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F6] text-[#5a6270]">
                    <ReceiptText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{label}</p>
                    <p className="text-[11px] text-[#7b8493]">{date}</p>
                  </div>
                  <span className={`text-[13px] font-semibold ${amount.startsWith("+") ? "text-[#0F8F5A]" : "text-[#3a414b]"}`}>
                    {amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div id="reports" className="rounded-lg border border-[#dfe4e1] bg-white p-5">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0F8F5A]" />
                <div>
                  <p className="text-[13px] font-semibold">Execution control active</p>
                  <p className="text-[11px] text-[#7b8493]">Trades execute from wallet-funded allocations after model approval.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LineChartIcon className="h-5 w-5 text-[#0F8F5A]" />
                <div>
                  <p className="text-[13px] font-semibold">Daily reports ready</p>
                  <p className="text-[11px] text-[#7b8493]">Returns, benchmark, trades, and model health are grouped per allocation.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-[#0F8F5A]" />
                <div>
                  <p className="text-[13px] font-semibold">Cash is not auto-allocated</p>
                  <p className="text-[11px] text-[#7b8493]">Investor chooses model and amount before capital goes live.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-10 lg:px-0">
        <div className="rounded-lg border border-[#dfe4e1] bg-white p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <WalletCards className="h-5 w-5 text-[#0F8F5A]" />
              <div>
                <p className="text-[13px] font-semibold">Signed in as {user.name}</p>
                <p className="text-[11px] text-[#7b8493]">{user.email} | {user.organization}</p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe4e1] px-4 text-[12px] font-semibold text-[#3a414b] transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
            >
              Account controls
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
