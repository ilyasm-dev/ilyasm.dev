import Link from "next/link";
import DecodeChart from "@/components/DecodeChart";
import LatencyBars from "@/components/LatencyBars";
import Reveal from "@/components/Reveal";
import { allPosts } from "@/lib/posts";

const AREAS = [
  {
    title: "GPU and AI inference performance",
    line: "I find out why AI models run slower than the hardware allows, and fix it.",
    proof: "llama.cpp fix: up to 2.1x faster long-context generation on RTX 50 GPUs (in review).",
  },
  {
    title: "Compilers and runtimes",
    line: "I work on the layer that decides how fast everyone else's code runs.",
    proof: "Contributions to the Luau compiler, its native code generator for x64 and ARM64, and its runtime.",
  },
  {
    title: "Backend performance",
    line: "I make slow services and databases fast, without losing data on the way.",
    proof: "Rolantir: dashboard charts from 400 to 900 ms down to 3 to 8 ms after a live database move.",
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
          I make software faster,
          <br />
          <span className="grad">from compilers to GPU kernels.</span>
        </h1>
        <p className="lede">
          I work mostly in Luau, Rust, C++ and CUDA. My main interests are compilers and runtimes, and making code fast,
          from CPU hot paths to GPU kernels.
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
