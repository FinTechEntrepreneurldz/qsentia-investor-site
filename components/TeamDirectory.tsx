import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  teamMembers,
  type TeamGroup,
  type TeamMember,
  type TeamRole,
} from "@/lib/team";

const roleStyles: Record<
  TeamRole,
  { badge: string; avatar: string; ring: string }
> = {
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
  },
};

const teamSections: Array<{
  group: TeamGroup;
  title: string;
  description: string;
}> = [
  {
    group: "Founder",
    title: "Founder",
    description:
      "Founder-built leadership, technical direction, product strategy, and investor-facing operating discipline.",
  },
  {
    group: "Engineering Interns and Contributors",
    title: "Engineering Interns and Contributors",
    description:
      "Software-development interns and contributors supporting product surfaces, dashboards, workflows, and platform implementation.",
  },
  {
    group: "Quantitative Research Interns and Contributors",
    title: "Quantitative Research Interns and Contributors",
    description:
      "Quantitative-research interns and contributors supporting research exploration, backtesting, market analysis, and model review.",
  },
];

export default function TeamDirectory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-10 grid gap-6 border-y border-zinc-200 py-8 dark:border-zinc-900 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            Directory
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold uppercase tracking-tight text-zinc-950 dark:text-white">
            People building the research and platform layer
          </h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          QSentia is founder-led, with engineering and quantitative-research
          interns and contributors helping accelerate implementation, research
          review, dashboards, and API infrastructure around the founder-built
          investment-management platform.
        </p>
      </div>

      <div className="grid gap-12">
        {teamSections.map((section) => {
          const members = teamMembers.filter(
            (member) => member.group === section.group,
          );

          if (!members.length) return null;

          return (
            <section key={section.group}>
              <div className="mb-5 flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-900 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                    {section.group}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {section.description}
                </p>
              </div>

              <div className="grid auto-rows-fr gap-px border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 md:grid-cols-2 xl:grid-cols-3">
                {members.map((member) => (
                  <TeamProfileCard key={member.slug} member={member} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function TeamProfileCard({ member }: { member: TeamMember }) {
  const style = roleStyles[member.role];
  const cardPlacement = member.slug === "ashutosh-pathak" ? "xl:col-start-2" : "";

  return (
    <article
      className={`flex h-full min-h-[460px] flex-col overflow-hidden bg-white transition duration-200 hover:bg-zinc-50 dark:bg-black dark:hover:bg-[#09090b] ${cardPlacement}`}
    >
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#09090b]">
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={member.imageAlt ?? member.fullName}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: member.imagePosition ?? "center" }}
          />
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,113,122,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,113,122,0.12)_1px,transparent_1px)] bg-[size:54px_54px]"
            />
            <div
              className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-full border bg-white text-3xl font-semibold dark:bg-black ${style.ring}`}
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
          className={`inline-flex self-start rounded-none border px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] ${style.badge}`}
        >
          {member.group}
        </span>

        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {member.fullName}
        </h3>
        <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
          {member.designation}
        </p>
        <p className="mt-5 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {member.summary}
        </p>

        <Link
          href={`/team/${member.slug}`}
          className="mt-6 inline-flex items-center gap-2 self-start font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-950 transition hover:text-zinc-500 dark:text-white dark:hover:text-zinc-400"
        >
          Read bio
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}
