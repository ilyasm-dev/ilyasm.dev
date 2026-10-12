import {
  Archive,
  ArrowDown,
  ArrowRight,
  Braces,
  Brain,
  Check,
  Code,
  Database,
  Eye,
  FileCode,
  FileSignature,
  FileText,
  Gamepad2,
  Gauge,
  GitMerge,
  GitPullRequest,
  Gpu,
  Lock,
  Mail,
  Server,
  ShieldCheck,
  Stethoscope,
  Target,
  Timer,
  Users,
  Wrench,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { ChartQueryBars, DecodeBars } from "@/components/BeforeAfterBars";
import CopyButton from "@/components/CopyButton";
import ReplyHours from "@/components/ReplyHours";
import Showcase from "@/components/Showcase";
import { BillClimb, DatabaseMove, GaugeHalf } from "@/components/Illustrations";
import { Mark, Status, type StatusKind } from "@/components/Marks";
import Link from "next/link";
import prsData from "@/data/prs.json";
import SocialIcon, { type IconName } from "@/components/SocialIcons";

const ICON = { size: 20, strokeWidth: 1.75, "aria-hidden": true } as const;

const SOCIALS: { name: string; href: string; aria: string; icon: IconName }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ilyas-mallah", aria: "LinkedIn profile", icon: "linkedin" },
  { name: "GitHub", href: "https://github.com/ilyas-mallah", aria: "GitHub profile", icon: "github" },
  { name: "X", href: "https://x.com/ilyasmdev", aria: "X profile", icon: "x" },
  { name: "Discord", href: "https://discord.com/users/1557401037042618432", aria: "Discord profile", icon: "discord" },
];

const STEPS: { title: string; text: string }[] = [
  { title: "You send the slow part", text: "Tell me what's slow and where it runs. Then we talk it through in a short call." },
  { title: "I find the cause", text: "I measure a baseline and trace the slowdown to its cause, at whatever layer it sits." },
  { title: "You get the report", text: "Ranked fixes, each with its expected gain, its cost and how sure I am." },
];

const INCLUDED = ["A measured baseline", "Causes with evidence", "Ranked fixes", "A fixed quote for the fix", "Up to 2 hours of calls"];

const FIX_STEPS: { title: string; text: string }[] = [
  { title: "I fix it", text: "At the fixed price from the report, agreed in writing before I start." },
  { title: "You review the pull requests", text: "Every change goes through your CI, and nothing ships without your sign-off." },
  { title: "I measure the result", text: "Against the same baseline as the report, so you see what changed." },
];

// Path of a square photo in public/, such as "/ilyas.jpg". Until it's set, the IM monogram is the avatar.
const ABOUT_PHOTO: string | null = null;

const MAILTO ="mailto:hello@ilyasm.dev?subject=" + encodeURIComponent("Something slow in our system");

const SAFEGUARDS: { text: string; icon: LucideIcon }[] = [
  { text: "I sign your NDA.", icon: FileSignature },
  { text: "I work on a staging copy or with read-only access to production metrics.", icon: Eye },
  { text: "Nothing touches production without your sign-off.", icon: Lock },
  { text: "Changes come as normal pull requests through your CI.", icon: GitPullRequest },
  { text: "What I build for you is yours once paid.", icon: PackageCheck },
];

const CONTRIBUTED: { name: string; by?: string }[] = [
  { name: "LLVM" },
  { name: "vLLM" },
  { name: "llama.cpp" },
  { name: "Luau", by: "Roblox" },
  { name: "Wasmtime" },
  { name: "zstd", by: "Meta" },
  { name: "tt-metal", by: "Tenstorrent" },
];

const AREAS: { title: string; line: string; proof: string; art: () => React.ReactNode }[] = [
  {
    art: GaugeHalf,
    title: "AI models that run slower than the hardware allows",
    line: "I profile inference engines such as llama.cpp and vLLM down to the GPU kernels, and fix the bottleneck.",
    proof: "Up to 2.1x faster decoding at 32k context in llama.cpp on an RTX 5090 with a q4_0 cache and CUDA 12.8 (fix in review).",
  },
  {
    art: DatabaseMove,
    title: "Backends and databases that don't keep up",
    line: "Slow queries, data that keeps growing, and migrations that cannot lose anything on the way.",
    proof: "After I rewrote Rolantir's hourly chart queries, they took 3 to 8 ms instead of 400 to 900 ms, measured on production. The database move kept the full history.",
  },
  {
    art: BillClimb,
    title: "A cloud or GPU bill growing faster than your users",
    line: "I profile where the compute goes, find the work that should not be there, and fix it, so the same traffic needs less hardware.",
    proof: "In my sample audit, the same document traffic fit on 3 GPUs instead of 5 after one setting change.",
  },
];

// Highlights are from the hub's contributions/README.md. The full list is data/prs.json, written at build time by scripts/fetch-prs.mjs.
const HIGHLIGHTS: { name: string; icon: LucideIcon; href: string; status: [StatusKind, string]; metric: React.ReactNode; unit: string; text: string }[] = [
  {
    name: "vLLM",
    icon: Server,
    href: "https://github.com/vllm-project/vllm/pull/60464",
    status: ["review", "PRs open"],
    metric: (
      <>
        Up to <span className="val-good">52%</span> more output tokens per second
      </>
    ),
    unit: "on the CUTLASS FP8 path, one H100 NVL",
    text: "Picks the matrix kernel by batch size. 17 to 52% more output tokens per second on one H100 NVL (Qwen3-8B-FP8) when vLLM uses its CUTLASS FP8 path. Two more PRs open.",
  },
  {
    name: "Wasmtime",
    icon: ShieldCheck,
    href: "https://github.com/bytecodealliance/wasmtime/pull/14617",
    status: ["review", "PR open"],
    metric: "String buffers checked first",
    unit: "before the host touches them",
    text: "Bounds checks for string transcoding. That code had three security advisories in 2026.",
  },
  {
    name: "tt-metal",
    icon: Target,
    href: "https://github.com/tenstorrent/tt-metal/issues/59930",
    status: ["issue", "issue open, fix ready"],
    metric: (
      <>
        Float32 error from <span className="val-bad">8,767</span> steps to <span className="val-good">3</span>
      </>
    ),
    unit: "measured in Tenstorrent's simulator",
    text: "Issue with a fix ready, not yet a PR. Float32 logit was off by up to 8,767 ULP (steps of float32 precision). My fix brings it to 3, measured in Tenstorrent's simulator.",
  },
];

type Pr = { repo: string; number: number; title: string; url: string; state: "open" | "merged"; createdAt: string; mergedAt: string | null; author: string };
const PRS = prsData as Pr[];
const MERGED = PRS.filter((p) => p.state === "merged").length;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthOf = (d: string) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;
const dateOf = (p: Pr) => p.mergedAt ?? p.createdAt;

// One group per project, projects with the most merged PRs first, merged PRs first inside a project.
const GROUPS = Object.values(
  PRS.reduce<Record<string, { repo: string; prs: Pr[]; merged: number }>>((acc, p) => {
    const g = (acc[p.repo] ??= { repo: p.repo, prs: [], merged: 0 });
    g.prs.push(p);
    if (p.state === "merged") g.merged++;
    return acc;
  }, {}),
)
  .map((g) => ({
    ...g,
    prs: [...g.prs].sort((a, b) => Number(b.state === "merged") - Number(a.state === "merged") || dateOf(b).localeCompare(dateOf(a))),
  }))
  .sort((a, b) => b.merged - a.merged || dateOf(b.prs[0]).localeCompare(dateOf(a.prs[0])));

// PR titles mark code with backticks. Show those parts as code.
const withCode = (title: string) => title.split("`").map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));

// Merged, from the hub's contributions/README.md. The ns figures for #2571 are in projects/luau/README.md and assets/cv.md.
const LUAU_PRS: { label: string; href: string; what: React.ReactNode }[] = [
  { label: "#2987", href: "https://github.com/luau-lang/luau/pull/2987", what: "x64 register allocator converted a value wrongly on reload from the stack" },
  {
    label: "#2571",
    href: "https://github.com/luau-lang/luau/pull/2571",
    what: (
      <>
        Integer comparisons from <span className="val-bad">3.18 ns</span> to <span className="val-good">0.63 ns</span> with predictable branches
      </>
    ),
  },
  { label: "#2683", href: "https://github.com/luau-lang/luau/pull/2683", what: "ARM64 fast path for looping over arrays, as x64 already had" },
  { label: "#2648", href: "https://github.com/luau-lang/luau/pull/2648", what: "Type checking for calls through a __call metamethod" },
];

function CaseLink({ href }: { href: string }) {
  return (
    <Link className="flow-link" href={href}>
      Read the case
      <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}

const IN_PROGRESS: { name: string; icon: LucideIcon; kind: StatusKind; tag: string; text: string }[] = [
  {
    name: "Ulana",
    icon: FileCode,
    kind: "dev",
    tag: "in development",
    text: "Compiles WebAssembly to Luau. Ten real programs, including SQLite and QuickJS, match the wasmtime reference output.",
  },
  {
    name: "Ganglion",
    icon: Brain,
    kind: "dev",
    tag: "in development",
    text: "A Rust and CUDA simulator for an entire fly brain, all 165,122 neurons, with hand-written and optimized CPU and GPU kernels. One simulated second runs in 0.37 s on a consumer graphics card (RTX 3070 Ti).",
  },
  {
    name: "infdoc",
    icon: Stethoscope,
    kind: "dev",
    tag: "in development",
    text: "A command-line check for silent slowdowns in self-hosted LLM serving. Every rule comes from a measured case.",
  },
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero wrap">
        <p className="eyebrow">Performance engineer for AI and backend systems</p>
        <h1>
          I find out why software is slow,
          <br />
          <span className="grad">and make it fast.</span>
        </h1>
        <p className="lede">Faster responses, fewer GPUs, lower cloud bills. I find what&apos;s slow, prove it, and fix it.</p>
        <div className="cta-row">
          <a className="button" href="#contact">
            <Mail {...ICON} size={17} />
            Contact
          </a>
          <a className="button button-quiet" href="#start">
            How it works
          </a>
          <span className="cta-note">Open to contract work.</span>
        </div>
        <Showcase />
        <p className="hero-credit">
          <Wrench size={16} strokeWidth={2} aria-hidden="true" />
          <span>
            The llama.cpp and vLLM gains are fixes to the engines themselves, so they speed up everyone who runs them.
            Your own stack has inefficiencies of its own on top of that, and that&apos;s where I start.
          </span>
        </p>
        <p className="hero-credit">
          <GitMerge size={16} strokeWidth={2} aria-hidden="true" />
          <span>
            I work inside compilers and language runtimes too. Roblox&apos;s Luau team has merged 7 of my fixes to its native
            code generator, register allocator and type checker.{" "}
            <a href="https://github.com/luau-lang/luau/pulls?q=is%3Apr+author%3Agreen-real+is%3Amerged">See them</a>
          </span>
        </p>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Problems I solve</h2>
        <div className="areas">
          {AREAS.map((a) => (
            <article className="area" key={a.title}>
              <span className="area-art">
                <a.art />
              </span>
              <h3>{a.title}</h3>
              <p>{a.line}</p>
              <p className="proof">{a.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section" id="start">
        <h2 className="section-title">Start with a two-week investigation</h2>
        <p className="start-lead">
          One fixed price to learn what&apos;s slow, why, and what fixing it is worth. <span>Then I fix it.</span>
        </p>
        <div className="phases">
          <article className="phase" aria-labelledby="phase-1">
            <div className="phase-head">
              <div className="phase-top">
                <h3 className="phase-label" id="phase-1">
                  <span className="phase-num">1</span> Investigation
                </h3>
                <span className="phase-time">
                  <Timer size={15} strokeWidth={2} aria-hidden="true" />2 weeks
                </span>
              </div>
              <span className="price-badge">Introductory price</span>
              <p className="price-now">
                <strong>€3,000</strong>
                <span>/ $3,500</span>
              </p>
              <p className="price-was">Regular price €4,500 / $5,500</p>
              <p className="price-scope">One workload in one environment</p>
            </div>
            <ol className="phase-steps">
              {STEPS.map((st) => (
                <li key={st.title}>
                  <strong>{st.title}</strong>
                  <span>{st.text}</span>
                </li>
              ))}
            </ol>
            <ul className="phase-checks" aria-label="Included">
              {INCLUDED.map((item) => (
                <li key={item}>
                  <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="phase-foot">
              <Link className="flow-link" href="/sample-report/">
                <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
                See a sample report
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </article>
          <span className="phase-arrow" aria-hidden="true">
            <span>
              <ArrowRight size={18} strokeWidth={2} />
            </span>
          </span>
          <article className="phase phase-fix" aria-labelledby="phase-2">
            <div className="phase-head">
              <div className="phase-top">
                <h3 className="phase-label" id="phase-2">
                  <span className="phase-num">2</span> The fix
                </h3>
              </div>
              <span className="price-badge">Priced separately</span>
              <p className="price-now">
                <strong>Fixed quote</strong>
                <span>from the report</span>
              </p>
              <p className="price-was">You see the price before you decide.</p>
            </div>
            <ol className="phase-steps">
              {FIX_STEPS.map((st) => (
                <li key={st.title}>
                  <strong>{st.title}</strong>
                  <span>{st.text}</span>
                </li>
              ))}
            </ol>
            <div className="phase-alt">
              <p>
                <Users size={16} strokeWidth={2} aria-hidden="true" />
                <span>
                  <strong>Or your team fixes it from the report.</strong> It&apos;s written so your engineers can act
                  on it.
                </span>
              </p>
            </div>
            <div className="phase-foot">
              <a className="button" href="#contact">
                Let&apos;s work together
                <ArrowDown size={17} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
        <p className="price-fine">
          Rented GPU time is billed at cost, with your approval first. Prices exclude VAT.
        </p>
        <div className="safeguards">
          <h3 className="sub-title">Working in your systems</h3>
          <ul>
            {SAFEGUARDS.map((g) => (
              <li key={g.text}>
                <g.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>{g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap section" id="work">
        <h2 className="section-title">Selected work</h2>

        <div className="work-grid">
          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Database} />
              <div className="card-head-text">
                <h3 className="card-title">Rolantir</h3>
              </div>
              <Status kind="done">co-founded</Status>
            </div>
            <p className="card-text">
              Analytics for the Roblox platform. It tracks 1M+ games in a 24.5 GB live database. I started it from the backend,
              crawler and game tracker, and moved it live from SQLite to PostgreSQL with TimescaleDB without losing history.
            </p>
            <div className="stats">
              <div>
                <Timer size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>
                  <span className="stat-good">50x</span> faster chart queries
                </strong>
                <span>measured on production</span>
              </div>
              <div>
                <Archive size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>
                  <span className="stat-good">9.5x</span> smaller history
                </strong>
                <span>35 GB stored in 3.7 GB</span>
              </div>
            </div>
            <ChartQueryBars />
            <p className="card-more work-foot">
              <CaseLink href="/work/rolantir/" />
              <a href="https://rolantir.dev">rolantir.dev (beta)</a>
            </p>
          </article>

          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Gpu} />
              <div className="card-head-text">
                <h3 className="card-title">llama.cpp</h3>
              </div>
              <Status kind="review">upstream fix</Status>
            </div>
            <p className="card-text">
              A fix in llama.cpp itself for long AI conversations on an RTX 5090. The compiler kept a small value in slow memory,
              and I changed how the kernel reads it.
            </p>
            <div className="stats">
              <div>
                <Gauge size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>
                  <span className="stat-good">2.1x</span> faster decoding
                </strong>
                <span>at 32k context</span>
              </div>
              <div>
                <Code size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>About 10 lines changed</strong>
                <span>in two functions</span>
              </div>
            </div>
            <DecodeBars />
            <p className="card-more work-foot">
              <CaseLink href="/work/llama-cpp/" />
              <a href="https://github.com/ggml-org/llama.cpp/pull/30077">PR #30077 (open)</a>
            </p>
          </article>

          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Braces} />
              <div className="card-head-text">
                <h3 className="card-title">Luau compiler and runtime</h3>
              </div>
              <Status kind="merged">7 merged</Status>
            </div>
            <p className="card-text">
              Luau is the language behind Roblox. Its maintainers merged 7 of my fixes in 2026, to the native code generator,
              register allocator and type checker.
            </p>
            <ul className="pr-list">
              {LUAU_PRS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>
                    <GitMerge size={14} strokeWidth={2} aria-hidden="true" />
                    {l.label}
                  </a>
                  <span>{l.what}</span>
                </li>
              ))}
            </ul>
            <p className="card-more work-foot">
              <a href="https://github.com/luau-lang/luau/pulls?q=is%3Apr+author%3Agreen-real+is%3Amerged">All merged pull requests</a>
            </p>
          </article>

          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Gamepad2} />
              <div className="card-head-text">
                <h3 className="card-title">Dig It</h3>
              </div>
              <Status kind="done">co-owned, sold</Status>
            </div>
            <p className="card-text">A Roblox game I co-founded and co-owned from October 2024 to March 2025, then sold. I did design, backend systems and live operations.</p>
            <div className="stats">
              <div>
                <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>73M visits</strong>
                <span>on Roblox</span>
              </div>
              <div>
                <Users size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>27,400 players at once</strong>
                <span>at the peak</span>
              </div>
            </div>
            <p className="card-more work-foot">
              <a href="https://www.roblox.com/games/76455837887178">Game page on Roblox</a>
              <a href="https://www.rotrends.com/game/6705549208">Player history on RoTrends</a>
            </p>
          </article>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Recent open source work</h2>
        <div className="contributed">
          <span className="contributed-label">Contributed to</span>
          <ul>
            {CONTRIBUTED.map((c) => (
              <li key={c.name}>
                <strong>{c.name}</strong>
                {c.by && <span>{c.by}</span>}
              </li>
            ))}
          </ul>
        </div>
        <ul className="highlights">
          {HIGHLIGHTS.map((h) => (
            <li className="oss" key={h.name}>
              <div className="oss-head">
                <Mark icon={h.icon} />
                <div>
                  <a href={h.href}>{h.name}</a>
                  <Status kind={h.status[0]}>{h.status[1]}</Status>
                </div>
              </div>
              <p className="oss-metric">
                <strong>{h.metric}</strong>
                <span>{h.unit}</span>
              </p>
              <p className="oss-text">{h.text}</p>
            </li>
          ))}
        </ul>
        <p className="hero-credit">
          <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
          <span>
            I also harden code that handles untrusted input, with bounds checks in Wasmtime and LLVM&apos;s C++ library and a
            fix for a hang in zstd on a crafted file.
          </span>
        </p>
        <details className="all-prs">
          <summary>
            <span>Pull requests to other projects ({PRS.length})</span>
            <span className="pr-mix">
              <span className="pr-mix-bar" aria-hidden="true">
                <span className="pr-mix-merged" style={{ width: `${(MERGED / PRS.length) * 100}%` }} />
              </span>
              <span className="pr-mix-text">
                {MERGED} merged, {PRS.length - MERGED} open, {GROUPS.length} projects
              </span>
            </span>
          </summary>
          <ul className="pr-groups">
            {GROUPS.map((g) => (
              <li key={g.repo}>
                <p className="pr-group-name">
                  <span>{g.repo}</span>
                  <span className="pr-group-count">
                    {g.merged > 0 && `${g.merged} merged`}
                    {g.merged > 0 && g.prs.length > g.merged && ", "}
                    {g.prs.length > g.merged && `${g.prs.length - g.merged} open`}
                  </span>
                </p>
                <ul className="pr-all">
                  {g.prs.map((p) => (
                    <li key={p.url}>
                      <a href={p.url}>{withCode(p.title)}</a>
                      <Status kind={p.state === "merged" ? "merged" : "review"}>{p.state}</Status>
                      <span className="pr-date">{monthOf(p.mergedAt ?? p.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="wrap section about" id="contact">
        <h2 className="section-title">Who you would work with</h2>
        <div className="about-card">
          <div className="about-who">
            <div className="about-id">
              {ABOUT_PHOTO ? (
                <img className="about-mark about-photo" src={ABOUT_PHOTO} alt="Ilyas Mallah" width={88} height={88} />
              ) : (
                <span className="about-mark" aria-hidden="true">
                  IM
                </span>
              )}
              <h3 className="about-name">Ilyas Mallah</h3>
              <p className="about-role">Performance engineer for AI and backend systems</p>
            </div>
            <p className="about-text">
              I&apos;m a software engineer in the Netherlands, and <strong>I specialize in performance</strong>. Performance
              problems often <em>fall between specialists</em>. The symptom is a slow API or a costly AI model, and the cause sits
              in a query plan, a runtime or a GPU kernel. I work at all of those layers, so{" "}
              <strong>one person follows the problem from the symptom to the fix</strong>. I do that inside your codebase, with
              your tools. vLLM and llama.cpp were once codebases I had never seen before, and thousands of other specialists
              had already worked on optimizing them.{" "}
              <em>I still found significant speedups in both.</em>
            </p>
          </div>
          <div className="about-cta">
            <h3>So, something slower than it should be?</h3>
            <p>
              Email me the slow part, where it runs and the result you want, such as a latency or cost target.{" "}
              <span>
                If you don&apos;t know the technical details, describe what&apos;s slow or what it costs, and I&apos;ll ask the
                rest.
              </span>
            </p>
            <div className="contact-email">
              <Mail className="email-icon" size={22} strokeWidth={1.75} aria-hidden="true" />
              <a className="email" href={MAILTO}>
                hello@ilyasm.dev
              </a>
              <CopyButton value="hello@ilyasm.dev" label="email address" />
            </div>
            <p className="about-reply">
              <span className="about-reply-dot" aria-hidden="true" />
              <ReplyHours />
            </p>
            <ul className="socials">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a className="social" href={s.href} aria-label={s.aria}>
                    <SocialIcon name={s.icon} />
                    <span className="social-label">{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Also building</h2>
        <div className="progress-list">
          {IN_PROGRESS.map((p) => (
            <article className="progress" key={p.name}>
              <div className="card-head">
                <Mark icon={p.icon} />
                <span className="card-title">{p.name}</span>
                <Status kind={p.kind}>{p.tag}</Status>
              </div>
              <p className="card-text">{p.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
