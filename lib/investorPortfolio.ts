import { MOCK_MARKETPLACE_MODELS } from "@/lib/mockMarketplace";
import type { MarketplaceModel } from "@/lib/modelCatalog";

export type InvestorHolding = {
  model: MarketplaceModel;
  strategy: string;
  assetClass: string;
  risk: string;
  sharpe: number;
  ytdReturnPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  invested: number;
  current: number;
  dayReturn: number;
  totalReturn: number;
  investedAt: string;
  allocation: number;
  units: number;
  avgNav: number;
};

type HoldingSeed = {
  modelId: string;
  invested: number;
  investedAt: string;
  allocation: number;
  units: number;
  avgNav: number;
  dayMove: number;
};

export const WALLET_BALANCE = 47850;
export const QUICK_ADD_AMOUNTS = [10000, 25000, 50000];

export type InvestmentChartRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "ALL";

const HOLDING_SEEDS: HoldingSeed[] = [
  {
    modelId: "model_c_etf",
    invested: 42000,
    investedAt: "2026-02-14",
    allocation: 42,
    units: 0.84,
    avgNav: 50000,
    dayMove: 336,
  },
  {
    modelId: "model_b",
    invested: 35000,
    investedAt: "2026-03-08",
    allocation: 35,
    units: 1.4,
    avgNav: 25000,
    dayMove: -122,
  },
  {
    modelId: "model_d",
    invested: 23000,
    investedAt: "2026-04-22",
    allocation: 23,
    units: 0.31,
    avgNav: 75000,
    dayMove: 188,
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function strategyName(category: MarketplaceModel["category"]) {
  const map: Record<MarketplaceModel["category"], string> = {
    crypto: "HFT",
    macro: "Mean Reversion",
    sentiment: "Stat Arb",
    equity: "Momentum",
    "multi-strategy": "Macro",
    "reinforcement-learning": "Vol Carry",
  };

  return map[category] || "ML / Factor";
}

function assetClass(model: MarketplaceModel) {
  if (model.category === "crypto" || model.tags.includes("crypto")) return "Crypto";
  if (model.tags.includes("futures") || model.category === "sentiment") return "Futures";
  if (model.category === "macro") return "Multi-Asset";
  if (model.category === "reinforcement-learning") return "Derivatives";
  return "Equities";
}

function riskLabel(model: MarketplaceModel) {
  const drawdown = Math.abs(model.performance.maxDrawdown || 0);
  if (drawdown < 0.05) return "Low";
  if (drawdown < 0.1) return "Medium";
  return "High";
}

export function getInvestorHoldings(): InvestorHolding[] {
  return HOLDING_SEEDS.map((seed) => {
    const model = MOCK_MARKETPLACE_MODELS.find((item) => item.id === seed.modelId) ?? MOCK_MARKETPLACE_MODELS[0];
    const totalReturn = model.performance.totalReturn ?? 0;
    const current = Math.round(seed.invested * (1 + totalReturn));

    return {
      model,
      strategy: strategyName(model.category),
      assetClass: assetClass(model),
      risk: riskLabel(model),
      sharpe: model.performance.sharpeRatio ?? 0,
      ytdReturnPct: totalReturn * 100,
      maxDrawdownPct: (model.performance.maxDrawdown ?? 0) * 100,
      winRatePct: (model.performance.winRate ?? 0) * 100,
      invested: seed.invested,
      current,
      dayReturn: seed.dayMove,
      totalReturn: current - seed.invested,
      investedAt: seed.investedAt,
      allocation: seed.allocation,
      units: seed.units,
      avgNav: seed.avgNav,
    };
  });
}

export function getInvestorHolding(slug: string | null | undefined): InvestorHolding | null {
  if (!slug) return null;
  return getInvestorHoldings().find((holding) => holding.model.slug === slug) ?? null;
}

export function getPortfolioSummary() {
  const holdings = getInvestorHoldings();
  const invested = holdings.reduce((sum, holding) => sum + holding.invested, 0);
  const current = holdings.reduce((sum, holding) => sum + holding.current, 0);
  const dayReturn = holdings.reduce((sum, holding) => sum + holding.dayReturn, 0);
  const totalReturn = current - invested;

  return {
    holdings,
    invested,
    current,
    dayReturn,
    totalReturn,
    totalReturnPct: invested ? (totalReturn / invested) * 100 : 0,
    dayReturnPct: current ? (dayReturn / current) * 100 : 0,
  };
}

const chartRangeConfig: Record<InvestmentChartRange, { labels: string[]; modelScale: number; benchmarkScale: number }> = {
  "1D": { labels: ["9:30", "11:00", "12:30", "2:00", "3:30"], modelScale: 0.08, benchmarkScale: 0.04 },
  "1W": { labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], modelScale: 0.16, benchmarkScale: 0.09 },
  "1M": { labels: ["W1", "W2", "W3", "W4", "Today"], modelScale: 0.32, benchmarkScale: 0.18 },
  "3M": { labels: ["M1", "M2", "M3", "Today"], modelScale: 0.55, benchmarkScale: 0.35 },
  "6M": { labels: ["M1", "M2", "M3", "M4", "M5", "Today"], modelScale: 0.78, benchmarkScale: 0.56 },
  "1Y": { labels: ["Q1", "Q2", "Q3", "Q4", "Today"], modelScale: 1, benchmarkScale: 1 },
  "5Y": { labels: ["Y1", "Y2", "Y3", "Y4", "Y5"], modelScale: 1.65, benchmarkScale: 1.45 },
  ALL: { labels: ["Start", "Y1", "Y2", "Y3", "Y4", "Today"], modelScale: 1.9, benchmarkScale: 1.7 },
};

export function buildInvestmentChart(holding: InvestorHolding, range: InvestmentChartRange = "1Y") {
  const config = chartRangeConfig[range];
  const points = config.labels.length;
  const modelEnd = holding.ytdReturnPct * config.modelScale;
  const benchmarkEnd = 6.7 * config.benchmarkScale;

  return config.labels.map((period, index) => {
    const progress = points === 1 ? 1 : index / (points - 1);
    const modelCurve = Math.pow(progress, 1.28) + Math.sin(progress * Math.PI * 2.5) * 0.035;
    const benchmarkCurve = Math.pow(progress, 1.08) + Math.sin(progress * Math.PI * 1.5) * 0.018;
    const modelReturn = modelEnd * modelCurve;
    const benchmarkReturn = benchmarkEnd * benchmarkCurve;

    return {
      period,
      model: Math.round(holding.invested * (1 + modelReturn / 100)),
      benchmark: Math.round(holding.invested * (1 + benchmarkReturn / 100)),
      invested: holding.invested,
    };
  });
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatSignedMoney(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatMoney(value)}`;
}

export function compactDate(value: string) {
  const [, month, day] = value.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

export function lineTone(value: number) {
  return value >= 0 ? "text-emerald-700" : "text-rose-600";
}
