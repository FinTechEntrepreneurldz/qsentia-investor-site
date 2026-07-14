import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { teamMembers, type TeamMember, type TeamRole } from '@/lib/team';

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

export default function TeamDirectory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-10 grid gap-6 border-y border-zinc-200 dark:border-zinc-800 py-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
            QSentia team
          </p>
          <h2 className="mt-3 max-w-xl font-mono text-xl sm:text-2xl font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
            People building the research and platform layer
          </h2>
        </div>
        <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
          QSentia brings together leadership, quantitative research, and software development to build
          model telemetry, investor diligence workflows, customer dashboards, and API infrastructure for
          systematic investment operations.
        </p>
      </div>

      <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member) => (
          <TeamProfileCard key={member.slug} member={member} />
        ))}
      </div>
    </section>
  );
}

function TeamProfileCard({ member }: { member: TeamMember }) {
  const style = roleStyles[member.role];
  const cardPlacement = member.slug === 'ashutosh' ? 'xl:col-start-2' : '';

  return (
    <article
      className={`flex h-full min-h-[460px] flex-col overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1D] transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-700 ${cardPlacement}`}
    >
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-zinc-50 dark:bg-black/40">
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={member.imageAlt ?? member.fullName}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
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
              className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-4 bg-white dark:bg-[#1A1A1D] text-3xl font-semibold ${style.ring}`}
            >
              <span className={`flex h-24 w-24 items-center justify-center rounded-full ${style.avatar}`}>
                {member.initials}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span
          className={`inline-flex self-start rounded-[4px] border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
        >
          {member.role}
        </span>

        <h3 className="mt-5 font-mono text-base font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
          {member.fullName}
        </h3>
        <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {member.designation}
        </p>
        <p className="mt-5 flex-1 text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
          {member.summary}
        </p>

        <Link
          href={`/team/${member.slug}`}
          className="mt-6 inline-flex items-center gap-2 self-start font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-955 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition"
        >
          Read bio
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
