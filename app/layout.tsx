import type { Metadata } from "next";
import "./globals.css";
import PublicChrome from "@/components/PublicChrome";

export const metadata: Metadata = {
  title: "QSentia - Systematic Investment Management",
  description:
    "QSentia is a systematic investment-management firm developing machine-learning equity strategies for qualified investors, supported by source-backed research infrastructure.",
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
      <body className="min-h-full bg-white font-sans antialiased flex flex-col" suppressHydrationWarning>
        {children}
        <PublicChrome />
      </body>
    </html>
  );
}
