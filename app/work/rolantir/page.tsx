import type { Metadata } from "next";
import { pageMeta } from "@/lib/pageMeta";
import Link from "next/link";
import { DatabaseBackup, UserRound, Wrench } from "lucide-react";
import { ChartQueryBars } from "@/components/BeforeAfterBars";
import { MigrationDiagram } from "@/components/Illustrations";

// Facts and numbers from the hub's projects/rolantir/README.md.
export const metadata: Metadata = pageMeta("Rolantir case study", "How I moved Rolantir's live 13.9 GB SQLite database to PostgreSQL with TimescaleDB without losing history, and made its chart queries 50x faster.", "/work/rolantir/");

export default function RolantirCase() {
  return (
    <main id="main" className="wrap section page">
      <p className="back">
        <Link href="/#work">Back to selected work</Link>
      </p>
      <article className="article case-study">
        <header>
          <span className="tag tag-soft">Case study</span>
          <h1>Rolantir, 50x faster chart queries on a live 24.5 GB database</h1>
          <p className="case-lede">
            Rolantir is analytics for the Roblox platform. It records player counts over time so a studio can see which games
            rise and fade.
          </p>
        </header>

        <dl className="case-stats">
          <div>
            <dt>1M+ games tracked</dt>
            <dd>in a 24.5 GB live database</dd>
          </div>
          <div>
            <dt>300M rows of history</dt>
            <dd>player counts over time</dd>
          </div>
          <div>
            <dt>
              <span className="stat-good">9.5x</span> smaller history
            </dt>
            <dd>35 GB stored in 3.7 GB</dd>
          </div>
          <div>
            <dt>
              <span className="stat-good">50x</span> faster chart queries
            </dt>
            <dd>400 to 900 ms down to 3{" "}to{" "}8{" "}ms</dd>
          </div>
        </dl>

        <section className="case-part">
          <h2 className="case-h case-h-bad">The problem</h2>
          <p>
            Rolantir now tracks over a million games in a 24.5 GB database. I started the backend on SQLite to get it running
            quickly, and moved it to PostgreSQL with TimescaleDB once the data grew.
          </p>
          <p>
            Two things forced the move. The SQLite driver makes the whole server wait while a query runs. In production a 2 s count and
            an 8 s genre query each froze the service. Uncompressed, the history would also have outgrown its 60 GB disk. By
            the cutover the SQLite file held 13.9 GB, and the move had to happen live, without losing any history.
          </p>
        </section>

        <section className="case-part">
          <h2 className="case-h">What I did</h2>
          <ul className="facts">
            <li>
              <strong>
                <UserRound size={15} strokeWidth={2} aria-hidden="true" />
                My part
              </strong>
              I started Rolantir by building the backend, the crawler and the game tracker, and wrote almost all of the backend.
              I planned and ran the move of the live database to PostgreSQL with TimescaleDB. The website
              came later, and I built about half of it.
            </li>
            <li>
              <strong>
                <DatabaseBackup size={15} strokeWidth={2} aria-hidden="true" />
                Keeping the history
              </strong>
              The new code sat behind the existing database interface as a faithful copy, so the two could be checked against
              each other. The cutover pre-loaded the data and then copied only what had changed, with completeness checks on the
              copy. That kept about 100M rows out of the maintenance window.
            </li>
            <li>
              <strong>
                <Wrench size={15} strokeWidth={2} aria-hidden="true" />
                Two problems on the way
              </strong>
              The first version of the chart summaries stored about 1 KB per row and filled the disk while it back-filled. I
              redesigned it around plain running totals at about 160 B a row, still exact for averages, spread and change over any
              window. A recurring deadlock, about 6 every 2 hours, came from two writers taking locks in a different order. A fixed
              lock order, with a retry as a safety net, ended it.
            </li>
          </ul>
          <MigrationDiagram />
        </section>

        <section className="case-part">
          <h2 className="case-h case-h-good">The result</h2>
          <div className="case-figure">
            <ChartQueryBars />
          </div>
          <p>
            I rewrote the derived-metric chart queries to fetch once and scan in memory. It gives bit-exact results against the
            old path. Hourly chart queries dropped from <span className="val-bad">400 to 900 ms</span> to{" "}
            <span className="val-good">3 to 8 ms</span>, as measured on production. Compression keeps 300M rows of history in
            3.7 GB instead of 35 GB.
          </p>
          <p className="case-proof">
            The code is private. The product is live at <a href="https://rolantir.dev">rolantir.dev (beta)</a>.
          </p>
        </section>

        <p className="report-cta">
          <Link className="button" href="/#contact">
            Ask about a first project
          </Link>
        </p>
      </article>
    </main>
  );
}
