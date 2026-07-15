import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/PageChrome';

export type PolicySection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  content?: ReactNode;
};

type Reference = {
  label: string;
  href: string;
};

export default function PolicyDocument({
  title,
  eyebrow,
  summary,
  effectiveDate,
  version,
  sections,
  notice,
  references = [],
}: {
  title: string;
  eyebrow: string;
  summary: string;
  effectiveDate: string;
  version: string;
  sections: readonly PolicySection[];
  notice?: string;
  references?: readonly Reference[];
}) {
  return (
    <PageShell>
<<<<<<< HEAD
      <section className="border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
=======
      <section className="border-b border-[#E5E5E7] bg-[#F5F5F6]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#12B76A]">
            <FileCheck2 className="h-4 w-4" />
>>>>>>> origin/main
            {eyebrow}
          </div>
          <h1 className="mt-8 max-w-6xl text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-7xl lg:text-[5.5rem]">
            {title}
          </h1>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 md:text-base">{summary}</p>
          <div className="mt-8 grid gap-px overflow-hidden border border-zinc-200 bg-zinc-200 font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-3">
            <span className="bg-white px-4 py-3 dark:bg-[#09090b]"><strong className="text-zinc-950 dark:text-white">Effective</strong> / {effectiveDate}</span>
            <span className="bg-white px-4 py-3 dark:bg-[#09090b]"><strong className="text-zinc-950 dark:text-white">Version</strong> / {version}</span>
            <span className="bg-white px-4 py-3 dark:bg-[#09090b]"><strong className="text-zinc-950 dark:text-white">Owner</strong> / QSentia LLC</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:py-14">
        <aside className="self-start lg:sticky lg:top-24">
<<<<<<< HEAD
          <div className="border-l border-zinc-200 pl-4 dark:border-zinc-800">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Contents</div>
=======
          <div className="border-l-2 border-[#E5E5E7] pl-4">
            <div className="text-xs font-bold uppercase tracking-wide text-[#647269]">Contents</div>
>>>>>>> origin/main
            <nav className="mt-4 grid gap-2" aria-label={`${title} contents`}>
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
<<<<<<< HEAD
                  className="font-mono text-[11px] uppercase leading-6 tracking-wider text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white"
=======
                  className="text-sm leading-6 text-[#46554b] transition hover:text-[#0F8F5A]"
>>>>>>> origin/main
                >
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </div>

<<<<<<< HEAD
          <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-950 dark:text-white">
              <Mail className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
=======
          <div className="mt-8 border-t border-[#E5E5E7] pt-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#06130c]">
              <Mail className="h-4 w-4 text-[#0F8F5A]" />
>>>>>>> origin/main
              Privacy and grievance contact
            </div>
            <a
              href="mailto:inquiries@qsentia.com?subject=Privacy%20or%20Compliance%20Request"
<<<<<<< HEAD
              className="mt-3 block break-all text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
            >
              inquiries@qsentia.com
            </a>
            <Link href="/contact" className="mt-3 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-950 hover:underline dark:text-white">
=======
              className="mt-2 block break-all text-sm text-[#12B76A] hover:underline"
            >
              inquiries@qsentia.com
            </a>
            <Link href="/contact" className="mt-2 inline-block text-sm font-semibold text-[#12B76A] hover:underline">
>>>>>>> origin/main
              Contact form
            </Link>
          </div>
        </aside>

        <article className="min-w-0">
          {notice ? (
<<<<<<< HEAD
            <div className="mb-8 flex gap-3 border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" strokeWidth={1.5} />
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{notice}</p>
            </div>
          ) : null}

          <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
=======
            <div className="mb-8 flex gap-3 border border-[#E5E5E7] bg-[#F5F5F6] p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0F8F5A]" />
              <p className="text-sm leading-6 text-[#46554b]">{notice}</p>
            </div>
          ) : null}

          <div className="divide-y divide-[#E5E5E7] border-y border-[#E5E5E7]">
>>>>>>> origin/main
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 py-8 first:pt-0 last:pb-0">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Section {index + 1}</div>
                <h2 className="mt-3 text-2xl font-bold tracking-normal text-zinc-950 dark:text-white">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">{paragraph}</p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className="grid gap-2 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                      {section.bullets.map((bullet) => <li key={bullet} className="list-disc">{bullet}</li>)}
                    </ul>
                  ) : null}
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {references.length ? (
<<<<<<< HEAD
            <section className="mt-10 border-t border-zinc-200 pt-7 dark:border-zinc-800">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-950 dark:text-white">Official references</h2>
=======
            <section className="mt-10 border-t border-[#E5E5E7] pt-7">
              <h2 className="text-lg font-semibold text-[#06130c]">Official references</h2>
>>>>>>> origin/main
              <div className="mt-4 grid gap-2">
                {references.map((reference) => (
                  <a
                    key={reference.href}
                    href={reference.href}
                    target="_blank"
                    rel="noreferrer"
<<<<<<< HEAD
                    className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-white"
=======
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#12B76A] hover:underline"
>>>>>>> origin/main
                  >
                    {reference.label}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </section>
    </PageShell>
  );
}
