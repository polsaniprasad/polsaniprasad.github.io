import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const sans = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const serif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const mono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

const description = `${PROFILE.name} — ${PROFILE.headline}. ${PROFILE.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${PROFILE.name} — ${PROFILE.headline}`,
  description,
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: `${PROFILE.name} — ${PROFILE.headline}`,
    description,
    type: "profile",
    images: ["/media/hero-poster.webp"], // resolved against metadataBase, which already includes the sub-path
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/*
          1. Reveal animations only hide content once JS is known to be running.
          2. Always open on the hero: stop the browser restoring an old scroll position, and
             drop any #section from the address before the browser jumps to it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "if('scrollRestoration' in history)history.scrollRestoration='manual';" +
              "if(location.hash)history.replaceState(null,'',location.pathname+location.search);",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
