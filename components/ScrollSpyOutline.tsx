'use client';

import { useEffect, useMemo, useState } from 'react';

type OutlineItem = {
  id: string;
  label: string;
};

type ScrollSpyOutlineProps = {
  title?: string;
  items: OutlineItem[];
};

export default function ScrollSpyOutline({ title = 'On this page', items }: ScrollSpyOutlineProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    if (!sectionIds.length) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          setActiveId(visible[0].target.id);
          return;
        }

        const firstBelowViewport = sections.find((section) => section.getBoundingClientRect().top > 0);
        if (firstBelowViewport) {
          const index = sections.indexOf(firstBelowViewport);
          const previous = sections[Math.max(0, index - 1)];
          setActiveId(previous.id);
          return;
        }

        setActiveId(sections[sections.length - 1].id);
      },
      {
        rootMargin: '-22% 0px -62% 0px',
        threshold: [0, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <div className="sticky top-24">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{title}</p>
      <nav className="mt-4 space-y-2 text-xs font-mono uppercase tracking-wider">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? 'location' : undefined}
              className={`flex items-center gap-2 border-l px-3 py-1.5 transition-all duration-200 ${
                isActive
                  ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-bold'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <span className="w-5 shrink-0 font-mono text-[9px] text-zinc-400">0{index + 1}.</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
