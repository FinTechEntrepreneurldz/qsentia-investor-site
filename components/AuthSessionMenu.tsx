'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  ShieldCheck,
  UserCircle2,
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

function providerLabel(provider?: string | null) {
  if (!provider) return 'Email';
  if (provider === 'google') return 'Google';
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function roleLabel(role?: AdminRole | null) {
  if (role === 'super_admin') return 'Super admin';
  if (role === 'operations_admin') return 'Operations admin';
  if (role === 'admin') return 'Admin';
  return null;
}

function initialsFor(name?: string | null, email?: string | null) {
  const source = (name || email || 'QSentia user').trim();
  const parts = source
    .replace(/@.*/, '')
    .split(/\s|\.|_/)
    .filter(Boolean);

  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)).toUpperCase();
}

function ProviderMark({ provider }: { provider?: string | null }) {
  if (provider === 'google') return <span className="text-[11px] font-black">G</span>;
  return <UserCircle2 className="h-3.5 w-3.5" />;
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
    const next = pathname && pathname !== '/signin' ? pathname : '/dashboard';
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
          className={`hidden h-10 w-24 animate-pulse rounded-none md:block ${
            dark ? 'bg-zinc-900' : 'bg-zinc-100'
          }`}
        />
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-none border ${
            dark ? 'border-zinc-850 text-zinc-500' : 'border-zinc-200 text-zinc-400'
          }`}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      </div>
    );
  }

  if (session?.authenticated && session.user) {
    const name = session.user.name || session.user.email || 'Signed in';
    const email = session.user.email || '';
    const provider = session.user.provider || 'email';
    const adminRole = session.user.adminRole || null;
    const adminLabel = roleLabel(adminRole);
    const dropdownLinks = [
      {
        href: '/dashboard',
        label: 'Dashboard',
        detail: 'Model telemetry and research views',
        icon: <LayoutDashboard className="h-3.5 w-3.5" />,
      },
      {
        href: '/customer',
        label: 'Settings',
        detail: 'Billing, API keys, broker setup',
        icon: <Settings className="h-3.5 w-3.5" />,
      },
      adminRole
        ? {
            href: '/admin',
            label: 'Administration',
            detail: adminLabel || 'Admin workspace',
            icon: <ShieldCheck className="h-3.5 w-3.5" />,
          }
        : null,
    ].filter(Boolean) as Array<{ href: string; label: string; detail: string; icon: ReactNode }>;

    return (
      <div ref={menuRef} className="relative flex items-center gap-2">
        <Link
          href="/dashboard"
          className={`hidden h-10 items-center justify-center px-4 font-mono text-[11px] font-bold tracking-[0.22em] uppercase transition sm:inline-flex rounded-none ${
            dark
              ? 'bg-[#eeeeee] text-black hover:bg-white'
              : 'bg-zinc-950 text-white hover:bg-zinc-800'
          }`}
        >
          Dashboard
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`inline-flex h-10 max-w-[240px] items-center gap-3 rounded-none border px-3 transition ${
            dark
              ? 'border-zinc-850 bg-black text-white hover:border-zinc-700'
              : 'border-zinc-200 bg-white text-zinc-950 hover:border-zinc-400 hover:bg-zinc-50'
          }`}
          title={`${name} via ${providerLabel(provider)}`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-none text-[10px] font-bold font-mono border ${
              dark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                : 'bg-zinc-100 border-zinc-200 text-zinc-800'
            }`}
          >
            {initialsFor(name, email)}
          </span>
          <span className="hidden min-w-0 text-left lg:block">
            <span className="block truncate font-mono text-[11px] font-bold tracking-wider uppercase leading-none">{name}</span>
            <span className="block truncate font-mono text-[9px] tracking-wider uppercase text-zinc-500 mt-0.5 leading-none">
              {providerLabel(provider)}
            </span>
          </span>
          <ChevronDown className={`h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500 transition ${open ? 'rotate-180' : ''}`} />
        </button>

        {open ? (
          <div
            className={`absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-none border shadow-md ${
              dark ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'
            }`}
            role="menu"
          >
            <div className={`border-b p-4 ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-none text-xs font-bold font-mono border ${
                    dark
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-850'
                  }`}
                >
                  {initialsFor(name, email)}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs font-bold tracking-wider uppercase text-zinc-950 dark:text-white leading-none">
                    {name}
                  </div>
                  {email ? (
                    <div className="truncate font-mono text-[10.5px] text-zinc-500 lowercase mt-1 leading-none">
                      {email}
                    </div>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-none border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase ${
                        dark
                          ? 'border-zinc-800 bg-zinc-900 text-zinc-400'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                      }`}
                    >
                      <ProviderMark provider={provider} />
                      {providerLabel(provider)}
                    </span>
                    {adminLabel ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-none border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase ${
                          dark
                            ? 'border-zinc-800 bg-zinc-900 text-zinc-400'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-850'
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {adminLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-1">
              {dropdownLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 rounded-none px-3 py-2 transition ${
                    dark ? 'text-zinc-300 hover:bg-zinc-900' : 'text-zinc-850 hover:bg-zinc-50'
                  }`}
                  role="menuitem"
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-none border ${
                      dark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-650'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-xs font-bold tracking-wider uppercase">{item.label}</span>
                    <span className="mt-0.5 block font-mono text-[10px] lowercase tracking-wider text-zinc-500">
                      {item.detail}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className={`border-t p-1 ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <button
                type="button"
                onClick={signOut}
                className={`flex w-full items-center gap-3 rounded-none px-3 py-2 text-left transition ${
                  dark ? 'text-zinc-300 hover:bg-zinc-900' : 'text-zinc-850 hover:bg-zinc-50'
                }`}
                role="menuitem"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-none border ${
                    dark
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-650'
                  }`}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-xs font-bold tracking-wider uppercase">Sign out</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <Link
        href="/strategies"
        className="font-mono text-[11px] font-bold tracking-[0.22em] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white uppercase transition"
      >
        Explore
      </Link>
      <Link
        href={signinHref}
        className="inline-flex h-10 items-center justify-center bg-zinc-900 dark:bg-[#eeeeee] px-7 text-center font-mono text-[11px] font-bold tracking-[0.22em] text-white dark:text-black uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none"
      >
        Log In
      </Link>
    </div>
  );
}

