'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

import {
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
          className={`hidden h-10 w-24 animate-pulse rounded-md md:block ${
            dark ? 'bg-white/10' : 'bg-[#f4f4f5]'
          }`}
        />
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-md border ${
            dark ? 'border-[#3f3f46] text-[#d4d4d8]' : 'border-[#e4e4e7] text-[#18181b]'
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
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        href: '/customer',
        label: 'Settings',
        detail: 'Billing, API keys, broker setup',
        icon: <Settings className="h-4 w-4" />,
      },
      adminRole
        ? {
            href: '/admin',
            label: 'Administration',
            detail: adminLabel || 'Admin workspace',
            icon: <ShieldCheck className="h-4 w-4" />,
          }
        : null,
    ].filter(Boolean) as Array<{ href: string; label: string; detail: string; icon: ReactNode }>;

    return (
      <div ref={menuRef} className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`inline-flex h-10 max-w-[220px] items-center gap-2 rounded-full border px-2.5 transition ${
            dark
              ? 'border-[#3f3f46] bg-[#18181b] text-white hover:border-[#d4d4d8]'
              : 'border-[#d4d4d8] bg-white text-[#18181b] hover:border-[#18181b] hover:bg-[#fafafa]'
          }`}
          title={`${name} via ${providerLabel(provider)}`}
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              dark ? 'bg-[#09090b] text-[#d4d4d8]' : 'bg-[#f4f4f5] text-[#18181b]'
            }`}
          >
            {initialsFor(name, email)}
          </span>
          <span className="hidden min-w-0 text-left lg:block">
            <span className="block truncate text-sm font-semibold leading-4">{name}</span>
            <span className={`block truncate text-[11px] leading-4 ${dark ? 'text-[#a1a1aa]' : 'text-[#71717a]'}`}>
              {providerLabel(provider)}
            </span>
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
        </button>

        {open ? (
          <div
            className={`absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[10px] border shadow-[0_22px_55px_rgba(15,23,42,0.18)] ${
              dark ? 'border-[#3f3f46] bg-[#09090b]' : 'border-[#e4e4e7] bg-white'
            }`}
            role="menu"
          >
            <div className={`border-b p-4 ${dark ? 'border-[#27272a]' : 'border-[#e4e4e7]'}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    dark ? 'bg-[#18181b] text-[#d4d4d8]' : 'bg-[#f4f4f5] text-[#18181b]'
                  }`}
                >
                  {initialsFor(name, email)}
                </span>
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${dark ? 'text-white' : 'text-[#09090b]'}`}>
                    {name}
                  </div>
                  {email ? (
                    <div className={`truncate text-xs ${dark ? 'text-[#a1a1aa]' : 'text-[#71717a]'}`}>{email}</div>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${
                        dark
                          ? 'border-[#3f3f46] bg-[#18181b] text-[#d4d4d8]'
                          : 'border-[#e4e4e7] bg-[#fafafa] text-[#18181b]'
                      }`}
                    >
                      <ProviderMark provider={provider} />
                      {providerLabel(provider)}
                    </span>
                    {adminLabel ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${
                          dark
                            ? 'border-[#3f3f46] bg-[#18181b] text-[#d4d4d8]'
                            : 'border-[#e4e4e7] bg-[#fafafa] text-[#18181b]'
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {adminLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              {dropdownLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 rounded-md px-3 py-3 transition ${
                    dark ? 'text-[#e4e4e7] hover:bg-[#18181b]' : 'text-[#18181b] hover:bg-[#fafafa]'
                  }`}
                  role="menuitem"
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      dark ? 'bg-[#18181b] text-[#d4d4d8]' : 'bg-[#f4f4f5] text-[#18181b]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className={`mt-0.5 block text-xs leading-5 ${dark ? 'text-[#a1a1aa]' : 'text-[#71717a]'}`}>
                      {item.detail}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className={`border-t p-2 ${dark ? 'border-[#27272a]' : 'border-[#e4e4e7]'}`}>
              <button
                type="button"
                onClick={signOut}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition ${
                  dark ? 'text-[#e4e4e7] hover:bg-[#18181b]' : 'text-[#18181b] hover:bg-[#fafafa]'
                }`}
                role="menuitem"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    dark ? 'bg-[#18181b] text-[#d4d4d8]' : 'bg-[#f4f4f5] text-[#18181b]'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                </span>
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Link
        href={signinHref}
        className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-center text-[12px] font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
      >
        Log in
      </Link>
    </div>
  );
}

