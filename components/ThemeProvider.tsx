"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored) {
      setTimeout(() => {
        setThemeState(stored);
      }, 0);
    }
  }, []);

  // Update classes and resolvedTheme whenever theme state changes
  useEffect(() => {
    const root = document.documentElement;
    
    const updateTheme = () => {
      if (theme === "dark") {
        root.classList.add("dark");
        setResolvedTheme("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
        setResolvedTheme("light");
      } else {
        // system theme
        const matches = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (matches) {
          root.classList.add("dark");
          setResolvedTheme("dark");
        } else {
          root.classList.remove("dark");
          setResolvedTheme("light");
        }
      }
    };

    updateTheme();

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => {
        updateTheme();
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // LocalStorage might be disabled or full
    }
  };


  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
