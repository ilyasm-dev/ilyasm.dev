import type { Metadata } from "next";
import { pageMeta } from "@/lib/pageMeta";
import Link from "next/link";
import { getReport } from "@/lib/report";

const report = getReport();

export const metadata: Metadata = pageMeta("Sample report", "A sample of the written findings a client receives, from an inference audit of Qwen3-8B on vLLM.", "/sample-report/");

export default function SampleReport() {
  return (
    <main id="main" className="wrap section page">
      <p className="back">
        <Link href="/#start">Back to how it works</Link>
      </p>
      <article className="article report">
        <header>
          <span className="tag tag-soft">Sample report</span>
          <h1>{report.title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: report.html }} />
        <p className="report-cta">
          <Link className="button" href="/#contact">
            Ask about a first project
          </Link>
        </p>
      </article>
    </main>
  );
}
