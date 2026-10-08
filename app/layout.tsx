import type { Metadata } from "next";
import "./globals.css";
import "./home-story.css";
import "./design-system.css";
import "./wiki-cursor.css";
import { ReadingControls } from "./ReadingControls";
import { sitePath } from "./site-path";

export const metadata: Metadata = {
  title: "VCA-Prudens | Directed Evolution of ISCro4",
  description: "The VCA-Prudens iDEC wiki for DMS-guided evolution of the ISCro4 bridge recombinase.",
  icons: {
    icon: sitePath("/favicon.svg"),
    shortcut: sitePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="wiki-theme antialiased"
        style={{ "--wiki-cursor": `url("${sitePath("/assets/cursor-20261008/evolution-starburst.png")}") 4 3` } as React.CSSProperties}
      >
        {children}
        <ReadingControls />
      </body>
    </html>
  );
}
