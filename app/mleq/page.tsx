"use client";

import Link from "next/link";
import useSWR from "swr";
import { useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  Gauge,
  GitBranch,
  LineChart,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sigma,
  Workflow,
} from "lucide-react";
import { ApiLoadingPanel, PageShell } from "@/components/PageChrome";
import { fmtDollar, fmtNum, fmtPct } from "@/lib/metrics";
import { useTheme } from "@/components/ThemeProvider";

type Stats = {
  totalReturn?: number | null;
  annualizedReturn?: number | null;
  sharpe?: number | null;
  maxDrawdown?: number | null;
  hitRate?: number | null;
  nObservations?: number | null;
  nReturns?: number | null;
  status?: string | null;
};

type ModelComparison = {
  id?: string;
  name?: string;
  description?: string;
  color?: string;
  latestValue?: number | null;
  rowCount?: number | null;
  dailyRowCount?: number | null;
  points?: Array<{ timestamp?: string | null; value?: number | null }>;
  stats?: Stats;
};

type Benchmark = {
  name?: string;
  ticker?: string;
  rowCount?: number | null;
  stats?: Stats;
};

type DashboardPayload = {
  selectedModel?: string;
  latest?: {
    portfolioValue?: number | null;
    portfolioReturn?: number | null;
    paperStatus?: string | null;
  };
  stats?: Stats;
  equityCurve?: Array<{
    timestamp?: string | null;
    portfolio?: number | null;
    portfolioValue?: number | null;
  }>;
  benchmarks?: Benchmark[];
  modelComparison?: ModelComparison[];
  decisions?: Record<string, unknown>[];
  positions?: Record<string, unknown>[];
  submittedOrders?: Record<string, unknown>[];
  updatedAt?: string;
  debug?: {
    rowCounts?: Record<string, number>;
  };
};

const fetcher = async (url: string): Promise<DashboardPayload> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

function cleanText(value: unknown) {
  return String(value ?? "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u00e2\u0080[\u0093\u0094]/g, "-")
    .replace(/\u00e2\u0080\u0099/g, "'")
    .replace(/\u00c2/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function display(value: string) {
  return value === "Pending" ? "Not available" : value;
}

function displayCount(value: number | null | undefined) {
  if (!finiteNumber(value)) return "Not available";
  return value.toLocaleString("en-US");
}

function selectedModelFrom(data?: DashboardPayload) {
  const rows = data?.modelComparison || [];
  return (
    rows.find((model) => model.id === data?.selectedModel) || rows[0] || null
  );
}

function sourceRowCount(data?: DashboardPayload) {
  const modelRows = (data?.modelComparison || []).reduce(
    (sum, model) => sum + Number(model.rowCount || model.dailyRowCount || 0),
    0,
  );
  const benchmarkRows = (data?.benchmarks || []).reduce(
    (sum, row) => sum + Number(row.rowCount || 0),
    0,
  );
  const auditRows = Object.values(data?.debug?.rowCounts || {}).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  return modelRows + benchmarkRows + auditRows;
}

function chartPoints(model: ModelComparison | null, data?: DashboardPayload) {
  const modelPoints = (model?.points || [])
    .filter((point) => point.timestamp && finiteNumber(point.value))
    .map((point) => ({
      timestamp: point.timestamp || "",
      value: point.value as number,
    }));

  if (modelPoints.length >= 2) return modelPoints;

  return (data?.equityCurve || [])
    .filter((point) => point.timestamp && finiteNumber(point.portfolio))
    .map((point) => ({
      timestamp: point.timestamp || "",
      value: point.portfolio as number,
    }));
}

function makePath(points: Array<{ value: number }>, width = 640, height = 170) {
  if (points.length < 2) return "";

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / Math.max(1, points.length - 1);

  return points
    .map((point, index) => {
      const x = index * step;
      const y = height - ((point.value - min) / span) * (height - 28) - 14;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function topModels(rows: ModelComparison[]) {
  return [...rows]
    .filter(
      (model) =>
        finiteNumber(model.stats?.totalReturn) ||
        finiteNumber(model.stats?.sharpe),
    )
    .sort(
      (a, b) =>
        Number(b.stats?.totalReturn ?? -Infinity) -
        Number(a.stats?.totalReturn ?? -Infinity),
    )
    .slice(0, 5);
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(String(value).replace("_", "T"));
  if (Number.isNaN(date.getTime())) return cleanText(value);
  return date.toISOString().slice(0, 10);
}

export default function MleqPage() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const [activePipelineLabel, setActivePipelineLabel] =
    useState<PipelineLabel>("Signal generation");
  const { data, error, isLoading } = useSWR<DashboardPayload>(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval: 60000,
    },
  );
  const initialLoading = isLoading && !data;

  const modelRows = data?.modelComparison || [];
  const selectedModel = selectedModelFrom(data);
  const selectedStats = selectedModel?.stats || data?.stats || {};
  const linePoints = useMemo(
    () => chartPoints(selectedModel, data),
    [data, selectedModel],
  );
  const linePath = makePath(linePoints);
  const leaderboard = topModels(modelRows);
  const benchmarkCount = data?.benchmarks?.length || 0;
  const totalRows = sourceRowCount(data);
  const activeStreams = modelRows.length + benchmarkCount;
  const paperStatus = cleanText(data?.latest?.paperStatus || "Not available");
  const modelName = cleanText(
    selectedModel?.name || selectedModel?.id || "Selected model pending",
  );

  const heroStats = [
    { label: "Model families", value: displayCount(modelRows.length) },
    { label: "Active streams", value: displayCount(activeStreams) },
    { label: "Source rows", value: displayCount(totalRows) },
    { label: "Updated", value: formatDate(data?.updatedAt) },
  ];

  const terminalMetrics = [
    {
      label: "Telemetry return",
      value: display(
        fmtPct(
          selectedStats.totalReturn ?? data?.latest?.portfolioReturn,
          true,
        ),
      ),
      tone: "text-zinc-950 dark:text-white",
    },
    {
      label: "Sharpe ratio",
      value: display(fmtNum(selectedStats.sharpe)),
      tone: "text-zinc-950 dark:text-white",
    },
    {
      label: "Max drawdown",
      value: display(fmtPct(selectedStats.maxDrawdown, true)),
      tone: "text-zinc-950 dark:text-white",
    },
    {
      label: "Win rate",
      value: display(fmtPct(selectedStats.hitRate)),
      tone: "text-zinc-950 dark:text-white",
    },
  ];

  const pipelineRows = [
    {
      label: "Signal generation",
      value: data?.debug?.rowCounts?.signalHistoryRows ?? 0,
      icon: Radar,
    },
    {
      label: "Risk assessment",
      value: data?.debug?.rowCounts?.positionsRows ?? 0,
      icon: ShieldCheck,
    },
    { label: "Benchmark evaluation", value: benchmarkCount, icon: BarChart3 },
    {
      label: "Execution audit",
      value: data?.debug?.rowCounts?.submittedOrdersRows ?? 0,
      icon: CheckCircle2,
    },
  ];
  const activePipeline =
    pipelineRows.find((row) => row.label === activePipelineLabel) ||
    pipelineRows[0];
  const maxPipelineValue = Math.max(
    ...pipelineRows.map((row) => Number(row.value || 0)),
    1,
  );

  return (
    <PageShell active="/mleq">
      {initialLoading ? (
        <section className="border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#09090b] transition-colors">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <ApiLoadingPanel
              title="Loading MLEQ telemetry"
              body="Preparing model families, portfolio curves, benchmark context, and execution evidence."
              items={[
                "Model families",
                "Equity telemetry",
                "Execution evidence",
              ]}
            />
          </div>
        </section>
      ) : (
        <>
          {/* ── Page Hero Intro Section ── */}
          <section className="border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#09090b] transition-colors">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                      Deep tech engine
                    </span>
                    <span className="rounded-[4px] border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {paperStatus}
                    </span>
                  </div>

                  <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-tight text-zinc-950 dark:text-white uppercase md:text-6xl">
                    Machine Learning Equity Quant
                  </h1>
                  <p className="mt-3 font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
                    MLEQ research system
                  </p>
                  <p className="mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
                    A source-audited quant research layer for model telemetry,
                    benchmark discipline, and execution review. Every figure on
                    this page is derived from the live dashboard API.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-4"
                    >
                      <div className="font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-white uppercase leading-none">
                        {isLoading ? "..." : stat.value}
                      </div>
                      <div className="mt-2 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {[
                    "Adaptive allocation",
                    "Benchmark gating",
                    "Drawdown limits",
                    "Execution audit",
                    "NLP signals",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 font-mono text-[8px] tracking-wider uppercase text-zinc-550 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <TerminalPanel
                modelName={modelName}
                linePath={linePath}
                isLoading={isLoading}
                metrics={terminalMetrics}
                selectedStats={selectedStats}
                portfolioValue={data?.latest?.portfolioValue}
                dark={dark}
              />
            </div>
          </section>

          {/* ── Live Model Evidence ── */}
          <section className="border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#09090b] transition-colors">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
              <SectionIntro
                eyebrow="Live model evidence"
                title="Performance highlights"
                body="Current model metrics are shown in a compact operating view, with rankable rows separated from missing source history."
              />

              <div className="mt-7 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                <DarkPanel title="Top models by live return">
                  <div className="space-y-4">
                    {leaderboard.length ? (
                      leaderboard.map((model) => (
                        <ModelBar
                          key={model.id || model.name}
                          model={model}
                          maxReturn={leaderboard[0]?.stats?.totalReturn || 1}
                        />
                      ))
                    ) : (
                      <p className="font-mono text-xs text-zinc-500">
                        Rankable model rows are not available yet.
                      </p>
                    )}
                  </div>
                </DarkPanel>

                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricBox
                    label="Portfolio value"
                    value={display(fmtDollar(data?.latest?.portfolioValue))}
                  />
                  <MetricBox
                    label="Benchmarks"
                    value={displayCount(benchmarkCount)}
                  />
                  <MetricBox
                    label="Submitted orders"
                    value={displayCount(
                      data?.submittedOrders?.length ??
                        data?.debug?.rowCounts?.submittedOrdersRows ??
                        null,
                    )}
                  />
                  <MetricBox
                    label="Source rows"
                    value={displayCount(totalRows)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Research Controls / Thesis ── */}
          <section className="border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black transition-colors">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
              <SectionIntro
                eyebrow="Research controls"
                title="Investment thesis"
                body="The MLEQ view is organized around model behavior, risk controls, comparable benchmarks, and execution transparency."
              />

              <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <Principle
                  icon={BrainCircuit}
                  number="01"
                  title="Adaptive allocation"
                >
                  Model exposure is reviewed against live portfolio state,
                  signal rows, and published account context.
                </Principle>
                <Principle
                  icon={Gauge}
                  number="02"
                  title="Benchmark discipline"
                >
                  Strategy curves are normalized against market benchmarks
                  before comparative claims are surfaced.
                </Principle>
                <Principle icon={LockKeyhole} number="03" title="Risk first">
                  Drawdown, observation count, status, and source gaps stay
                  visible inside the operating view.
                </Principle>
                <Principle
                  icon={LineChart}
                  number="04"
                  title="Execution transparency"
                >
                  Orders, positions, target weights, and decisions remain
                  inspectable after each model cycle.
                </Principle>
              </div>
            </div>
          </section>

          {/* ── Predictive Pipeline ── */}
          <section className="border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#09090b] transition-colors">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr]">
              <div>
                <SectionIntro
                  eyebrow="Execution foresight"
                  title="Predictive pipeline workflow"
                  body="Signal generation, risk assessment, benchmark evaluation, and execution audit rows are kept in the same review path."
                />

                <div className="mt-7 space-y-3">
                  {pipelineRows.map((row) => {
                    const Icon = row.icon;
                    const isActive = row.label === activePipeline.label;
                    return (
                      <button
                        type="button"
                        key={row.label}
                        onClick={() =>
                          setActivePipelineLabel(row.label as PipelineLabel)
                        }
                        className={`w-full rounded-[12px] border p-4 text-left transition ${
                          isActive
                            ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#1A1A1D] dark:text-zinc-400 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-zinc-950 dark:text-white leading-none mt-1">
                              {row.label}
                            </h3>
                            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-450">
                              {
                                workflowCopy[
                                  row.label as keyof typeof workflowCopy
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <DarkPanel title="Pipeline monitor">
                <div className="space-y-5">
                  <PipelineStageDetail
                    label={activePipeline.label as PipelineLabel}
                    value={Number(activePipeline.value || 0)}
                    maxValue={maxPipelineValue}
                  />

                  {pipelineRows.map((row) => {
                    const pct = Math.max(
                      6,
                      (Number(row.value || 0) / maxPipelineValue) * 100,
                    );
                    return (
                      <div key={`bar-${row.label}`}>
                        <div className="mb-2 flex justify-between font-mono text-[9px] tracking-wider uppercase text-zinc-500">
                          <span>{row.label}</span>
                          <span>{displayCount(Number(row.value || 0))}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <div
                            className="h-2 rounded-full bg-[#0F8F5A] dark:bg-[#12B76A]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black/40 p-4 font-mono text-[10px] leading-relaxed text-zinc-500">
                  {pipelineStageDetails[activePipeline.label as PipelineLabel]
                    .monitorNote}
                </div>
              </DarkPanel>
            </div>
          </section>

          {/* ── Multi-Discipline Review & Navigation ── */}
          <section className="bg-white dark:bg-[#09090b] transition-colors">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
              <SectionIntro
                eyebrow="Strategic grounding"
                title="Multi-discipline model review"
                body="The engine combines model telemetry, quantitative diagnostics, reinforcement learning outputs, and execution evidence."
              />

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <Discipline icon={Database} title="Source-aware fundamentals">
                  Repository metadata, benchmark windows, observation dates, and
                  account logs stay attached to every model view.
                </Discipline>
                <Discipline icon={Sigma} title="Quantitative diagnostics">
                  Return normalization, drawdown checks, hit-rate, and Sharpe
                  metrics keep behavior comparable across models.
                </Discipline>
                <Discipline icon={GitBranch} title="Reinforcement allocation">
                  BR-PPO model families update allocation views from live state,
                  rewards, and execution feedback.
                </Discipline>
                <Discipline icon={Workflow} title="Signal operations">
                  Sentiment and regime-aware systems connect NLP-derived signals
                  with systematic allocation controls.
                </Discipline>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none"
                >
                  Open live dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/research"
                  className="inline-flex h-11 items-center justify-center bg-transparent px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-550 dark:text-zinc-400 border border-zinc-350 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition rounded-none"
                >
                  View research terminal
                </Link>
              </div>

              {error && (
                <div className="mt-8 rounded-[8px] border border-rose-500/30 bg-rose-500/10 p-4 font-mono text-[10px] text-rose-600 dark:text-rose-400">
                  Dashboard API unavailable. Live terminal values will populate
                  when the API responds.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}

const workflowCopy = {
  "Signal generation":
    "Signal and model rows are read from source logs and normalized into dashboard state.",
  "Risk assessment":
    "Positions and drawdown behavior are reviewed before model output becomes an allocation view.",
  "Benchmark evaluation":
    "Market benchmarks are aligned to the published model window for comparable curves.",
  "Execution audit":
    "Submitted orders, account values, and run timestamps remain inspectable after each cycle.",
};

type PipelineLabel = keyof typeof workflowCopy;

const pipelineStageDetails: Record<
  PipelineLabel,
  { title: string; body: string; source: string; monitorNote: string }
> = {
  "Signal generation": {
    title: "Signal intake and model state",
    body: "The review starts by checking whether model signal history is present, current, and aligned with the selected research stream.",
    source: "Signal history rows",
    monitorNote:
      "Signal observations are treated as the first evidence layer before risk, benchmark, or execution review begins.",
  },
  "Risk assessment": {
    title: "Risk gates before allocation",
    body: "Position rows, drawdown behavior, and account exposure are reviewed before a signal can be treated as deployment-ready.",
    source: "Position and exposure rows",
    monitorNote:
      "Risk controls should stay visible before capital exposure, including stale data, drawdown, and allocation checks.",
  },
  "Benchmark evaluation": {
    title: "Comparable market context",
    body: "Benchmarks are aligned to the strategy window so model behavior can be reviewed beside relevant market reference series.",
    source: "Benchmark registry rows",
    monitorNote:
      "Benchmark context keeps strategy claims comparable and prevents isolated return numbers from being overread.",
  },
  "Execution audit": {
    title: "Order and run accountability",
    body: "Submitted orders and execution records are kept inspectable so the research path can be reconciled with operating activity.",
    source: "Submitted order rows",
    monitorNote:
      "Execution audit rows connect research output to operating evidence after each model cycle.",
  },
};

function PipelineStageDetail({
  label,
  value,
  maxValue,
}: {
  label: PipelineLabel;
  value: number;
  maxValue: number;
}) {
  const details = pipelineStageDetails[label];
  const pct = Math.max(6, (Number(value || 0) / Math.max(maxValue, 1)) * 100);

  return (
    <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            {label}
          </div>
          <h3 className="mt-2 font-mono text-sm font-bold tracking-wider uppercase text-zinc-955 dark:text-white">
            {details.title}
          </h3>
        </div>
        <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] px-3 py-2 text-right">
          <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
            Rows
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-zinc-950 dark:text-white leading-none">
            {displayCount(value)}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{details.body}</p>
      <div className="mt-4">
        <div className="mb-2 flex justify-between font-mono text-[9px] tracking-wider uppercase text-zinc-500">
          <span>{details.source}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-2 rounded-full bg-[#0F8F5A] dark:bg-[#12B76A]"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function TerminalPanel({
  modelName,
  linePath,
  isLoading,
  metrics,
  selectedStats,
  portfolioValue,
  dark,
}: {
  modelName: string;
  linePath: string;
  isLoading: boolean;
  metrics: Array<{ label: string; value: string; tone: string }>;
  selectedStats: Stats;
  portfolioValue?: number | null;
  dark: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            &gt;_ platform terminal
          </div>
          <h2 className="mt-3 font-mono text-base sm:text-lg font-bold tracking-wider text-zinc-950 dark:text-white uppercase leading-none">
            {modelName}
          </h2>
          <p className="mt-2 text-xs text-zinc-550 dark:text-zinc-400">
            Normalized equity and live model telemetry.
          </p>
        </div>
        <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 px-3 py-2 text-right">
          <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-550">
            Portfolio value
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-zinc-950 dark:text-white leading-none">
            {display(fmtDollar(portfolioValue))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[8px] border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-black/40 p-4">
        <svg
          viewBox="0 0 640 170"
          className="h-[170px] w-full"
          role="img"
          aria-label="Live normalized equity curve"
        >
          <defs>
            <linearGradient
              id="mleqLineProfessional"
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="0%" stopColor="#0F8F5A" />
              <stop offset="100%" stopColor="#12B76A" />
            </linearGradient>
            <linearGradient
              id="mleqAreaProfessional"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#0F8F5A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0F8F5A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            x2="640"
            y1="132"
            y2="132"
            stroke={dark ? "#27272a" : "#e4e4e7"}
            strokeDasharray="4 4"
          />
          {linePath ? (
            <>
              <path
                d={`${linePath} L 640 170 L 0 170 Z`}
                fill="url(#mleqAreaProfessional)"
              />
              <path
                d={linePath}
                fill="none"
                stroke="url(#mleqLineProfessional)"
                strokeWidth="2"
              />
            </>
          ) : (
            <text x="24" y="92" fill={dark ? "#71717a" : "#a1a1aa"} fontSize="12" fontFamily="monospace">
              Equity curve pending source rows
            </text>
          )}
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[8px] border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-black/40 p-4"
          >
            <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
              {metric.label}
            </div>
            <div className={`mt-1.5 font-mono text-sm sm:text-base font-bold ${metric.tone}`}>
              {isLoading ? "..." : metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-850 pt-4 font-mono text-[10px] text-zinc-550">
        <span>Observation status</span>
        <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider">
          {selectedStats.status || "Not available"}
        </span>
      </div>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-3xl text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-450">{body}</p>
    </div>
  );
}

function DarkPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-5">
      <h3 className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase border-b border-zinc-200 dark:border-zinc-850 pb-2">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-5">
      <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-2 font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-white uppercase leading-none">{value}</div>
    </div>
  );
}

function ModelBar({
  model,
  maxReturn,
}: {
  model: ModelComparison;
  maxReturn: number;
}) {
  const value = model.stats?.totalReturn;
  const width =
    finiteNumber(value) && finiteNumber(maxReturn) && maxReturn !== 0
      ? Math.max(
          4,
          Math.min(100, (Math.abs(value) / Math.abs(maxReturn)) * 100),
        )
      : 4;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="truncate text-zinc-650 dark:text-zinc-300 font-mono uppercase tracking-wider font-bold">
          {cleanText(model.name || model.id)}
        </span>
        <span className="text-zinc-950 dark:text-white font-mono font-bold">{display(fmtPct(value, true))}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-[#0F8F5A] dark:bg-[#12B76A]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function Principle({
  icon: Icon,
  number,
  title,
  children,
}: {
  icon: ElementType;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          {number}
        </span>
        <Icon className="h-4 w-4 text-zinc-950 dark:text-white" />
      </div>
      <h3 className="mt-5 font-mono text-sm font-bold tracking-wider uppercase text-zinc-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>
    </div>
  );
}

function Discipline({
  icon: Icon,
  title,
  children,
}: {
  icon: ElementType;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-5">
      <div className="flex gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-zinc-950 dark:text-white">{title}</h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">{children}</p>
        </div>
      </div>
    </div>
  );
}
