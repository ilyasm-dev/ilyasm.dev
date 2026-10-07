import Link from "next/link";
import DecodeChart from "@/components/DecodeChart";
import LatencyBars from "@/components/LatencyBars";
import Reveal from "@/components/Reveal";
import { allPosts } from "@/lib/posts";

const AREAS = [
  {
    title: "Building and running products",
    line: "I build products end to end and keep them running: backend, data, web front end and live operations.",
    proof: "Rolantir tracks 443,000 Roblox games in production. Dig It, a game I co-owned, reached 70 million visits.",
  },
  {
    title: "Making slow software fast",
    line: "I find out why something is slow, at whatever layer it is, and fix it with numbers before and after.",
    proof: "llama.cpp: up to 2.1x faster long-context generation on RTX 50 GPUs (in review). Rolantir charts: from 400 to 900 ms down to 3 to 8 ms.",
  },
  {
    title: "Making software run where it wasn't meant to",
    line: "Compilers, runtimes and ports that bring existing software to new platforms, and prove it still behaves.",
    proof: "Ulana runs C, Rust and Go programs as plain Luau (release in progress). Contributions to the Luau compiler.",
  },
  {
    title: "Games and real-time systems",
    line: "Multiplayer games, live operations and the scripting language underneath them.",
    proof: "Dig It peaked at 27,400 players online at once. Fixes in Luau, the language behind Roblox.",
  },
];

const IN_PROGRESS = [
  {
    name: "Ulana",
    tag: "release in progress",
    text: "A compiler that turns WebAssembly into Luau, so programs written in C, Rust or Go, such as SQLite, QuickJS and zstd, run as plain Luau.",
  },
  {
    name: "Ganglion",
    tag: "in development",
    text: "A Rust and CUDA engine that runs whole brain wiring maps as live simulations. It matches a validated scientific reference bit for bit, runs a 165,000-neuron nervous system faster than real time on one consumer GPU, and drives a physics model of the body.",
  },
  {
    name: "infdoc",
    tag: "in development",
    text: "A command-line check that finds silent slowdowns in self-hosted LLM serving. Every rule comes from a measured case.",
  },
];

export default function Home() {
  const posts = allPosts();
  return (
    <main>
      <section className="hero wrap">
        <p className="eyebrow">Software engineer in the Netherlands</p>
        <h1>
          I build software,
          <br />
          <span className="grad">and go as deep as it takes.</span>
        </h1>
        <p className="lede">
          I have shipped a game with 70 million visits and an analytics platform for 443,000 games. I also work in the
          layers underneath, from databases to compilers and GPU code, where I find out why things are slow or broken and
          fix them.
        </p>
        <div className="cta-row">
          <a className="button" href="mailto:hello@ilyasm.dev">
            hello@ilyasm.dev
          </a>
          <span className="cta-note">Open to internships and contract work.</span>
        </div>
      </section>

      <section className="wrap section">
        <Reveal>
          <h2 className="section-title">What I do</h2>
        </Reveal>
        <div className="areas">
          {AREAS.map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <article className="area">
                <h3>{a.title}</h3>
                <p>{a.line}</p>
                <p className="proof">{a.proof}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section" id="work">
        <Reveal>
          <h2 className="section-title">Selected work</h2>
        </Reveal>

        <Reveal>
          <article className="card card-feature">
            <div className="card-head">
              <a className="card-title" href="https://github.com/ggml-org/llama.cpp/pull/30077">
                llama.cpp: up to twice as fast long-context generation on RTX 50 GPUs
              </a>
              <span className="tag">in review</span>
            </div>
            <p className="card-text">
              Found why attention ran at half speed with a compressed (q4_0) cache on Blackwell GPUs in llama.cpp&apos;s
              default CUDA builds, and fixed it in a few lines. Hover the chart to compare.
            </p>
            <DecodeChart />
            <p className="card-more">
              <Link href="/writing/blackwell-q4_0-cuda-12-8/">How I found it</Link>
              <a href="https://github.com/ggml-org/llama.cpp/pull/30077">Pull request #30077</a>
            </p>
          </article>
        </Reveal>

        <div className="card-grid">
          <Reveal>
            <article className="card">
              <div className="card-head">
                <a className="card-title" href="https://rolantir.dev">
                  Rolantir
                </a>
                <span className="tag">co-founded</span>
              </div>
              <p className="card-text">
                Analytics for the Roblox platform: tracks player counts for about 443,000 games. Built the data service
                and moved the live database to TimescaleDB.
              </p>
              <LatencyBars />
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="card">
              <div className="card-head">
                <a className="card-title" href="https://github.com/green-real">
                  Luau compiler and runtime
                </a>
                <span className="tag">open source</span>
              </div>
              <p className="card-text">
                Contributions to the Luau compiler, its native code generator for x64 and ARM64, and its runtime, under
                the handle green-real.
              </p>
            </article>
          </Reveal>
          <Reveal delay={160}>
            <article className="card">
              <div className="card-head">
                <span className="card-title">Dig It</span>
                <span className="tag">co-owned, sold</span>
              </div>
              <p className="card-text">A Roblox game with about 70 million visits and a peak of 27,400 players online at the same time.</p>
              <div className="stats">
                <div>
                  <strong>70M</strong>
                  <span>visits</span>
                </div>
                <div>
                  <strong>27,400</strong>
                  <span>players at once, peak</span>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="wrap section">
        <Reveal>
          <h2 className="section-title">In progress</h2>
        </Reveal>
        <div className="progress-list">
          {IN_PROGRESS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <article className="progress">
                <div className="card-head">
                  <span className="card-title">{p.name}</span>
                  <span className="tag tag-soft">{p.tag}</span>
                </div>
                <p className="card-text">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <Reveal>
          <h2 className="section-title">Writing</h2>
        </Reveal>
        <div className="post-list">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link className="post-link" href={`/writing/${p.slug}/`}>
                <span className="post-title">
                  {p.title}
                  {p.draft && <span className="tag tag-draft">draft</span>}
                </span>
                <span className="post-summary">{p.summary}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section contact">
        <Reveal>
          <h2>Something slower than it should be?</h2>
          <p>I&apos;m open to internships and contract work.</p>
          <a className="button" href="mailto:hello@ilyasm.dev">
            hello@ilyasm.dev
          </a>
        </Reveal>
      </section>
    </main>
  );
}
