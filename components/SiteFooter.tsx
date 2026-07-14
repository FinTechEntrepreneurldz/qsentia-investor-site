"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

type FooterLink = {
  href: string;
  label: string;
};

const footerColumns: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Investors",
    links: [
      { href: "/strategies", label: "Strategies" },
      { href: "/performance", label: "Performance" },
      { href: "/risk-management", label: "Risk management" },
      { href: "/data-room", label: "Data room" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/platform", label: "Overview" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/research", label: "Research" },
      { href: "/methodology", label: "How it works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/firm", label: "Firm" },
      { href: "/team", label: "Team" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/developers", label: "API docs" },
      { href: "/docs", label: "Technical docs" },
      { href: "/insights", label: "Research notes" },
      { href: "/compliance", label: "Compliance" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/disclaimer", label: "Risk disclaimer" },
      { href: "/privacy-policy", label: "Privacy" },
      { href: "/cookie-policy", label: "Cookies" },
      { href: "/terms-and-conditions", label: "Terms" },
      { href: "/security", label: "Security" },
    ],
  },
];

export default function SiteFooter() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <footer
      className={`relative z-10 border-t transition-colors ${
        dark
          ? "border-zinc-900 bg-black text-zinc-400"
          : "border-zinc-200 bg-white text-zinc-500"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:py-10">
        <div className="grid gap-9 lg:grid-cols-[0.44fr_1.56fr] lg:gap-16">
          <div className="flex items-center lg:justify-start">
            <Link href="/" className="inline-flex" aria-label="QSentia home">
              <Image
                src="/logo/qsentia-primary.png"
                alt="QSentia"
                width={170}
                height={38}
                className={`h-9 w-auto ${dark ? "invert" : ""}`}
                priority={false}
              />
            </Link>
          </div>

          <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2 lg:ml-auto lg:w-[80%] lg:grid-cols-5">
            {footerColumns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
                dark={dark}
              />
            ))}
          </div>
        </div>

        <div
          className={`mt-9 border-t pt-5 text-zinc-500 ${
            dark ? "border-zinc-900" : "border-zinc-200"
          }`}
        >
          <p className="text-xs leading-relaxed">
            Copyright 2026 QSentia LLC. Access may include accredited and
            non-accredited users where permitted.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  dark,
}: {
  title: string;
  links: FooterLink[];
  dark: boolean;
}) {
  return (
    <nav aria-label={title}>
      <h2
        className={`text-[13px] font-extrabold tracking-tight ${
          dark ? "text-white" : "text-zinc-950"
        }`}
      >
        {title}
      </h2>
      <ul className="mt-3 grid gap-2">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link
              href={link.href}
              className={`text-[13px] leading-5 transition ${
                dark
                  ? "text-zinc-500 hover:text-white"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
