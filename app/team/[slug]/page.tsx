<<<<<<< HEAD
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { PageShell } from "@/components/PageChrome";
import { getTeamMember, teamMembers, type TeamRole } from "@/lib/team";
=======
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import { Eyebrow, PageShell, TechnicalBackdrop } from '@/components/PageChrome';
import { getTeamMember, teamMembers, type TeamRole } from '@/lib/team';
>>>>>>> origin/main

const roleStyles: Record<
  TeamRole,
  { badge: string; avatar: string; ring: string }
> = {
<<<<<<< HEAD
  Founder: {
    badge: "border-zinc-300 bg-zinc-50 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white",
    avatar: "bg-zinc-950 text-white dark:bg-white dark:text-black",
    ring: "border-zinc-300 dark:border-zinc-700",
  },
  "Quantitative Research": {
    badge: "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-black dark:text-zinc-300",
    avatar: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black",
    ring: "border-zinc-300 dark:border-zinc-700",
  },
  "Software Development": {
    badge: "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-black dark:text-zinc-300",
    avatar: "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white",
    ring: "border-zinc-300 dark:border-zinc-700",
=======
  CEO: {
    badge: 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white',
    avatar: 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white',
    ring: 'border-zinc-200 dark:border-zinc-800',
  },
  'Quantitative Research': {
    badge: 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white',
    avatar: 'bg-zinc-800 text-white',
    ring: 'border-zinc-200 dark:border-zinc-800',
  },
  'Software Development': {
    badge: 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white',
    avatar: 'bg-zinc-200 text-zinc-950 dark:bg-zinc-800 dark:text-white',
    ring: 'border-zinc-200 dark:border-zinc-800',
>>>>>>> origin/main
  },
};

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    return {
      title: 'Team Bio | QSentia',
    };
  }

  return {
    title: `${member.fullName} | QSentia Team`,
    description: member.summary,
  };
}

export default async function TeamBioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) notFound();

  const style = roleStyles[member.role];

  return (
    <PageShell active="/team">
<<<<<<< HEAD
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 transition-colors dark:border-zinc-900 dark:bg-black">
=======
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black transition-colors">
        <TechnicalBackdrop />
>>>>>>> origin/main
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:items-end lg:py-16">
          <div>
            <Link
              href="/team"
<<<<<<< HEAD
              className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Back to team
            </Link>
            <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Team bio
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-7xl">
              {member.fullName}
            </h1>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              {member.designation}
            </p>
            <span
              className={`mt-5 inline-flex rounded-none border px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] ${style.badge}`}
=======
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to team
            </Link>
            <div className="mt-8">
              <Eyebrow>Team bio</Eyebrow>
            </div>
            <h1 className="mt-6 max-w-4xl font-mono text-3xl sm:text-5xl font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
              {member.fullName}
            </h1>
            <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-550">
              {member.designation}
            </p>
            <span
              className={`mt-5 inline-flex rounded-[4px] border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
>>>>>>> origin/main
            >
              {member.group}
            </span>
          </div>

<<<<<<< HEAD
          <div className="relative flex h-80 items-center justify-center overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
=======
          <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40">
>>>>>>> origin/main
            {member.imageSrc ? (
              <Image
                src={member.imageSrc}
                alt={member.imageAlt ?? member.fullName}
                fill
                priority
                sizes="(min-width: 1024px) 320px, 100vw"
                className="object-cover"
                style={{ objectPosition: member.imagePosition ?? 'center' }}
              />
            ) : (
              <>
                <div
                  aria-hidden
<<<<<<< HEAD
                  className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,113,122,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,113,122,0.12)_1px,transparent_1px)] bg-[size:54px_54px]"
                />
                <div
                  className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full border bg-white text-5xl font-semibold dark:bg-black ${style.ring}`}
=======
                  className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,100,100,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,100,100,0.06)_1px,transparent_1px)] bg-[size:54px_54px]"
                />
                <div
                  className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full border-4 bg-white dark:bg-[#1A1A1D] text-5xl font-semibold ${style.ring}`}
>>>>>>> origin/main
                >
                  <span className={`flex h-28 w-28 items-center justify-center rounded-full ${style.avatar}`}>
                    {member.initials}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="max-w-4xl">
<<<<<<< HEAD
          <div className="grid gap-7 text-lg leading-9 text-zinc-800 dark:text-zinc-200 md:text-xl">
=======
          <div className="grid gap-7 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
>>>>>>> origin/main
            {member.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
<<<<<<< HEAD
          <div className="border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
=======
          <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-6">
            <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-550">
>>>>>>> origin/main
              Profile highlights
            </p>

            {member.qualifications ? (
<<<<<<< HEAD
              <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-950 dark:text-white">
                  Qualifications
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
=======
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                <h2 className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-950 dark:text-white">
                  Qualifications
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
>>>>>>> origin/main
                  {member.qualifications}
                </p>
              </div>
            ) : null}

            {member.focus ? (
<<<<<<< HEAD
              <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-950 dark:text-white">Focus</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
=======
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                <h2 className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-955 dark:text-white">
                  Focus
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
>>>>>>> origin/main
                  {member.focus}
                </p>
              </div>
            ) : null}

            {member.emailAddress ? (
<<<<<<< HEAD
              <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-950 dark:text-white">
=======
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                <h2 className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-955 dark:text-white">
>>>>>>> origin/main
                  Contact
                </h2>
                <a
                  href={`mailto:${member.emailAddress}`}
<<<<<<< HEAD
                  className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-white"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
=======
                  className="mt-3 inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-950 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition"
                >
                  <Mail className="h-4 w-4 shrink-0" />
>>>>>>> origin/main
                  {member.emailAddress}
                </a>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
