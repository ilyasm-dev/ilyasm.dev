import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="wrap section page">
      <article className="article">
        <span className="tag tag-soft">404</span>
        <h1>This page does not exist</h1>
        <p className="case-lede">The link may be old or mistyped.</p>
        <p className="report-cta">
          <Link className="button" href="/">
            Go to the home page
          </Link>
        </p>
      </article>
    </main>
  );
}
