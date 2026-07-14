import type { Metadata } from "next";
import "./globals.css";
import PublicChrome from "@/components/PublicChrome";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Qsentia - Investor Intelligence Platform",
  description: "Advanced research and analytics platform for investor insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-white font-sans antialiased flex flex-col dark:bg-[#050714] dark:text-slate-100" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <PublicChrome />
        </ThemeProvider>
      </body>
    </html>
  );
}

