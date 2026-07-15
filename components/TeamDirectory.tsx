'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { teamMembers, type TeamMember, type TeamRole } from '@/lib/team';

const roleStyles: Record<
  TeamRole,
  { badge: string; avatar: string; ring: string }
> = {
  Founder: {
    badge: 'border-zinc-300 bg-zinc-50 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white',
    avatar: 'bg-zinc-950 text-white dark:bg-white dark:text-black',
    ring: 'border-zinc-300 dark:border-zinc-700',
  },
  'Quantitative Research': {
    badge: 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-black dark:text-zinc-300',
    avatar: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black',
    ring: 'border-zinc-300 dark:border-zinc-700',
  },
  'Software Development': {
    badge: 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-black dark:text-zinc-300',
    avatar: 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white',
    ring: 'border-zinc-300 dark:border-zinc-700',
  },
};

export default function TeamDirectory() {
  const founder = teamMembers.find((m) => m.group === 'Founder');
  const quantMembers = teamMembers.filter((m) => m.group === 'Quantitative team');
  const softwareMembers = teamMembers.filter((m) => m.group === 'Software team');

  return (
    <div className="w-full overflow-hidden">
      {/* ── Intro Header ── */}
      <div className="mb-10 grid gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-550">
            QSentia team
          </p>
          <h2 className="mt-2.5 max-w-xl font-mono text-lg sm:text-xl font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
            People building the research and platform layer
          </h2>
        </div>
        <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
          QSentia brings together leadership, quantitative research, and software development to build
          model telemetry, investor diligence workflows, customer dashboards, and API infrastructure for
          systematic investment operations.
        </p>
      </div>

      <div className="grid gap-10 w-full overflow-hidden">
        {/* ── Founder Card (Horizontal) ── */}
        {founder && (
          <div id="founder" className="scroll-mt-24 w-full">
            <FounderCard member={founder} />
          </div>
        )}

        {/* ── Quantitative Team Section ── */}
        <div id="quantitative-team" className="scroll-mt-24 w-full overflow-hidden">
          <div className="mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-955 dark:text-white">
              Quantitative Team
            </h2>
          </div>
          <ScrollRow>
            {quantMembers.map((member) => (
              <TeamProfileCard key={member.slug} member={member} />
            ))}
          </ScrollRow>
        </div>

        {/* ── Software Team Section ── */}
        <div id="software-team" className="scroll-mt-24 w-full overflow-hidden">
          <div className="mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-955 dark:text-white">
              Software Team
            </h2>
          </div>
          <ScrollRow>
            {softwareMembers.map((member) => (
              <TeamProfileCard key={member.slug} member={member} />
            ))}
          </ScrollRow>
        </div>
      </div>
    </div>
  );
}

function FounderCard({ member }: { member: TeamMember }) {
  const style = roleStyles[member.role];

  return (
    <article className="flex flex-col md:flex-row overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition duration-200 hover:border-zinc-400 dark:hover:border-zinc-700 min-h-[220px] md:min-h-[240px] w-full">
      {/* Photo on Left */}
      <div className="relative w-full md:w-[240px] h-52 md:h-auto shrink-0 bg-zinc-50 dark:bg-black/40 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={member.imageAlt ?? member.fullName}
            fill
            sizes="(min-width: 768px) 240px, 100vw"
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
              className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 bg-white dark:bg-[#09090b] text-2xl font-semibold ${style.ring}`}
            >
              <span className={`flex h-20 w-20 items-center justify-center rounded-full ${style.avatar}`}>
                {member.initials}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Details on Right */}
      <div className="flex flex-1 flex-col p-6 justify-between">
        <div>
          <span
            className={`inline-flex rounded-[4px] border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
          >
            {member.role}
          </span>

          <h3 className="mt-4 font-mono text-base sm:text-lg font-bold uppercase tracking-wider text-zinc-955 dark:text-white">
            {member.fullName}
          </h3>
          <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
            {member.designation}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            {member.summary}
          </p>
        </div>

        <Link
          href={`/team/${member.slug}`}
          className="mt-6 inline-flex items-center gap-2 self-start font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-955 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition"
        >
          Read bio
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

function TeamProfileCard({ member }: { member: TeamMember }) {
  const style = roleStyles[member.role];

  return (
    <article className="flex h-full w-[250px] flex-col overflow-hidden rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition duration-200 hover:border-zinc-400 dark:hover:border-zinc-700 shrink-0">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-zinc-50 dark:bg-black/40 border-b border-zinc-200 dark:border-zinc-800">
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={member.imageAlt ?? member.fullName}
            fill
            sizes="250px"
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
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 bg-white dark:bg-[#09090b] text-xl font-semibold ${style.ring}`}
            >
              <span className={`flex h-16 w-16 items-center justify-center rounded-full ${style.avatar}`}>
                {member.initials}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span
          className={`inline-flex self-start rounded-[4px] border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
        >
          {member.role}
        </span>

        <h3 className="mt-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white truncate">
          {member.fullName}
        </h3>
        <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
          {member.designation}
        </p>
        <p className="mt-3 flex-1 text-[11px] leading-relaxed text-zinc-650 dark:text-zinc-400 line-clamp-3">
          {member.summary}
        </p>

        <Link
          href={`/team/${member.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 self-start font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-955 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition"
        >
          Read bio
          <ArrowRight className="h-3.0 w-3.0" />
        </Link>
      </div>
    </article>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (ref.current) {
      const offset = direction === 'left' ? -266 : 266; // Card width + gap
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group w-full overflow-hidden">
      {showLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-2 top-[35%] -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 text-zinc-950 dark:text-white shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div
        ref={ref}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-4 scroll-smooth w-full"
      >
        {children}
      </div>
      {showRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-2 top-[35%] -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 text-zinc-950 dark:text-white shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
