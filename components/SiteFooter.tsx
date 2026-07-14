"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function SiteFooter() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const links = [
    { href: "/privacy-policy", label: "PRIVACY" },
    { href: "/terms-and-conditions", label: "TERMS" },
    { href: "/disclaimer", label: "DISCLOSURES" },
    { href: "/compliance", label: "ADV FORM" },
    { href: "/contact", label: "CONTACT" },
    { href: "/team", label: "TEAM" },
    { href: "/status", label: "STATUS" },
  ];

  return (
    <footer className={`relative z-10 border-t transition-colors ${
      dark
        ? "border-zinc-900 bg-black text-zinc-400"
        : "border-zinc-200 bg-white text-zinc-500"
    }`}>
      {/* ── Links & Logo Row ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-mono text-[13px] font-bold tracking-[0.4em] uppercase transition hover:opacity-90 ${
              dark ? "text-white" : "text-zinc-950"
            }`}
            aria-label="Qsentia home"
          >
            QSENTIA
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Footer Navigation">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-mono text-[10px] font-bold tracking-[0.2em] transition ${
                  dark
                    ? "text-zinc-500 hover:text-white"
                    : "text-zinc-400 hover:text-zinc-950"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            © 2026 QSENTIA INC. FOR ACCREDITED INVESTORS ONLY.
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className={`mt-8 border-t pt-6 font-mono text-[9px] leading-relaxed tracking-wider text-zinc-600 dark:text-zinc-500 ${
          dark ? "border-zinc-900" : "border-zinc-200"
        }`}>
          Quantitative trading systems involve risk. Historical or paper-trading information does not guarantee future results. Data shown only reflects returned source logs.
        </div>
      </div>
    </footer>
  );
}
