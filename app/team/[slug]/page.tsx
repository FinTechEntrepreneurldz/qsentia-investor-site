import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import { Eyebrow, PageShell, TechnicalBackdrop } from '@/components/PageChrome';
import { getTeamMember, teamMembers, type TeamRole } from '@/lib/team';

const roleStyles: Record<
  TeamRole,
  { badge: string; avatar: string; ring: string }
> = {
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
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-black transition-colors">
        <TechnicalBackdrop />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:items-end lg:py-16">
          <div>
            <Link
              href="/team"
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
            >
              {member.role}
            </span>
          </div>

          <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40">
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
                  className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,100,100,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,100,100,0.06)_1px,transparent_1px)] bg-[size:54px_54px]"
                />
                <div
                  className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full border-4 bg-white dark:bg-[#1A1A1D] text-5xl font-semibold ${style.ring}`}
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
          <div className="grid gap-7 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            {member.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] p-6">
            <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-550">
              Profile highlights
            </p>

            {member.qualifications ? (
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                <h2 className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-950 dark:text-white">
                  Qualifications
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
                  {member.qualifications}
                </p>
              </div>
            ) : null}

            {member.focus ? (
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                <h2 className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-955 dark:text-white">
                  Focus
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
                  {member.focus}
                </p>
              </div>
            ) : null}

            {member.emailAddress ? (
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                <h2 className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-955 dark:text-white">
                  Contact
                </h2>
                <a
                  href={`mailto:${member.emailAddress}`}
                  className="mt-3 inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-950 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition"
                >
                  <Mail className="h-4 w-4 shrink-0" />
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
