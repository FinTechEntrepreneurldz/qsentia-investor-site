'use client';

import { useState } from 'react';
import { Activity, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { SectionCard } from '@/components/PageChrome';
import { useTheme } from '@/components/ThemeProvider';

const scenarios = {
  steady: {
    label: 'Steady signal',
    confidence: 72,
    exposure: 38,
    drawdown: -1.8,
    status: 'Paper monitoring',
  },
  volatile: {
    label: 'Volatility event',
    confidence: 41,
    exposure: 0,
    drawdown: -4.6,
    status: 'Risk gate flattened',
  },
  stale: {
    label: 'Stale market data',
    confidence: 0,
    exposure: 0,
    drawdown: -1.2,
    status: 'Execution blocked',
  },
};

export default function SandboxDemo() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  const [key, setKey] = useState<keyof typeof scenarios>('steady');
  const [running, setRunning] = useState(true);
  const s = scenarios[key];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* ── Left Control Panel ── */}
      <SectionCard className="p-5 flex flex-col justify-between h-full bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
        <div>
          <div className="font-mono text-[9px] font-bold tracking-wider uppercase text-zinc-500">
            Scenario
          </div>
          <div className="mt-4 grid gap-2">
            {Object.entries(scenarios).map(([id, row]) => {
              const isSelected = key === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKey(id as keyof typeof scenarios)}
                  className={`rounded-[8px] border px-3 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider transition ${
                    isSelected
                      ? 'border-[#0F8F5A] bg-[#D1F1E1] text-[#0F8F5A] dark:border-[#12B76A] dark:bg-[#0F8F5A]/20 dark:text-[#12B76A]'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-850 dark:bg-black dark:text-zinc-400 dark:hover:bg-zinc-900'
                  }`}
                >
                  {row.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            aria-label={running ? 'Pause demo' : 'Run demo'}
            type="button"
            onClick={() => setRunning(!running)}
            className={`flex h-10 w-10 items-center justify-center rounded-[8px] transition ${
              dark
                ? 'bg-[#12B76A] text-black hover:bg-white'
                : 'bg-[#0F8F5A] text-white hover:bg-[#12B76A]'
            }`}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            aria-label="Reset demo"
            type="button"
            onClick={() => {
              setKey('steady');
              setRunning(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-zinc-300 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </SectionCard>

      {/* ── Right Simulation Panel ── */}
      <SectionCard className="overflow-hidden bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 px-6 py-4">
          <div>
            <div className="font-mono text-[9px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
              Synthetic sandbox
            </div>
            <h2 className="mt-1 font-mono text-base sm:text-lg font-bold tracking-wider text-zinc-950 dark:text-white uppercase">
              Execution-readiness preview
            </h2>
          </div>
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              running ? 'bg-[#0F8F5A] dark:bg-[#12B76A]' : 'bg-zinc-400 dark:bg-zinc-600'
            }`}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-px bg-zinc-200 dark:bg-zinc-850 sm:grid-cols-4">
          <Metric icon={<Activity />} label="Confidence" value={`${s.confidence}%`} />
          <Metric icon={<ShieldCheck />} label="Exposure" value={`${s.exposure}%`} />
          <Metric icon={<Activity />} label="Drawdown" value={`${s.drawdown}%`} />
          <Metric icon={<ShieldCheck />} label="Control state" value={s.status} />
        </div>

        {/* Simulator Grid & Graph */}
        <div className="p-6">
          <div className="h-44 border-b border-l border-zinc-200 dark:border-zinc-850 bg-[linear-gradient(to_right,rgba(15,143,90,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,143,90,0.05)_1px,transparent_1px)] bg-[size:52px_44px]">
            <div className="flex h-full items-end gap-2 p-4">
              {[34, 48, 44, 61, s.exposure, 53, 67, 72].map((v, i) => (
                <div
                  key={i}
                  className={`flex-1 transition-all duration-300 bg-[#0F8F5A] dark:bg-[#12B76A] rounded-t-[2px]`}
                  style={{
                    height: `${running ? v : 18}%`,
                    opacity: 0.4 + i * 0.06,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-wide text-zinc-500 leading-relaxed">
            All values on this page are synthetic and exist only to demonstrate interface behavior. They are not investment results, live signals, or model recommendations.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-h-24 bg-white dark:bg-[#1A1A1D] p-4 transition-colors">
      <span className="block text-[#0F8F5A] dark:text-[#12B76A] [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="mt-3 font-mono text-[9px] tracking-wider uppercase text-zinc-500">
        {label}
      </div>
      <div className="mt-1.5 font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-white uppercase leading-none">
        {value}
      </div>
    </div>
  );
}
