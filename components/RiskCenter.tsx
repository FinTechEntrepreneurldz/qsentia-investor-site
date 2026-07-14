'use client';

import useSWR from 'swr';
import {
  AlertTriangle,
  Ban,
  CircleGauge,
  Crosshair,
  Radio,
  Scale,
  ShieldAlert,
  ToggleRight,
} from 'lucide-react';
import { ApiLoadingPanel, EmptyState, SectionCard } from '@/components/PageChrome';

type Payload = {
  latest?: {
    decision?: Record<string, unknown> | null;
    realismHardFail?: boolean | null;
    realismWarningCount?: number | null;
    submittedOrderCount?: number | null;
    hasLivePositions?: boolean;
  };
  positions?: Record<string, unknown>[];
  plannedOrders?: Record<string, unknown>[];
  submittedOrders?: Record<string, unknown>[];
  stats?: { maxDrawdown?: number | null };
  updatedAt?: string;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('Unavailable');
  return r.json();
};

const report = (value: unknown, suffix = '') =>
  value === null || value === undefined || value === '' ? 'Not reported' : `${value}${suffix}`;

export default function RiskCenter() {
  const { data, error, isLoading } = useSWR<Payload>('/api/dashboard', fetcher, {
    refreshInterval: 60000,
  });

  if (isLoading && !data) {
    return (
      <ApiLoadingPanel
        title="Loading risk controls"
        items={['Signal gates', 'Position state', 'Execution evidence']}
      />
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Risk data unavailable"
        body="The live dashboard source could not be reached."
      />
    );
  }

  const d = data.latest?.decision || {};
  const controls = [
    {
      icon: <CircleGauge />,
      label: 'Confidence threshold',
      value: report(d.confidence),
      evidence: 'Latest decision confidence',
    },
    {
      icon: <Ban />,
      label: 'Low-confidence flattening',
      value: report(d.target_contracts === '0' || d.target_contracts === 0 ? 'Flat target' : null),
      evidence: 'Derived only from current target contracts',
    },
    {
      icon: <AlertTriangle />,
      label: 'Fed-day blackout',
      value: 'Not reported',
      evidence: 'No calendar gate field in current payload',
    },
    {
      icon: <Scale />,
      label: 'Maximum notional',
      value: 'Not reported',
      evidence: 'No configured notional limit field',
    },
    {
      icon: <Crosshair />,
      label: 'Maximum contracts',
      value: report(d.target_contracts),
      evidence: 'Current target, not a policy limit',
    },
    {
      icon: <Radio />,
      label: 'Stale quote gate',
      value: 'Not reported',
      evidence: 'No quote-age control field',
    },
    {
      icon: <ShieldAlert />,
      label: 'Drawdown brake',
      value:
        typeof data.stats?.maxDrawdown === 'number'
          ? `${(data.stats.maxDrawdown * 100).toFixed(2)}% observed`
          : 'Not reported',
      evidence: 'Observed drawdown, not a configured threshold',
    },
    {
      icon: <ToggleRight />,
      label: 'Kill switch',
      value: data.latest?.realismHardFail === true ? 'Hard fail active' : 'Not reported',
      evidence: 'No explicit kill-switch state field',
    },
  ];

  return (
    <div className="grid gap-6">
      {/* ── Outer Risk Controls Box ── */}
      <SectionCard className="overflow-hidden bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
        {/* Header Summary Grid */}
        <div className="grid border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1A1A1D] sm:grid-cols-4">
          <Summary label="Account status" value={report(d.account_status)} />
          <Summary label="Current contracts" value={report(d.current_contracts)} />
          <Summary label="Target contracts" value={report(d.target_contracts)} />
          <Summary label="Orders submitted" value={report(data.latest?.submittedOrderCount)} />
        </div>

        {/* Controls Grid */}
        <div className="grid gap-px bg-zinc-200 dark:bg-zinc-800 md:grid-cols-2">
          {controls.map((c) => (
            <div key={c.label} className="bg-white dark:bg-[#1A1A1D] p-6 transition-colors">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white [&>svg]:h-4 [&>svg]:w-4">
                  {c.icon}
                </span>
                <div>
                  <div className="font-mono text-sm font-bold tracking-wider uppercase text-zinc-950 dark:text-white">
                    {c.label}
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-zinc-950 dark:text-white uppercase leading-none">
                    {c.value}
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-zinc-500">
                    {c.evidence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Bottom Reconciliation Evidence Rows ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Evidence
          title="Position reconciliation"
          value={`${data.positions?.length || 0} position row(s)`}
          body="Count returned by the active model source."
        />
        <Evidence
          title="Order reconciliation"
          value={`${data.submittedOrders?.length || 0} submitted row(s)`}
          body={`${data.plannedOrders?.length || 0} planned order row(s) returned.`}
        />
        <Evidence
          title="Realism monitoring"
          value={report(data.latest?.realismWarningCount)}
          body="Warnings from source telemetry; absence is shown as not reported."
        />
      </div>

      <p className="font-mono text-[10px] tracking-wide text-zinc-500 leading-relaxed">
        This page distinguishes observed states from configured policy limits. A missing limit is not treated as a passing control. Production execution requires documented limits, broker-side controls, reconciliation, and an independently tested kill switch.
      </p>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-2 font-mono text-sm font-bold text-zinc-950 dark:text-white uppercase truncate">
        {value}
      </div>
    </div>
  );
}

function Evidence({ title, value, body }: { title: string; value: string; body: string }) {
  return (
    <SectionCard className="p-5 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
      <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{title}</div>
      <div className="mt-3 font-mono text-lg font-bold text-zinc-950 dark:text-white uppercase">
        {value}
      </div>
      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </SectionCard>
  );
}
