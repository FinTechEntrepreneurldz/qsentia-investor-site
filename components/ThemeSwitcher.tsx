"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  return (
    <button
      onClick={handleClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-zinc-300 hover:border-zinc-500 dark:border-zinc-800 dark:hover:border-zinc-500 bg-transparent text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition focus:outline-none"
      title={`Theme: ${theme.toUpperCase()} (Click to cycle)`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
    </button>
  );
}
