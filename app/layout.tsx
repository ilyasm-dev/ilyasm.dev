import type { Metadata, Viewport } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ilyasm.dev"),
  title: { default: "Ilyas Mallah", template: "%s | Ilyas Mallah" },
  description: "Ilyas Mallah, software engineer. Compilers, runtimes and fast code in Luau, Rust, C++ and CUDA.",
  openGraph: {
    title: "Ilyas Mallah",
    description: "Software engineer. Compilers, runtimes and fast code in Luau, Rust, C++ and CUDA.",
    url: "https://ilyasm.dev/",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563eb'/%3E%3Ctext x='32' y='42' font-family='system-ui,sans-serif' font-size='28' font-weight='700' text-anchor='middle' fill='white'%3EIM%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f12" },
  ],
};

// Applies a saved theme before first paint, so the page never flashes the wrong colors.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand">
              Ilyas Mallah
            </Link>
            <nav>
              <Link href="/#work">Work</Link>
              <Link href="/#contact">Contact</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <span>Ilyas Mallah</span>
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
