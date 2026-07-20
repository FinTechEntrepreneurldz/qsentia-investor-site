import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  LineChart,
  RadioTower,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { MarketplaceAllocationCta } from "@/components/MarketplaceAllocationCta";
import { SiteHeader } from "@/components/PageChrome";
import { MOCK_MARKETPLACE_MODELS, getMockMarketplaceModel } from "@/lib/mockMarketplace";
import type { ModelDetails } from "@/lib/modelCatalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ChartPoint = {
  timestamp: string;
  value: number;
};

const categoryLabels: Record<ModelDetails["category"], string> = {
  crypto: "Crypto",
  equity: "Equities",
  macro: "Macro",
  sentiment: "Sentiment",
  "multi-strategy": "Multi-strategy",
  "reinforcement-learning": "Reinforcement learning",
};

export function generateStaticParams() {
  return MOCK_MARKETPLACE_MODELS.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = getMockMarketplaceModel(slug);

  if (!model) return { title: "Model not found | QSentia" };

  return {
    title: `${model.name} | QSentia model review`,
    description: `Review health, return curve, Sharpe, drawdown, live telemetry, and evidence before allocating capital to ${model.name}.`,
  };
}

function pct(value: number | null | undefined, signed = false) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  const prefix = signed && value > 0 ? "+" : "";
  return `${prefix}${(value * 100).toFixed(1)}%`;
}

function num(value: number | null | undefined, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return value.toFixed(digits);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function healthScore(model: ModelDetails) {
  const sharpe = model.performance.sharpeRatio ?? 0;
  const drawdown = Math.abs(model.performance.maxDrawdown ?? 0.25);
  const evidence = model.evidenceRowCount ?? 0;
  let score = 62;

  if (sharpe >= 2) score += 14;
  else if (sharpe >= 1.5) score += 10;
  else if (sharpe >= 1) score += 5;
  else score -= 10;

  if (drawdown <= 0.05) score += 10;
  else if (drawdown <= 0.1) score += 7;
  else if (drawdown <= 0.15) score += 2;
  else score -= 8;

  if (evidence >= 240) score += 8;
  else if (evidence >= 200) score += 5;
  else score += 2;

  if (model.accessStatus === "active") score += 4;
  if ((model.performance.totalReturn ?? 0) < 0) score -= 12;

  return Math.max(0, Math.min(98, score));
}

function healthLabel(score: number) {
  if (score >= 86) return "Strong";
  if (score >= 72) return "Ready for review";
  if (score >= 58) return "Needs monitoring";
  return "High caution";
}

function statusText(model: ModelDetails) {
  if (model.accessStatus === "active") return "Allocation-ready";
  if (model.accessStatus === "waitlist") return "Waitlist review";
  return "Access review";
}

function chartPath(points: ChartPoint[], width = 760, height = 250) {
  if (points.length < 2) return "";
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = width / (points.length - 1);

  return points
    .map((point, index) => {
      const x = index * xStep;
      const y = height - ((point.value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function areaPath(points: ChartPoint[], width = 760, height = 250) {
  const line = chartPath(points, width, height);
  if (!line) return "";
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

function benchmarkPath(model: ModelDetails, width = 760, height = 250) {
  if (model.chart.length < 2) return "";
  const values = model.chart.map((point) => point.value);
  const base = model.startingCapital ?? values[0] ?? 0;
  const min = Math.min(...values, base);
  const max = Math.max(...values, base);
  const y = height - ((base - min) / (max - min || 1)) * height;
  return `M 0 ${y.toFixed(2)} L ${width} ${y.toFixed(2)}`;
}

function recentEvidenceRows(model: ModelDetails) {
  const points = model.chart.slice(-7);
  return points.slice(1).map((point, index) => {
    const previous = points[index];
    const dailyReturn = previous ? point.value / previous.value - 1 : 0;
    const actions = ["Hold", "Rebalance", "Monitor", "Hold", "Risk check", "Hold"];
    const notes = [
      "Signal stayed inside approved exposure band.",
      "Position change reviewed against drawdown limits.",
      "Telemetry and portfolio value reconciled.",
      "No abnormal model drift detected.",
      "Risk surface reviewed before broker readiness.",
      "Evidence row accepted for allocation review.",
    ];

    return {
      date: formatDate(point.timestamp),
      value: point.value,
      dailyReturn,
      action: actions[index % actions.length],
      note: notes[index % notes.length],
    };
  });
}

function StatCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="border-b border-r border-zinc-200 px-5 py-5 last:border-r-0 dark:border-zinc-850 md:border-b-0">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">{label}</div>
      <div
        className={`mt-2 text-2xl font-semibold tracking-tight ${
          tone === "positive"
            ? "text-[#00A76F]"
            : tone === "negative"
              ? "text-[#D92D20]"
              : "text-zinc-950 dark:text-white"
        }`}
      >
        {value}
      </div>
      <p className="mt-1 max-w-[170px] text-xs leading-5 text-zinc-500 dark:text-zinc-400">{detail}</p>
    </div>
  );
}

function DetailPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-850 dark:bg-black">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#DCEEE6] text-[#0F8F5A] dark:bg-[#052E1B] dark:text-[#8EE0B8]">
          {icon}
        </span>
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default async function MarketplaceModelPage({ params }: PageProps) {
  const { slug } = await params;
  const model = getMockMarketplaceModel(slug);

  if (!model) notFound();

  const score = healthScore(model);
  const health = healthLabel(score);
  const line = chartPath(model.chart);
  const area = areaPath(model.chart);
  const benchmarkLine = benchmarkPath(model);
  const latestDecision =
    typeof model.latest?.decision?.action === "string" ? model.latest.decision.action.toUpperCase() : "REVIEW";
  const confidence =
    typeof model.latest?.decision?.confidence === "number" ? pct(model.latest.decision.confidence) : "N/A";
  const rows = recentEvidenceRows(model);
  const dataVisibilityRows = [
    ["Public model profile", "Visible before sign-in"],
    ["Return curve", `${model.observationCount ?? model.chart.length} observations`],
    ["Evidence rows", String(model.evidenceRowCount ?? "N/A")],
    ["Latest telemetry", formatDate(model.latest.lastRun)],
    ["Benchmark", model.benchmarkLabel || "N/A"],
    ["Allocation action", "Requires login and wallet"],
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F6] text-zinc-950 dark:bg-[#09090b] dark:text-zinc-50">
      <SiteHeader active="/marketplace" />

      <section className="border-b border-zinc-200 bg-white dark:border-zinc-850 dark:bg-black">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:py-10">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to marketplace
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#0F8F5A]">
                Marketplace / Model due diligence
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#ECFDF3] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#027A48] dark:bg-[#052E1B] dark:text-[#7CE3B1]">
                  {statusText(model)}
                </span>
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
                  {categoryLabels[model.category]}
                </span>
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-zinc-950 dark:text-white sm:text-4xl">
                {model.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {model.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[categoryLabels[model.category], model.benchmarkLabel, ...model.tags.slice(0, 4)]
                  .filter(Boolean)
                  .map((item) => (
                    <span
                      key={item}
                      className="rounded-[4px] border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-zinc-400"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            <aside className="rounded-[2px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-850 dark:bg-black">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Model health
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <span className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">{score}</span>
                <span className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#00A76F]">
                  {health}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                <div className="h-full rounded-full bg-[#0F8F5A]" style={{ width: `${score}%` }} />
              </div>
              <dl className="mt-4 grid gap-2 text-xs">
                <InfoLine label="Latest decision" value={latestDecision} />
                <InfoLine label="Telemetry freshness" value={formatDate(model.latest.lastRun)} />
                <InfoLine label="Evidence rows" value={String(model.evidenceRowCount ?? "N/A")} last />
              </dl>
              <MarketplaceAllocationCta
                modelSlug={model.slug}
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-[2px] bg-zinc-950 px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-100/70 dark:border-zinc-850 dark:bg-zinc-950/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 px-5 sm:px-8 md:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="YTD return"
            value={pct(model.performance.totalReturn, true)}
            detail="Net model curve shown before investor allocation."
            tone={(model.performance.totalReturn ?? 0) >= 0 ? "positive" : "negative"}
          />
          <StatCard label="Sharpe" value={num(model.performance.sharpeRatio)} detail="Return per unit of volatility." />
          <StatCard
            label="Max drawdown"
            value={pct(model.performance.maxDrawdown)}
            detail="Largest historical peak-to-trough decline."
            tone="negative"
          />
          <StatCard label="Win rate" value={pct(model.performance.winRate)} detail="Share of profitable evaluated periods." />
          <StatCard
            label="Annualized"
            value={pct(model.performance.annualizedReturn, true)}
            detail="Annualized return estimate from available curve."
            tone="positive"
          />
          <StatCard label="Minimum" value={model.minimumCapital || "Review"} detail="Suggested account capital floor." />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:py-10">
        <DetailPanel title="Daily Return Curve" icon={<LineChart className="h-4 w-4" />}>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-zinc-500">
              Inception {formatDate(model.inceptionDate)} - Latest value {num(model.latestValue, 1)}
            </p>
            <div className="flex flex-wrap gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
              <span className="text-[#0F8F5A]">Model</span>
              <span className="text-zinc-950 dark:text-white">Your capital</span>
              <span className="text-zinc-400">Benchmark {model.benchmarkLabel || ""}</span>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[8px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-850 dark:bg-[#050507]">
            <svg viewBox="0 0 760 250" className="h-[260px] w-full overflow-visible" role="img" aria-label="Model return curve">
              {[0, 62.5, 125, 187.5, 250].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="760"
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-zinc-850"
                  strokeDasharray="4 6"
                />
              ))}
              <path d={area} fill="url(#modelArea)" opacity="0.55" />
              {benchmarkLine ? (
                <path d={benchmarkLine} fill="none" stroke="#171c24" strokeWidth="2" strokeDasharray="6 7" opacity="0.85" />
              ) : null}
              <path d={line} fill="none" stroke="#00A76F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="modelArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00A76F" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#00A76F" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </DetailPanel>

        <DetailPanel title="Recent Model Evidence" icon={<BarChart3 className="h-4 w-4" />}>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-200 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:border-zinc-850">
                  <th className="py-3 pr-5">Date</th>
                  <th className="py-3 pr-5">Portfolio</th>
                  <th className="py-3 pr-5">Daily return</th>
                  <th className="py-3 pr-5">Signal</th>
                  <th className="py-3 pr-5">Review note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm dark:divide-zinc-900">
                {rows.map((row) => (
                  <tr key={`${row.date}-${row.action}`}>
                    <td className="py-4 pr-5 text-zinc-500">{row.date}</td>
                    <td className="py-4 pr-5 font-mono text-zinc-950 dark:text-white">{num(row.value, 1)}</td>
                    <td className={`py-4 pr-5 font-mono font-bold ${row.dailyReturn >= 0 ? "text-[#00A76F]" : "text-[#D92D20]"}`}>
                      {pct(row.dailyReturn, true)}
                    </td>
                    <td className="py-4 pr-5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-zinc-950 dark:text-white">
                      {row.action}
                    </td>
                    <td className="py-4 pr-5 text-zinc-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailPanel>

        <DetailPanel title="Data Visibility" icon={<RadioTower className="h-4 w-4" />}>
          <div className="mt-6 grid overflow-hidden rounded-[8px] border border-zinc-200 dark:border-zinc-850 sm:grid-cols-2 lg:grid-cols-3">
            {dataVisibilityRows.map(([label, value]) => (
              <div key={label} className="border-b border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-850 dark:bg-[#050507]">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</div>
                <div className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">{value}</div>
              </div>
            ))}
          </div>
        </DetailPanel>

        <DetailPanel title="Evidence Before Allocation" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {model.features.map((feature) => (
              <div
                key={feature}
                className="flex gap-3 rounded-[8px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-850 dark:bg-[#050507]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00A76F]" />
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{feature}</p>
              </div>
            ))}
          </div>
        </DetailPanel>

        <div className="grid gap-6 lg:grid-cols-3">
          <DetailPanel title="Investor Priority" icon={<Activity className="h-4 w-4" />}>
            <PriorityRows
              rows={[
                ["Return quality", `${pct(model.performance.totalReturn, true)} total return with ${num(model.performance.sharpeRatio)} Sharpe.`],
                ["Risk discipline", `${pct(model.performance.maxDrawdown)} max drawdown before allocation sizing.`],
                ["Evidence depth", `${model.evidenceRowCount ?? "N/A"} rows available for signal and log review.`],
                ["Operational state", `${model.latest.paperStatus || "Published"} model, replay ${model.latest.paperReplayStatus || "ready"}.`],
              ]}
            />
          </DetailPanel>

          <DetailPanel title="Live Telemetry" icon={<RadioTower className="h-4 w-4" />}>
            <dl className="mt-6 grid gap-3 text-sm">
              <InfoLine label="Decision" value={latestDecision} />
              <InfoLine label="Confidence" value={confidence} />
              <InfoLine label="Gross exposure" value={pct(model.latest.latestSignalGrossWeight)} />
              <InfoLine label="Last run" value={formatDate(model.latest.lastRun)} />
              <InfoLine label="Total signals" value={String(model.performance.totalSignals ?? "N/A")} />
              <InfoLine label="Holding period" value={model.performance.avgHoldingPeriod || "N/A"} last />
            </dl>
          </DetailPanel>

          <DetailPanel title="Allocation Terms" icon={<TrendingUp className="h-4 w-4" />}>
            <dl className="mt-6 grid gap-3 text-sm">
              <InfoLine label="Model fee" value={`${model.pricing || "Review"} / ${model.billingInterval || "month"}`} />
              <InfoLine label="Minimum capital" value={model.minimumCapital || "Review"} />
              <InfoLine label="Owner" value={model.salesOwner || "Investor Relations"} />
              <InfoLine label="Status" value={statusText(model)} last />
            </dl>
            <MarketplaceAllocationCta
              modelSlug={model.slug}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-950 bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            />
          </DetailPanel>
        </div>
      </section>
    </main>
  );
}

function InfoLine({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${last ? "" : "border-b border-zinc-100 pb-3 dark:border-zinc-900"}`}>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-mono text-xs font-bold uppercase tracking-[0.1em] text-zinc-950 dark:text-white">{value}</dd>
    </div>
  );
}

function PriorityRows({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-6 grid gap-4">
      {rows.map(([label, body]) => (
        <div key={label} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-900">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</div>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{body}</p>
        </div>
      ))}
    </div>
  );
}
