'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowRight, LogOut, ShieldCheck } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

type SessionPayload = {
  authenticated: boolean;
  authConfigured?: boolean;
  user: null | {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    provider?: string | null;
    adminRole?: string | null;
  };
};

type BillingPayload = {
  subscription?: {
    plan?: string | null;
    status?: string | null;
    currency?: string | null;
    monthlyAmount?: number | null;
  };
  usage?: Array<{ label: string; used: number; limit: number }>;
};

type WorkspacePayload = {
  account?: {
    environment?: string | null;
    stage?: string | null;
  };
};

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

function label(value?: string | null) {
  if (!value) return 'Not configured';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function compactCurrency(amount?: number | null, currency = 'USD') {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

async function signOut() {
  const supabase = getSupabaseBrowserClient();
  if (supabase) await supabase.auth.signOut();
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
  window.location.href = '/signin';
}

export default function MarketplaceWorkspaceBar({
  statusLabel,
  metaItems = [],
  compact = false,
}: {
  statusLabel?: string | null;
  metaItems?: Array<string | null | undefined>;
  compact?: boolean;
}) {
  const { data: session } = useSWR<SessionPayload>('/api/auth/session', fetcher, {
    refreshInterval: 60000,
  });
  const authenticated = Boolean(session?.authenticated && session.user);
  const isLocalPreview = session?.user?.provider === 'preview';
  const { data: billing } = useSWR<BillingPayload>(
    authenticated && !isLocalPreview ? '/api/customer/billing' : null,
    fetcher,
    { refreshInterval: 60000 }
  );
  const { data: workspace } = useSWR<WorkspacePayload>(
    authenticated && !isLocalPreview ? '/api/customer/workspace' : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  const usageSummary = useMemo(() => {
    const usage = billing?.usage || [];
    const limit = usage.reduce((sum, row) => sum + row.limit, 0);
    const used = usage.reduce((sum, row) => sum + row.used, 0);
    if (!limit) return null;
    return `${Math.max(limit - used, 0).toLocaleString('en-US')} req. avail.`;
  }, [billing?.usage]);

  const accountSummary = useMemo(() => {
    if (isLocalPreview) return 'Preview session';
    const amount = compactCurrency(
      billing?.subscription?.monthlyAmount ?? null,
      billing?.subscription?.currency || 'USD'
    );
    if (amount) return `${amount} MRR`;
    if (usageSummary) return usageSummary;
    return null;
  }, [billing?.subscription?.currency, billing?.subscription?.monthlyAmount, isLocalPreview, usageSummary]);

  const sessionMeta = [
    statusLabel ? `${statusLabel}` : null,
    ...metaItems,
    authenticated
      ? isLocalPreview
        ? 'Localhost only'
        : label(workspace?.account?.environment || billing?.subscription?.status || 'active')
      : 'View only',
  ].filter(Boolean) as string[];

  if (compact) {
    return (
      <div className="border-b border-white/8 bg-[#050505] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.26em] text-white/45">
              {sessionMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {authenticated ? (
              <>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#31f495]">
                  {accountSummary}
                </div>
                <Link
                  href="/user"
                  className="inline-flex h-9 items-center justify-center border border-white/12 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 transition hover:border-white/25 hover:text-white"
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                  }}
                  className="inline-flex h-9 items-center justify-center gap-2 px-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 transition hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/contact"
                  className="inline-flex h-9 items-center justify-center border border-white/12 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 transition hover:border-white/25 hover:text-white"
                >
                  Request access
                </Link>
                <Link
                  href="/signin?next=%2Fmarketplace"
                  className="inline-flex h-9 items-center justify-center gap-2 bg-white px-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black transition hover:bg-white/90"
                >
                  Log in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-white/10 bg-[#070707] text-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="shrink-0" aria-label="QSentia home">
            <Image
              src="/logo/qsentia-navigation.png"
              alt="QSentia"
              width={1582}
              height={681}
              className="h-8 w-auto object-contain invert brightness-[1.12] contrast-[1.08]"
            />
          </Link>
          <div className="hidden h-8 w-px bg-white/10 xl:block" />
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/35">
              Model marketplace
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.28em] text-white/55">
              {sessionMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          {authenticated ? (
            <>
              {accountSummary ? (
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#31f495]">
                  {accountSummary}
                </div>
              ) : null}
              <Link
                href="/user"
                className="inline-flex h-10 items-center justify-center border border-[#31f495]/35 bg-[#31f495] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-black transition hover:bg-[#5bf7ac]"
              >
                Manage access
              </Link>
              <Link
                href="/user"
                className="inline-flex h-10 items-center justify-center px-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 transition hover:text-white"
              >
                Portfolio
              </Link>
              {session?.user?.adminRole ? (
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center justify-center gap-2 px-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 transition hover:text-white"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  void signOut();
                }}
                className="inline-flex h-10 items-center justify-center gap-2 px-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 transition hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                Browse published models before sign-in
              </div>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center border border-white/12 px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70 transition hover:border-white/25 hover:text-white"
              >
                Request beta access
              </Link>
              <Link
                href="/signin?next=%2Fmarketplace"
                className="inline-flex h-10 items-center justify-center gap-2 bg-white px-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-black transition hover:bg-white/90"
              >
                Log in
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
