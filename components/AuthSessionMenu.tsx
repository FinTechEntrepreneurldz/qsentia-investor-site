'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

import {
  Bell,
  ChevronDown,
  ChevronRight,
  FileText,
  Landmark,
  LifeBuoy,
  Loader2,
  LogOut,
  Moon,
  ReceiptText,
  Settings,
  WalletCards,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

type AdminRole = 'super_admin' | 'admin' | 'operations_admin';

type SessionPayload = {
  authenticated: boolean;
  authConfigured?: boolean;
  user: null | {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    provider?: string | null;
    adminRole?: AdminRole | null;
  };
};

function initialsFor(name?: string | null, email?: string | null) {
  const source = (name || email || 'QSentia user').trim();
  const parts = source
    .replace(/@.*/, '')
    .split(/\s|\.|_/)
    .filter(Boolean);

  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)).toUpperCase();
}

function AccountRow({
  href,
  icon,
  label,
  detail,
  badge,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  detail?: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-3 border-b border-[#eef0ef] px-4 py-3 text-[#2f3542] transition hover:bg-[#F5F5F6]"
      role="menuitem"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#5a6270]">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold">{label}</span>
        {detail ? <span className="mt-0.5 block truncate text-[11px] text-[#7b8493]">{detail}</span> : null}
      </span>
      {badge ? (
        <span className="rounded-full bg-[#e2f4ec] px-2.5 py-1 text-[10px] font-bold text-[#0F8F5A]">{badge}</span>
      ) : null}
      <ChevronRight className="h-4 w-4 text-[#9aa1ad] transition group-hover:translate-x-0.5 group-hover:text-[#0F8F5A]" />
    </Link>
  );
}

export default function AuthSessionMenu({}: { theme?: 'light' | 'dark' }) {
  const { resolvedTheme } = useTheme();
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dark = resolvedTheme === 'dark';

  const signinHref = useMemo(() => {
    const next = pathname && pathname !== '/signin' ? pathname : '/user';
    return `/signin?next=${encodeURIComponent(next)}`;
  }, [pathname]);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    async function refreshSession() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const payload = (await response.json()) as SessionPayload;
        if (active) setSession(payload);
      } catch {
        if (active) setSession({ authenticated: false, user: null });
      } finally {
        if (active) setLoading(false);
      }
    }

    refreshSession();

    if (!supabase) {
      return () => {
        active = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshSession();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    setOpen(false);
    if (supabase) await supabase.auth.signOut();
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    setSession({ authenticated: false, user: null });
    window.location.href = '/signin';
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2" aria-label="Checking account session">
        <span
          className={`hidden h-10 w-24 animate-pulse rounded-full md:block ${
            dark ? 'bg-zinc-900' : 'bg-zinc-100'
          }`}
        />
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${
            dark ? 'border-zinc-850 text-zinc-500' : 'border-zinc-200 text-zinc-400'
          }`}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      </div>
    );
  }

  if (session?.authenticated && session.user) {
    const name = session.user.name || session.user.email || 'Investor';
    const email = session.user.email || '';

    return (
      <div ref={menuRef} className="relative flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className={`hidden h-9 w-9 items-center justify-center rounded-full border transition md:inline-flex ${
            dark
              ? 'border-zinc-800 bg-black text-zinc-300 hover:border-zinc-600'
              : 'border-[#dbe1dd] bg-white text-[#3a414b] hover:border-[#0F8F5A] hover:text-[#0F8F5A]'
          }`}
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`inline-flex h-9 items-center gap-2 rounded-full border pl-1.5 pr-2.5 transition ${
            dark
              ? 'border-zinc-800 bg-black text-white hover:border-zinc-600'
              : 'border-[#dbe1dd] bg-white text-[#171c24] shadow-sm hover:border-[#0F8F5A]'
          }`}
          title={email || name}
        >
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#0F8F5A] text-[10px] font-bold text-white">
            {initialsFor(name, email)}
          </span>
          <span className="hidden text-[12px] font-semibold text-[#323844] sm:block">Portfolio</span>
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-[#7b8493] transition ${open ? 'rotate-180' : ''}`} />
        </button>

        {open ? (
          <div
            className="absolute right-0 top-full z-50 mt-3 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[#dfe4e1] bg-white text-[#171c24] shadow-[0_18px_60px_rgba(20,28,24,0.14)]"
            role="menu"
          >
            <div className="flex items-start gap-3 border-b border-[#eef0ef] p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2f4ec] text-sm font-bold text-[#0F8F5A]">
                {initialsFor(name, email)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold leading-tight">{name}</div>
                {email ? <div className="mt-0.5 truncate text-[12px] text-[#697386]">{email}</div> : null}
              </div>
              <Link
                href="/user"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#697386] transition hover:bg-[#F5F5F6] hover:text-[#0F8F5A]"
                aria-label="Account settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>

            <AccountRow
              href="/user/wallet"
              icon={<WalletCards className="h-4.5 w-4.5" />}
              label="$47,850.00 available"
              detail="$89,760 allocated across ML models"
              onClick={() => setOpen(false)}
            />
            <AccountRow
              href="/user/orders"
              icon={<ReceiptText className="h-4.5 w-4.5" />}
              label="All orders"
              detail="Model subscriptions and allocation changes"
              onClick={() => setOpen(false)}
            />
            <AccountRow
              href="/user/wallet"
              icon={<Landmark className="h-4.5 w-4.5" />}
              label="Bank and funding details"
              detail="Deposits, withdrawals, settlement account"
              onClick={() => setOpen(false)}
            />
            <AccountRow
              href="/contact"
              icon={<LifeBuoy className="h-4.5 w-4.5" />}
              label="24 x 7 investor support"
              detail="Allocation, KYC, and execution help"
              onClick={() => setOpen(false)}
            />
            <AccountRow
              href="/user/reports"
              icon={<FileText className="h-4.5 w-4.5" />}
              label="Reports"
              detail="Statements, model activity, tax exports"
              badge="Tax docs"
              onClick={() => setOpen(false)}
            />

            <div className="flex items-center justify-between border-b border-[#eef0ef] bg-[#fafafa] px-4 py-3 text-[13px] font-semibold text-[#3a414b]">
              <span className="inline-flex items-center gap-3">
                <Moon className="h-4 w-4 text-[#697386]" />
                Appearance
              </span>
              <span className="text-[12px] font-medium text-[#7b8493]">System</span>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold text-[#3a414b] transition hover:bg-[#F5F5F6]"
              role="menuitem"
            >
              <span className="inline-flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center text-[#5a6270]">
                  <LogOut className="h-4.5 w-4.5" />
                </span>
                Log out
              </span>
              <ChevronRight className="h-4 w-4 text-[#9aa1ad]" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Link
        href={signinHref}
        className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-center text-[12px] font-semibold text-zinc-900 transition hover:border-[#0F8F5A] hover:text-[#0F8F5A] dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white"
      >
        Log in
      </Link>
    </div>
  );
}
