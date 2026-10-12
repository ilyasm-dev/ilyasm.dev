import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

// Self-hosted at build time. Used for labels, figures and the trace, not for body text.
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

const DESCRIPTION =
  "Ilyas Mallah, software engineer in the Netherlands. I find out why software is slow and make it fast, in AI inference, databases, runtimes and compilers.";

// Tells search engines which profiles belong to the same person.
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ilyas Mallah",
  url: "https://ilyasm.dev/",
  jobTitle: "Software engineer",
  address: { "@type": "PostalAddress", addressCountry: "NL" },
  knowsAbout: ["Compilers", "GPU performance", "LLM inference", "WebAssembly", "Database performance"],
  sameAs: [
    "https://github.com/ilyas-mallah",
    "https://www.linkedin.com/in/ilyas-mallah",
    "https://x.com/ilyasmdev",
    "https://orcid.org/0009-0009-1694-3955",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ilyasm.dev"),
  title: { default: "Ilyas Mallah, software engineer", template: "%s | Ilyas Mallah" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ilyas Mallah",
    title: "Ilyas Mallah, software engineer",
    description: DESCRIPTION,
    url: "https://ilyasm.dev/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ilyas Mallah. I find out why software is slow, and make it fast." }],
  },
  twitter: { card: "summary_large_image", creator: "@ilyasmdev" },
  // Sources in scripts/brand/. The ico is declared 32x32 so browsers that read SVG pick the SVG.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f12" },
  ],
};

// Applies a saved theme before first paint, so the page never flashes the wrong colors.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden="true">
                IM
              </span>
              Ilyas Mallah
            </Link>
            <nav>
              <Link href="/#work" className="nav-work">
                Work
              </Link>
              <Link href="/#start">How it works</Link>
              <Link href="/#contact">Contact</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <span>Ilyas Mallah &middot; I. Mallah Development &middot; KvK 98045024 &middot; <Link href="/privacy/">Privacy</Link></span>
            <span className="footer-links">
              <a href="https://github.com/ilyas-mallah">GitHub</a>
              <a href="https://github.com/green-real">Earlier work (green-real)</a>
              <Link href="/#contact">Email</Link>
            </span>
          </div>
        </footer>
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "622e4ebceeab46088e7e2b5203ec64ff"}'
        />
      </body>
    </html>
  );
}
