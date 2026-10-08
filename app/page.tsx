import DecodeChart from "@/components/DecodeChart";
import LatencyBars from "@/components/LatencyBars";

const AREAS = [
  {
    title: "AI models that run slower than the hardware allows",
    line: "I profile inference engines such as llama.cpp and vLLM down to the GPU kernels, and fix the bottleneck.",
    proof: "Up to 2.1x faster long-context generation in llama.cpp on RTX 50 GPUs (in review).",
  },
  {
    title: "Backends and databases that don't keep up",
    line: "Slow queries, data that keeps growing, and migrations that cannot lose anything on the way.",
    proof: "Rolantir's dashboard queries went from 400 to 900 ms down to 3 to 8 ms, with the full history kept.",
  },
  {
    title: "Software that has to run somewhere new",
    line: "Compilers, runtimes and ports, checked against the original so the behavior stays the same.",
    proof: "7 fixes merged into the Luau compiler and runtime. Ulana runs C, Rust and Go programs as Luau (release in progress).",
  },
  {
    title: "Whole systems, built and kept running",
    line: "When the problem is bigger than one fix, I build the backend, data, web front end and operations end to end.",
    proof: "Rolantir tracks 443,000 games in production. Dig It, a game I co-owned, peaked at 27,400 players at once.",
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
  return (
    <main>
      <section className="hero wrap">
        <p className="eyebrow">Software engineer in the Netherlands</p>
        <h1>
          I find out why software is slow,
          <br />
          <span className="grad">and make it fast.</span>
        </h1>
        <p className="lede">
          AI inference, databases, runtimes and compilers. I measure where the time goes, fix the cause at whatever layer it
          is, and prove the result with numbers.
        </p>
        <div className="proof-strip">
          <div>
            <strong>2.1x</strong>
            <span>faster long-context generation in llama.cpp on RTX 50 GPUs (fix in review)</span>
          </div>
          <div>
            <strong>3 to 8 ms</strong>
            <span>dashboard queries, down from 400 to 900 ms after a live database migration</span>
          </div>
          <div>
            <strong>7</strong>
            <span>fixes merged into Luau, the language behind Roblox, in 2026</span>
          </div>
        </div>
        <div className="cta-row">
          <a className="button" href="mailto:hello@ilyasm.dev">
            hello@ilyasm.dev
          </a>
          <span className="cta-note">Open to contract work and internships.</span>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Problems I solve</h2>
        <div className="areas">
          {AREAS.map((a) => (
            <article className="area" key={a.title}>
              <h3>{a.title}</h3>
              <p>{a.line}</p>
              <p className="proof">{a.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section" id="work">
        <h2 className="section-title">Selected work</h2>

        <article className="card card-feature">
          <div className="card-head">
            <a className="card-title" href="https://github.com/ggml-org/llama.cpp/pull/30077">
              Up to twice as fast long-context generation in llama.cpp on RTX 50 GPUs
            </a>
            <span className="tag">in review</span>
          </div>
          <p className="card-text">
            Found why attention ran at half speed with a compressed (q4_0) cache on Blackwell GPUs in llama.cpp&apos;s
            default CUDA builds, and fixed it in a few lines. Hover the chart to compare.
          </p>
          <DecodeChart />
          <p className="card-more">
            <a href="https://github.com/ggml-org/llama.cpp/pull/30077">Pull request #30077</a>
          </p>
        </article>

        <div className="card-grid">
          <article className="card">
            <div className="card-head">
              <a className="card-title" href="https://rolantir.dev">
                Rolantir
              </a>
              <span className="tag">co-founded</span>
            </div>
            <p className="card-text">
              Analytics for the Roblox platform that tracks player counts for about 443,000 games. I built the data
              service and moved the live database to TimescaleDB.
            </p>
            <LatencyBars />
          </article>
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
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">In progress</h2>
        <div className="progress-list">
          {IN_PROGRESS.map((p) => (
            <article className="progress" key={p.name}>
              <div className="card-head">
                <span className="card-title">{p.name}</span>
                <span className="tag tag-soft">{p.tag}</span>
              </div>
              <p className="card-text">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section contact">
        <h2>Something slower than it should be?</h2>
        <p>I&apos;m open to internships and contract work.</p>
        <a className="button" href="mailto:hello@ilyasm.dev">
          hello@ilyasm.dev
        </a>
      </section>
    </main>
  );
}
