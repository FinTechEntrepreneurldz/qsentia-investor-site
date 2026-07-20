"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Download,
  FileText,
  Gauge,
  Landmark,
  Layers3,
  MoreVertical,
  PieChart,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  buildInvestmentChart,
  compactDate,
  formatCompactMoney,
  formatMoney,
  formatPercent,
  formatSignedMoney,
  getInvestorHolding,
  getPortfolioSummary,
  type InvestmentChartRange,
  lineTone,
  QUICK_ADD_AMOUNTS,
  WALLET_BALANCE,
} from "@/lib/investorPortfolio";
import type { InvestorHolding } from "@/lib/investorPortfolio";

export type InvestorUser = {
  name: string;
  email: string;
  organization?: string | null;
};

type UserWorkspaceProps = {
  user: InvestorUser;
  view: "holdings" | "wallet" | "orders" | "reports" | "model";
  modelSlug?: string;
};

const tabs = [
  { label: "Explore", href: "/marketplace" },
  { label: "Holdings", href: "/user" },
  { label: "Wallet", href: "/user/wallet" },
  { label: "Orders", href: "/user/orders" },
  { label: "Reports", href: "/user/reports" },
];

const chartRanges: InvestmentChartRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "ALL"];

type PortfolioSummary = ReturnType<typeof getPortfolioSummary>;

type TelemetryMetric = {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "negative" | "neutral";
  icon: ComponentType<{ className?: string }>;
};

export function UserWorkspace({ view, modelSlug }: UserWorkspaceProps) {
  const pathname = usePathname();
  const modelHolding = getInvestorHolding(modelSlug);

  return (
    <div className="min-h-screen bg-[#F5F5F6] text-slate-950">
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#0F8F5A]">
              Investor workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#101820]">
              Portfolio command center
            </h1>
          </div>
          <nav className="flex max-w-full items-center gap-1 overflow-x-auto rounded-[6px] border border-slate-200 bg-white p-1 text-sm font-semibold text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
            {tabs.map((tab) => {
              const active = pathname === tab.href || (view === "model" && tab.href === "/user");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`whitespace-nowrap rounded-[4px] px-4 py-2.5 transition ${
                    active ? "bg-[#0F8F5A] text-white shadow-sm" : "text-slate-600 hover:bg-emerald-50 hover:text-[#0F8F5A]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {view === "holdings" && <HoldingsView />}
        {view === "wallet" && <WalletView />}
        {view === "orders" && <OrdersView />}
        {view === "reports" && <ReportsView />}
        {view === "model" && <ModelView holding={modelHolding} />}
      </main>
    </div>
  );
}

function HoldingsView() {
  const summary = getPortfolioSummary();

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Holdings ({summary.holdings.length})</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{formatMoney(summary.current)}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-slate-200 p-2 text-slate-600" type="button">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
              <button className="rounded-md border border-slate-200 p-2 text-slate-600" type="button">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-8 border-t border-dashed border-slate-200 pt-6 sm:grid-cols-4">
            <Metric label="Invested value" value={formatMoney(summary.invested)} />
            <Metric label="1D returns" value={`${formatSignedMoney(summary.dayReturn)} (${formatPercent(summary.dayReturnPct)})`} tone={summary.dayReturn} />
            <Metric label="Total returns" value={`${formatSignedMoney(summary.totalReturn)} (${formatPercent(summary.totalReturnPct)})`} tone={summary.totalReturn} />
            <Metric label="Subscriptions" value={`${summary.holdings.length} active`} />
          </div>
        </div>

        <PerformancePriorityGrid summary={summary} />

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[1.35fr_0.8fr_0.9fr_0.95fr_1fr_32px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Model</span>
              <span>Performance</span>
              <span>Returns</span>
              <span>Current</span>
              <span>Subscription</span>
              <span />
            </div>
            {summary.holdings.map((holding) => (
              <Link
                key={holding.model.id}
                href={`/user/models/${holding.model.slug}`}
                className="grid min-w-[900px] grid-cols-[1.35fr_0.8fr_0.9fr_0.95fr_1fr_32px] items-center gap-4 border-b border-slate-100 px-6 py-6 transition last:border-b-0 hover:bg-emerald-50/50"
              >
                <div>
                  <p className="font-semibold tracking-[-0.01em]">{holding.model.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {holding.units.toFixed(2)} units - Avg. {formatMoney(holding.avgNav)}
                  </p>
                </div>
                <MiniChart positive={holding.totalReturn >= 0} />
                <div>
                  <p className={`font-semibold ${lineTone(holding.totalReturn)}`}>{formatSignedMoney(holding.totalReturn)}</p>
                  <p className={`mt-1 text-xs ${lineTone(holding.ytdReturnPct)}`}>{formatPercent(holding.ytdReturnPct)}</p>
                </div>
                <div>
                  <p className="font-semibold">{formatMoney(holding.current)}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatMoney(holding.invested)} invested</p>
                </div>
                <div>
                  <p className="font-semibold">{commercialLabel(holding.model.pricing)}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {billingLabel(holding.model.billingInterval)} - Min. {holding.model.minimumCapital || "Review"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Wallet balance</p>
          <h2 className="mt-3 text-2xl font-semibold">{formatMoney(WALLET_BALANCE)}</h2>
          <Link
            href="/user/wallet"
            className="mt-5 flex items-center justify-center rounded-md bg-[#0F8F5A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0c774b]"
          >
            Add money
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Next action</p>
          <h2 className="mt-3 text-lg font-semibold">Review model-level performance before allocating more capital.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Open a holding to compare your entry value against the model path and benchmark.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Commercial terms</p>
          <div className="mt-5 space-y-4">
            {summary.holdings.map((holding) => (
              <div key={holding.model.id} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm font-semibold text-slate-950">{holding.model.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {commercialLabel(holding.model.pricing)} / {billingLabel(holding.model.billingInterval)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function PerformancePriorityGrid({ summary }: { summary: PortfolioSummary }) {
  const maxDrawdown = portfolioMaxDrawdown(summary);
  const sharpe = portfolioSharpe(summary);
  const winRate = portfolioWinRate(summary);
  const aum = portfolioAum(summary);

  const metrics = [
    {
      label: "Portfolio Value",
      value: formatMoney(summary.current),
      detail: "Current invested model value",
      tone: "neutral" as const,
      icon: PieChart,
      featured: true,
    },
    {
      label: "AUM",
      value: formatMoney(aum),
      detail: "Portfolio value plus wallet capital",
      tone: "neutral" as const,
      icon: Layers3,
      featured: true,
    },
    {
      label: "Total Return",
      value: `${formatSignedMoney(summary.totalReturn)} (${formatPercent(summary.totalReturnPct)})`,
      detail: "Net model return since allocation",
      tone: summary.totalReturn >= 0 ? ("positive" as const) : ("negative" as const),
      icon: TrendingUp,
      featured: true,
    },
    {
      label: "CAGR",
      value: formatPercent(summary.totalReturnPct),
      detail: "Portfolio growth to date",
      tone: summary.totalReturnPct >= 0 ? ("positive" as const) : ("negative" as const),
      icon: BarChart3,
      featured: false,
    },
    {
      label: "Sharpe Ratio",
      value: sharpe.toFixed(2),
      detail: "Weighted by current capital",
      tone: sharpe >= 1.5 ? ("positive" as const) : ("neutral" as const),
      icon: Activity,
      featured: false,
    },
    {
      label: "Max Drawdown",
      value: formatPercent(maxDrawdown),
      detail: "Worst subscribed model drawdown",
      tone: "negative" as const,
      icon: Gauge,
      featured: false,
    },
    {
      label: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      detail: "Weighted active model win rate",
      tone: winRate >= 55 ? ("positive" as const) : ("neutral" as const),
      icon: ShieldCheck,
      featured: false,
    },
  ];

  const featuredMetrics = metrics.filter((metric) => metric.featured);
  const supportingMetrics = metrics.filter((metric) => !metric.featured);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-7">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0F8F5A]">
            Priority performance
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Capital, returns, and risk at a glance</h2>
        </div>
        <span className="text-xs font-medium text-slate-500">Post-login investor view</span>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {featuredMetrics.map((metric) => (
          <PriorityMetric key={metric.label} {...metric} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supportingMetrics.map((metric) => (
          <PriorityMetric key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}

function PriorityMetric({
  label,
  value,
  detail,
  tone,
  icon: Icon,
  featured,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "positive" | "negative" | "neutral";
  icon: ComponentType<{ className?: string }>;
  featured: boolean;
}) {
  const toneClass =
    tone === "positive" ? "text-emerald-700" : tone === "negative" ? "text-rose-600" : "text-slate-950";

  return (
    <div className={`rounded-md border border-slate-200 p-5 ${featured ? "bg-[#F5F5F6]" : "bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-[#0F8F5A]" />
      </div>
      <p className={`mt-5 ${featured ? "text-3xl" : "text-2xl"} font-semibold tracking-[-0.04em] ${toneClass}`}>{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function TelemetryPanel({
  title,
  subtitle,
  metrics,
}: {
  title: string;
  subtitle: string;
  metrics: TelemetryMetric[];
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-7">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Telemetry</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-6 grid gap-x-8 gap-y-2 lg:grid-cols-2">
        {metrics.map((metric) => (
          <TelemetryCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function TelemetryCard({ metric }: { metric: TelemetryMetric }) {
  const Icon = metric.icon;
  const toneClass =
    metric.tone === "positive"
      ? "text-emerald-700"
      : metric.tone === "negative"
        ? "text-rose-600"
        : "text-slate-950";

  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[#0F8F5A]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">{metric.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{metric.detail}</p>
        </div>
      </div>
      <p className={`shrink-0 text-right text-lg font-semibold tracking-[-0.02em] ${toneClass}`}>{metric.value}</p>
    </div>
  );
}

function WalletView() {
  const [walletMode, setWalletMode] = useState<"add" | "withdraw">("add");
  const [walletAmount, setWalletAmount] = useState("10000");
  const [walletMessage, setWalletMessage] = useState("");
  const parsedAmount = Number(walletAmount.replace(/,/g, ""));
  const validAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
  const exceedsWallet = walletMode === "withdraw" && validAmount > WALLET_BALANCE;
  const canSubmit = validAmount > 0 && !exceedsWallet;
  const quickAmounts = walletMode === "add" ? QUICK_ADD_AMOUNTS : [5000, 10000, 25000];

  function handleWalletSubmit() {
    if (!canSubmit) return;
    setWalletMessage(
      walletMode === "add"
        ? `Add money request created for ${formatMoney(validAmount)}.`
        : `Withdrawal request created for ${formatMoney(validAmount)}.`
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-7 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Available wallet balance</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{formatMoney(WALLET_BALANCE)}</h1>
          <div className="mt-7 grid gap-4 border-t border-dashed border-slate-200 pt-6 sm:grid-cols-2">
            <BalanceLine label="Cash" value={formatMoney(WALLET_BALANCE)} />
            <BalanceLine label="Capital allocated" value={formatMoney(getPortfolioSummary().invested)} />
          </div>
        </div>

        <Link href="/user/orders" className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold">
          All transactions
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Instant allocation balance</p>
              <p className="mt-1 text-sm text-slate-500">Use wallet funds for model subscription and rebalancing.</p>
            </div>
            <Link href="/marketplace" className="rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-[#0F8F5A]">
              Explore
            </Link>
          </div>
        </div>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white">
        <div className="grid grid-cols-2 border-b border-slate-200 text-center text-sm font-semibold">
          <button
            className={`border-b-2 py-4 transition ${
              walletMode === "add" ? "border-[#0F8F5A] text-[#0F8F5A]" : "border-transparent text-slate-500"
            }`}
            type="button"
            onClick={() => {
              setWalletMode("add");
              setWalletMessage("");
            }}
          >
            Add money
          </button>
          <button
            className={`border-b-2 py-4 transition ${
              walletMode === "withdraw" ? "border-[#0F8F5A] text-[#0F8F5A]" : "border-transparent text-slate-500"
            }`}
            type="button"
            onClick={() => {
              setWalletMode("withdraw");
              setWalletMessage("");
            }}
          >
            Withdraw
          </button>
        </div>
        <div className="p-6 text-center">
          <label className="mx-auto flex max-w-[220px] items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-4xl font-semibold tracking-[-0.04em] focus-within:border-[#0F8F5A]">
            <span>$</span>
            <input
              value={walletAmount}
              inputMode="numeric"
              onChange={(event) => {
                setWalletAmount(event.target.value.replace(/[^\d,]/g, ""));
                setWalletMessage("");
              }}
              className="w-full bg-transparent text-center outline-none"
              aria-label={walletMode === "add" ? "Amount to add" : "Amount to withdraw"}
            />
          </label>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
                type="button"
                onClick={() => {
                  setWalletAmount(String(amount));
                  setWalletMessage("");
                }}
              >
                {walletMode === "add" ? "+" : ""}
                {formatMoney(amount)}
              </button>
            ))}
          </div>
          {exceedsWallet ? (
            <p className="mt-4 text-sm font-medium text-red-600">
              Withdrawal cannot exceed your available wallet balance.
            </p>
          ) : null}
          {walletMessage ? <p className="mt-4 text-sm font-medium text-[#0F8F5A]">{walletMessage}</p> : null}
        </div>
        <div className="border-y border-slate-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <Landmark className="h-5 w-5 text-[#0F8F5A]" />
              <div>
                <p className="text-sm font-semibold">{walletMode === "add" ? "Bank transfer" : "Withdrawal account"}</p>
                <p className="text-xs text-slate-500">HDFC Bank ....6252</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        <div className="p-5">
          <button
            className="w-full rounded-md bg-[#0F8F5A] px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-[#0c774b] disabled:cursor-not-allowed disabled:bg-slate-300"
            type="button"
            disabled={!canSubmit}
            onClick={handleWalletSubmit}
          >
            {walletMode === "add" ? "Add money" : "Withdraw money"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function OrdersView() {
  const summary = getPortfolioSummary();
  const orders = summary.holdings.flatMap((holding, index) => [
    {
      id: `QS-${2140 + index}`,
      type: "Allocation",
      model: holding.model.name,
      amount: holding.invested,
      date: compactDate(holding.investedAt),
      status: "Executed",
    },
    {
      id: `RB-${904 + index}`,
      type: "Rebalance",
      model: holding.model.name,
      amount: Math.round(holding.invested * 0.08),
      date: "Jul 12",
      status: "Settled",
    },
  ]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Orders</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Model allocation activity</h1>
        </div>
        <button className="rounded-md border border-slate-200 p-2 text-slate-600" type="button">
          <Download className="h-4 w-4" />
        </button>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="grid gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:grid-cols-[1fr_1fr_120px_120px]">
          <div>
            <p className="font-semibold">{order.type}</p>
            <p className="mt-1 text-xs text-slate-500">{order.id}</p>
          </div>
          <p className="text-sm text-slate-700">{order.model}</p>
          <p className="font-semibold">{formatMoney(order.amount)}</p>
          <div className="text-sm">
            <p>{order.date}</p>
            <p className="mt-1 text-[#0F8F5A]">{order.status}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function ReportsView() {
  const reports = [
    { title: "Monthly statement", detail: "Capital, returns, fees, and wallet movement", icon: FileText },
    { title: "Model risk report", detail: "Drawdown, volatility, Sharpe, and exposure", icon: ShieldCheck },
    { title: "Trade log", detail: "Executed trades placed by each ML model", icon: BarChart3 },
    { title: "Tax export", detail: "Realized gains and downloadable CSV", icon: Download },
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Reports</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Documents and evidence</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button key={report.title} className="rounded-lg border border-slate-200 bg-white p-6 text-left transition hover:border-[#0F8F5A]" type="button">
              <Icon className="h-5 w-5 text-[#0F8F5A]" />
              <h2 className="mt-5 text-lg font-semibold">{report.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{report.detail}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ModelView({ holding }: { holding: ReturnType<typeof getInvestorHolding> }) {
  const [range, setRange] = useState<InvestmentChartRange>("1Y");
  const [allocationOpen, setAllocationOpen] = useState(false);
  const [allocationAmount, setAllocationAmount] = useState("10000");
  const chart = useMemo(() => (holding ? buildInvestmentChart(holding, range) : []), [holding, range]);

  if (!holding) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">Model not found</h1>
        <Link href="/user" className="mt-5 inline-flex rounded-md bg-[#0F8F5A] px-4 py-3 text-sm font-semibold text-white">
          Back to holdings
        </Link>
      </div>
    );
  }

  const telemetry = modelTelemetry(holding);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href="/user" className="text-sm font-semibold text-[#0F8F5A]">
                Holdings
              </Link>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{holding.model.name}</h1>
              <p className="mt-2 text-sm text-slate-500">
                Invested on {compactDate(holding.investedAt)} - {holding.strategy} - {holding.assetClass}
              </p>
            </div>
            <button
              className="rounded-md bg-[#0F8F5A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b7448]"
              type="button"
              onClick={() => setAllocationOpen(true)}
            >
              Add allocation
            </button>
          </div>
          <div className="mt-8 grid gap-8 border-t border-dashed border-slate-200 pt-6 sm:grid-cols-5">
            <Metric label="Current" value={formatMoney(holding.current)} />
            <Metric label="Invested" value={formatMoney(holding.invested)} />
            <Metric label="Total return" value={formatSignedMoney(holding.totalReturn)} tone={holding.totalReturn} />
            <Metric label="Sharpe" value={holding.sharpe.toFixed(2)} />
            <Metric label="Subscription" value={`${commercialLabel(holding.model.pricing)} / ${billingLabel(holding.model.billingInterval)}`} />
          </div>
        </div>

        <TelemetryPanel
          title="Post-purchase model telemetry"
          subtitle="Execution, risk, exposure, and utilization for this subscribed model only."
          metrics={telemetry}
        />

        <div className="rounded-lg border border-slate-200 bg-white p-7">
          <div className="mb-5 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Investment performance</p>
              <h2 className="mt-2 text-xl font-semibold">Your entry vs model vs benchmark</h2>
            </div>
            <div className="hidden gap-4 text-xs font-semibold text-slate-500 sm:flex">
              <span className="text-[#0F8F5A]">Model</span>
              <span className="text-slate-900">Your capital</span>
              <span className="text-slate-400">Benchmark</span>
            </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-100 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Range</span>
              <div className="flex flex-wrap gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
                {chartRanges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={`h-8 min-w-10 rounded px-3 text-xs font-semibold transition ${
                      range === item
                        ? "bg-white text-[#0F8F5A] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:bg-white hover:text-slate-900"
                    }`}
                    aria-pressed={range === item}
                  >
                    {item === "ALL" ? "All" : item}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => formatCompactMoney(Number(value))} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={70} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Line type="monotone" dataKey="model" stroke="#0F8F5A" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="invested" stroke="#0f172a" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Model health</p>
          <div className="mt-5 space-y-4">
            <BalanceLine label="YTD return" value={formatPercent(holding.ytdReturnPct)} tone={holding.ytdReturnPct} />
            <BalanceLine label="Max drawdown" value={formatPercent(holding.maxDrawdownPct)} tone={holding.maxDrawdownPct} />
            <BalanceLine label="Win rate" value={`${holding.winRatePct.toFixed(1)}%`} />
            <BalanceLine label="Risk" value={holding.risk} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Allocation</p>
          <div className="mt-5 space-y-4">
            <BalanceLine label="Portfolio weight" value={`${holding.allocation}%`} />
            <BalanceLine label="Units" value={holding.units.toFixed(2)} />
            <BalanceLine label="Avg NAV" value={formatMoney(holding.avgNav)} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Commercial terms</p>
          <div className="mt-5 space-y-4">
            <BalanceLine label="Model subscription" value={commercialLabel(holding.model.pricing)} />
            <BalanceLine label="Billing cadence" value={billingLabel(holding.model.billingInterval)} />
            <BalanceLine label="Minimum allocation" value={holding.model.minimumCapital || "Review"} />
            <BalanceLine label="Sales owner" value={holding.model.salesOwner || "Investor Relations"} />
          </div>
        </div>
      </aside>

      <AllocationTicket
        open={allocationOpen}
        amount={allocationAmount}
        holding={holding}
        onAmountChange={setAllocationAmount}
        onClose={() => setAllocationOpen(false)}
      />
    </div>
  );
}

function AllocationTicket({
  open,
  amount,
  holding,
  onAmountChange,
  onClose,
}: {
  open: boolean;
  amount: string;
  holding: NonNullable<ReturnType<typeof getInvestorHolding>>;
  onAmountChange: (value: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const numericAmount = Number(amount.replace(/,/g, ""));
  const minimum = minimumCapitalValue(holding.model.minimumCapital);
  const validAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  const belowMinimum = minimum > 0 && validAmount < minimum;
  const exceedsWallet = validAmount > WALLET_BALANCE;
  const canConfirm = validAmount > 0 && !belowMinimum && !exceedsWallet;
  const projectedInvested = holding.invested + Math.max(validAmount, 0);
  const projectedWeight = Math.min(100, holding.allocation + (validAmount / (getPortfolioSummary().invested + validAmount)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close allocation ticket" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Allocation ticket</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{holding.model.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{holding.strategy} - {holding.assetClass}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 p-2 text-slate-500 transition hover:text-slate-950">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border border-slate-200 bg-[#F5F5F6] p-4">
            <BalanceLine label="Wallet balance" value={formatMoney(WALLET_BALANCE)} />
            <div className="mt-3 border-t border-slate-200 pt-3">
              <BalanceLine label="Minimum allocation" value={minimum ? formatMoney(minimum) : "Review"} />
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <BalanceLine
                label="Model subscription"
                value={`${commercialLabel(holding.model.pricing)} / ${billingLabel(holding.model.billingInterval)}`}
              />
            </div>
          </div>

          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500" htmlFor="allocation-amount">
            Allocation amount
          </label>
          <div className="mt-2 flex items-center rounded-lg border border-slate-200 bg-white px-4 py-3 focus-within:border-[#0F8F5A]">
            <span className="text-lg font-semibold text-slate-400">$</span>
            <input
              id="allocation-amount"
              inputMode="numeric"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value.replace(/[^\d]/g, ""))}
              className="min-w-0 flex-1 bg-transparent px-2 text-2xl font-semibold tracking-[-0.03em] outline-none"
              placeholder="0"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[10000, 25000, 50000].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => onAmountChange(String(quickAmount))}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#0F8F5A] hover:text-[#0F8F5A]"
              >
                +{formatMoney(quickAmount)}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4 rounded-lg border border-slate-200 p-4">
            <BalanceLine label="Current invested" value={formatMoney(holding.invested)} />
            <BalanceLine label="Projected invested" value={formatMoney(projectedInvested)} />
            <BalanceLine label="Projected weight" value={`${projectedWeight.toFixed(1)}%`} />
            <BalanceLine label="Available after allocation" value={formatMoney(Math.max(WALLET_BALANCE - validAmount, 0))} />
          </div>

          {belowMinimum ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Amount is below the minimum allocation for this model.
            </p>
          ) : null}
          {exceedsWallet ? (
            <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Amount exceeds available wallet balance. Add money before allocating.
            </p>
          ) : null}
        </div>

        <div className="border-t border-slate-200 p-6">
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onClose}
            className="w-full rounded-md bg-[#0F8F5A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b7448] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Confirm allocation
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            Confirmation records the allocation request. Execution remains subject to model and risk checks.
          </p>
        </div>
      </aside>
    </div>
  );
}

function portfolioAum(summary: PortfolioSummary) {
  return summary.current + WALLET_BALANCE;
}

function weightedByCurrent(summary: PortfolioSummary, pick: (holding: InvestorHolding) => number) {
  if (!summary.current) return 0;
  return summary.holdings.reduce((sum, holding) => sum + pick(holding) * holding.current, 0) / summary.current;
}

function portfolioSharpe(summary: PortfolioSummary) {
  return weightedByCurrent(summary, (holding) => holding.sharpe);
}

function portfolioWinRate(summary: PortfolioSummary) {
  return weightedByCurrent(summary, (holding) => holding.winRatePct);
}

function portfolioMaxDrawdown(summary: PortfolioSummary) {
  if (!summary.holdings.length) return 0;
  return Math.min(...summary.holdings.map((holding) => holding.maxDrawdownPct));
}

function modelHealthScore(holding: InvestorHolding) {
  const sharpeScore = Math.min(24, Math.max(0, holding.sharpe * 10));
  const winScore = Math.min(20, Math.max(0, holding.winRatePct / 4));
  const drawdownScore = Math.max(0, 18 - Math.abs(holding.maxDrawdownPct));
  const evidenceScore = Math.min(18, Math.max(6, Number(holding.model.evidenceRowCount || 0) / 20));
  return Math.round(Math.min(100, 20 + sharpeScore + winScore + drawdownScore + evidenceScore));
}

function riskScore(drawdownPct: number, exposurePct: number) {
  return Math.round(Math.min(100, Math.max(0, Math.abs(drawdownPct) * 4 + exposurePct * 0.12)));
}

function riskTone(score: number): TelemetryMetric["tone"] {
  if (score < 35) return "positive";
  if (score > 65) return "negative";
  return "neutral";
}

function modelTelemetry(holding: InvestorHolding): TelemetryMetric[] {
  const score = riskScore(holding.maxDrawdownPct, holding.allocation);
  const summary = getPortfolioSummary();
  const utilization = summary.invested ? (holding.invested / summary.invested) * 100 : holding.allocation;

  return [
    {
      label: "Model Health",
      value: `${modelHealthScore(holding)}/100`,
      detail: "Sharpe, win rate, drawdown, and evidence depth",
      tone: "positive",
      icon: ShieldCheck,
    },
    {
      label: "Risk Score",
      value: `${score}/100`,
      detail: `${holding.risk} risk model profile`,
      tone: riskTone(score),
      icon: Gauge,
    },
    {
      label: "Current Exposure",
      value: `${holding.allocation}%`,
      detail: "Portfolio weight assigned to this model",
      tone: "neutral",
      icon: Activity,
    },
    {
      label: "Active Positions",
      value: "1",
      detail: "Subscribed allocation currently active",
      tone: "positive",
      icon: Layers3,
    },
    {
      label: "Capital Utilization",
      value: `${utilization.toFixed(1)}%`,
      detail: "Share of deployed model capital",
      tone: "neutral",
      icon: PieChart,
    },
    {
      label: "Execution Status",
      value: "Operational",
      detail: "Execution subject to model and risk checks",
      tone: "positive",
      icon: Activity,
    },
    {
      label: "Today's Trades",
      value: "0",
      detail: "No same-day trade rows available",
      tone: "neutral",
      icon: BarChart3,
    },
    {
      label: "Strategy Status",
      value: "Live",
      detail: `${holding.strategy} strategy under monitoring`,
      tone: "positive",
      icon: ShieldCheck,
    },
    {
      label: "Portfolio Allocation",
      value: formatMoney(holding.current),
      detail: "Current value of this allocation",
      tone: "neutral",
      icon: PieChart,
    },
    {
      label: "Model Performance",
      value: formatPercent(holding.ytdReturnPct),
      detail: "Model return reflected in your holding",
      tone: holding.ytdReturnPct >= 0 ? "positive" : "negative",
      icon: TrendingUp,
    },
  ];
}

function minimumCapitalValue(value?: string | null) {
  if (!value) return 0;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function commercialLabel(value?: string | null) {
  return value && value.trim() ? value : "Review";
}

function billingLabel(value?: string | null) {
  if (!value) return "Custom";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: number }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 text-base font-semibold ${tone === undefined ? "text-slate-950" : lineTone(tone)}`}>{value}</p>
    </div>
  );
}

function BalanceLine({ label, value, tone }: { label: string; value: string; tone?: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${tone === undefined ? "text-slate-950" : lineTone(tone)}`}>{value}</span>
    </div>
  );
}

function MiniChart({ positive }: { positive: boolean }) {
  const data = positive
    ? [{ v: 20 }, { v: 25 }, { v: 24 }, { v: 31 }, { v: 34 }, { v: 40 }]
    : [{ v: 40 }, { v: 38 }, { v: 31 }, { v: 34 }, { v: 28 }, { v: 25 }];

  return (
    <div className="h-14 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="v" stroke={positive ? "#0F8F5A" : "#e11d48"} fill={positive ? "#d1fae5" : "#ffe4e6"} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
