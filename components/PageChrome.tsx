"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Loader2, Menu, X } from "lucide-react";
import AuthSessionMenu from "@/components/AuthSessionMenu";
import { useTheme } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";



const navItems = [
  {
    href: "/platform",
    label: "PRODUCT",
    children: [
      {
        href: "/platform",
        label: "Platform overview",
        description: "Telemetry, validation, broker readiness, and audit trails.",
      },
      {
        href: "/demo",
        label: "Interactive demo",
        description: "A clearly labeled synthetic product sandbox.",
      },
      {
        href: "/integrations",
        label: "Integrations",
        description: "Current connectivity and planned connector status.",
      },
    ],
  },
  {
    href: "/strategies",
    label: "MODELS",
    children: [
      {
        href: "/strategies",
        label: "Investment strategies",
        description: "Objectives, operating status, and published model evidence.",
      },
      {
        href: "/marketplace",
        label: "Model marketplace",
        description: "Published model cards and commercial access.",
      },
      {
        href: "/performance",
        label: "Performance center",
        description: "Returns, benchmarks, rolling risk, and methodology.",
      },
    ],
  },
  {
    href: "/methodology",
    label: "HOW IT WORKS",
    children: [
      {
        href: "/methodology",
        label: "Methodology",
        description: "The process from inputs through monitored execution.",
      },
      {
        href: "/risk-management",
        label: "Risk management",
        description: "Signal gates, limits, reconciliation, and controls.",
      },
      {
        href: "/research",
        label: "Research terminal",
        description: "Live fund tickers, filters, and normalized curves.",
      },
    ],
  },
  {
    href: "/data-room",
    label: "PROFESSIONALS",
    children: [
      {
        href: "/data-room",
        label: "Investor data room",
        description: "Qualification and controlled diligence materials.",
      },
      {
        href: "/contact",
        label: "Request materials",
        description: "Reach out for investor materials or beta access.",
      },
    ],
  },
  {
    href: "/developers",
    label: "CREATORS",
    children: [
      {
        href: "/developers",
        label: "Developer center",
        description: "API contracts, keys, schemas, and OpenAPI.",
      },
      {
        href: "/docs",
        label: "API docs",
        description: "Technical resources and endpoint references.",
      },
    ],
  },
  {
    href: "/pricing",
    label: "PRICING",
    children: [
      {
        href: "/pricing",
        label: "Plans",
        description: "Research, marketplace, monitoring, and enterprise packaging.",
      },
    ],
  },
  {
    href: "/compliance",
    label: "TRUST",
    children: [
      {
        href: "/compliance",
        label: "Compliance centre",
        description: "Product boundaries, policy status, and operating controls.",
      },
      {
        href: "/security",
        label: "Security",
        description: "Security posture and data protection controls.",
      },
    ],
  },
  {
    href: "/team",
    label: "COMPANY",
    children: [
      {
        href: "/firm",
        label: "Firm",
        description: "Research philosophy and institutional operating model.",
      },
      {
        href: "/team",
        label: "Team",
        description: "Leadership, software development, and quantitative research.",
      },
      {
        href: "/careers",
        label: "Careers",
        description: "Open roles and candidate intake.",
      },
    ],
  },
];

export function SiteHeader({
  active,
}: {
  active?: string;
  theme?: "light" | "dark";
}) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors ${
      dark
        ? "border-white/10 bg-black/90"
        : "border-zinc-200/80 bg-white/90"
    } backdrop-blur-xl`}>
      <div className="mx-auto grid h-[72px] max-w-[1480px] grid-cols-[auto_1fr_auto] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex h-11 min-w-[156px] items-center transition hover:opacity-80"
          aria-label="QSentia home"
        >
          <Image
            src="/logo/qsentia-primary.png"
            alt="QSentia"
            width={150}
            height={36}
            priority
            className={`h-8 w-auto ${dark ? "invert" : ""}`}
          />
        </Link>

        <nav className="hidden min-w-0 justify-center 2xl:flex" aria-label="Primary navigation">
          <div
            className={`flex min-w-0 items-center gap-1 rounded-full border px-1.5 py-1.5 shadow-sm ${
              dark
                ? "border-white/10 bg-white/[0.035]"
                : "border-zinc-200 bg-zinc-50/80"
            }`}
          >
          {navItems.map((item) => {
            const isActive =
              active === item.href ||
              item.children?.some((child) => child.href === active);

            return (
              <div
                key={item.href}
                className="group relative"
              >
                <Link
                  href={item.href}
                  className={`inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-[12px] font-semibold tracking-normal transition ${
                    isActive
                      ? dark
                        ? "bg-white text-black shadow-sm"
                        : "bg-zinc-950 text-white shadow-sm"
                      : dark
                        ? "text-zinc-400 hover:bg-white/10 hover:text-white"
                        : "text-zinc-600 hover:bg-white hover:text-zinc-950"
                  }`}
                  aria-haspopup={item.children ? "menu" : undefined}
                >
                  {formatNavLabel(item.label)}
                </Link>
                {item.children && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[360px] -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition duration-150 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    <div
                      className={`overflow-hidden rounded-2xl border p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.65)] ${
                        dark
                          ? "border-white/10 bg-[#09090b]/98"
                          : "border-zinc-200 bg-white/98"
                      }`}
                      role="menu"
                    >
                      <div className="grid gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-xl px-4 py-3 transition ${
                              active === child.href
                                ? dark
                                  ? "bg-white/10 text-white"
                                  : "bg-zinc-100 text-zinc-950"
                                : dark
                                  ? "text-zinc-300 hover:bg-white/10 hover:text-white"
                                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            }`}
                            role="menuitem"
                          >
                            <span className={`block text-[13px] font-semibold ${
                              dark ? "text-zinc-200" : "text-zinc-800"
                            }`}>
                              {child.label}
                            </span>
                            <span className={`mt-1 block text-xs leading-5 ${
                              dark ? "text-zinc-500" : "text-zinc-400"
                            }`}>
                              {child.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </nav>

        <div className="hidden min-w-[290px] items-center justify-end gap-3 2xl:flex">
          <ThemeSwitcher />
          <Link
            href="/contact"
            className={`inline-flex h-10 items-center justify-center rounded-full border px-4 text-[11px] font-semibold tracking-wide transition ${
              dark
                ? "border-white/20 text-white hover:border-white hover:bg-white/10"
                : "border-zinc-300 text-zinc-800 hover:border-zinc-950 hover:bg-zinc-50"
            }`}
          >
            Request beta access
          </Link>
          <AuthSessionMenu />
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border 2xl:hidden transition ${
            dark
              ? "border-zinc-800 text-white hover:border-zinc-500"
              : "border-zinc-300 text-zinc-950 hover:border-zinc-400"
          }`}
        >
          {menuOpen ? <X className="h-4 w-4" strokeWidth={1.5} /> : <Menu className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>
      {menuOpen ? (
        <nav
          className={`border-t px-4 py-4 2xl:hidden ${
            dark
              ? "border-zinc-900 bg-black"
              : "border-zinc-200 bg-white"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <div key={item.href} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-mono text-[11px] font-bold tracking-widest uppercase py-1 ${
                    dark ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className={`ml-3 grid gap-1 border-l pl-3 ${
                    dark ? "border-zinc-800" : "border-zinc-200"
                  }`}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                        className={`rounded px-3 py-1.5 text-xs transition font-mono tracking-wider ${
                          dark
                            ? "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      >
                        {child.label.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className={`mt-3 border-t pt-3 flex items-center justify-between gap-4 ${
              dark ? "border-zinc-900" : "border-zinc-200"
            }`}>
              <div className="flex items-center gap-2">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex h-10 items-center rounded-full border px-3 text-[11px] font-semibold ${
                    dark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-zinc-300 text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  Request beta access
                </Link>
                <AuthSessionMenu />
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function PageShell({
  active,
  children,
  className = "",
}: {
  active?: string;
  children: ReactNode;
  className?: string;
  headerTheme?: "light" | "dark";
}) {
  const { resolvedTheme } = useTheme();
  const hasCustomBackground = className.includes("bg-");
  const hasCustomTextColor = className.includes("text-");

  return (
    <main
      className={`min-h-screen ${hasCustomBackground ? "" : "bg-white dark:bg-[#09090b]"} ${hasCustomTextColor ? "" : "text-zinc-950 dark:text-zinc-50"} ${className}`}
    >
      <SiteHeader active={active} theme={resolvedTheme} />
      {children}
    </main>
  );
}


export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center border border-zinc-300 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
      {children}
    </div>
  );
}

function formatNavLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TechnicalBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.06)_1px,transparent_1px)] bg-[size:86px_86px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)]" />
      <div className="absolute left-[7%] top-[18%] h-16 w-16 rotate-[31deg] rounded-[5px] border border-zinc-300/60 dark:border-white/10" />
      <div className="absolute left-[16%] top-[11%] h-9 w-9 rotate-[8deg] rounded-[5px] border border-zinc-300/60 dark:border-white/10" />
      <div className="absolute bottom-[21%] left-[5%] h-3 w-3 rounded-full bg-zinc-300/60 ring-8 ring-zinc-200/60 dark:bg-white/10 dark:ring-white/5" />
      <div className="absolute right-[9%] top-[17%] h-20 w-20 -rotate-[16deg] rounded-[6px] border border-zinc-300/50 dark:border-white/10" />
      <div className="absolute bottom-[16%] right-[17%] h-2.5 w-2.5 rounded-full bg-zinc-300/60 ring-6 ring-zinc-200/60 dark:bg-white/10 dark:ring-white/5" />
    </div>
  );
}

export function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#09090b] ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-black">
      <div className="font-semibold text-zinc-950 dark:text-white">{title}</div>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </div>
  );
}

export function ApiLoadingPanel({
  title = "Loading live data",
  body = "Preparing source-backed telemetry for this workspace.",
  tone = "light",
  items = ["Model registry", "Portfolio history", "Benchmark data"],
}: {
  title?: string;
  body?: string;
  tone?: "light" | "dark";
  items?: string[];
}) {
  const dark = tone === "dark";

  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border p-6 shadow-sm sm:p-8 ${
        dark
          ? "border-[#27272a] bg-[#080d1c] text-white"
          : "border-zinc-200 bg-white text-zinc-950"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        aria-hidden
        className={`absolute inset-0 ${
          dark
            ? "bg-[linear-gradient(to_right,rgba(111,124,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(111,124,255,0.08)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,rgba(24,24,27,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.06)_1px,transparent_1px)]"
        } bg-[size:64px_64px]`}
      />
      <div
        aria-hidden
        className={`absolute right-8 top-8 h-14 w-14 rotate-[16deg] rounded-md border ${dark ? "border-white/10" : "border-zinc-300/70"}`}
      />
      <div
        aria-hidden
        className={`absolute bottom-8 left-8 h-2.5 w-2.5 rounded-full ${dark ? "bg-white/15 ring-8 ring-white/5" : "bg-zinc-300/80 ring-8 ring-zinc-200/70"}`}
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
              dark
                ? "border border-[#3f3f46] bg-[#09090b] text-[#00d6b8]"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
          <div>
            <div
              className={`text-lg font-semibold ${dark ? "text-white" : "text-zinc-950"}`}
            >
              {title}
            </div>
            <p
              className={`mt-1 max-w-2xl text-sm leading-6 ${dark ? "text-zinc-400" : "text-zinc-600"}`}
            >
              {body}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <div
              key={item}
              className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                dark
                  ? "border-[#27272a] bg-[#09090b] text-[#cbd5e1]"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div
          className={`mt-6 h-1.5 overflow-hidden rounded-full ${dark ? "bg-zinc-900" : "bg-zinc-100"}`}
        >
          <div
            className={`h-full w-1/3 rounded-full [animation:buffer-slide_1.45s_ease-in-out_infinite] ${
              dark ? "bg-white" : "bg-zinc-950"
            }`}
          />
        </div>
      </div>

      <style>{`
        @keyframes buffer-slide {
          0% { transform: translateX(-115%); }
          55% { transform: translateX(190%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
}
