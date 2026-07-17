"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronRight,
  Download,
  FileText,
  Landmark,
  MoreVertical,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
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

export function UserWorkspace({ user, view, modelSlug }: UserWorkspaceProps) {
  const pathname = usePathname();
  const modelHolding = getInvestorHolding(modelSlug);

  return (
    <div className="min-h-screen bg-[#F5F5F6] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`border-b-2 px-3 py-3 transition ${
                    active ? "border-[#0F8F5A] text-slate-950" : "border-transparent hover:text-[#0F8F5A]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden min-w-[280px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4" />
            <span className="flex-1">Search models, reports, orders</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ctrl K</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/user/wallet"
              className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F8F5A] hover:text-[#0F8F5A] sm:flex"
            >
              <Wallet className="h-4 w-4" />
              {formatCompactMoney(WALLET_BALANCE)}
            </Link>
            <button className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:text-[#0F8F5A]" type="button">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F8F5A] text-sm font-semibold text-white">
              {user.name.slice(0, 1)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
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
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Holdings ({summary.holdings.length})</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{formatMoney(summary.current)}</h1>
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

          <div className="mt-6 grid gap-5 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-3">
            <Metric label="Invested value" value={formatMoney(summary.invested)} />
            <Metric label="1D returns" value={`${formatSignedMoney(summary.dayReturn)} (${formatPercent(summary.dayReturnPct)})`} tone={summary.dayReturn} />
            <Metric label="Total returns" value={`${formatSignedMoney(summary.totalReturn)} (${formatPercent(summary.totalReturnPct)})`} tone={summary.totalReturn} />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_32px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>Model</span>
            <span>Performance</span>
            <span>Returns</span>
            <span>Current</span>
            <span />
          </div>
          {summary.holdings.map((holding) => (
            <Link
              key={holding.model.id}
              href={`/user/models/${holding.model.slug}`}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_32px] items-center gap-4 border-b border-slate-100 px-5 py-5 transition last:border-b-0 hover:bg-emerald-50/50"
            >
              <div>
                <p className="font-semibold tracking-[-0.01em]">{holding.model.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {holding.units.toFixed(2)} units · Avg. {formatMoney(holding.avgNav)}
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
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </section>

      <aside className="space-y-6">
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
      </aside>
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

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
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
          <div className="mt-6 grid gap-5 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-4">
            <Metric label="Current" value={formatMoney(holding.current)} />
            <Metric label="Invested" value={formatMoney(holding.invested)} />
            <Metric label="Total return" value={formatSignedMoney(holding.totalReturn)} tone={holding.totalReturn} />
            <Metric label="Sharpe" value={holding.sharpe.toFixed(2)} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
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

      <aside className="space-y-6">
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

function minimumCapitalValue(value?: string | null) {
  if (!value) return 0;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
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
