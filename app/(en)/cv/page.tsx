import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import Ext from "@/components/ExternalLink";
import { pageMeta } from "@/lib/pageMeta";
import { countWord, mergedInMonth, prCount } from "@/lib/prCounts";

// The page for hiring readers. It carries the text of the hub's assets/cv.md, the one-page CV, and links the PDF built
// from it. CV visits stay their own path in Cloudflare Web Analytics, which drops query strings: a click from the PDF
// arrives with no referrer, a click from this site's footer with ilyasm.dev as referrer.
export const metadata: Metadata = pageMeta(
  "CV",
  "Ilyas Mallah's CV: open source work in Luau, llama.cpp, vLLM and LLVM, projects, experience and education, with the PDF to download.",
  "/cv/",
);

// The counts in the headings come from data/prs.json, which every build rewrites from GitHub.
const prs = (n: number) => `${n} ${n === 1 ? "PR" : "PRs"}`;
const LUAU_MERGED = prCount("luau-lang/luau", "merged");
const LLVM_MERGED = prCount("llvm/llvm-project", "merged");
const LLVM_OPEN = prCount("llvm/llvm-project", "open");
const VLLM_OPEN = prCount("vllm-project/vllm", "open");
const LLAMA_OPEN = prCount("ggml-org/llama.cpp", "open");
const OCTOBER_MERGED = mergedInMonth(
  ["bytecodealliance/wasmtime", "WebAssembly/wabt", "mruby/mruby", "gfx-rs/wgpu"],
  "2026-10",
);
const PDF = "/Ilyas-Mallah-CV.pdf";
const EMAIL = "hello@ilyasm.dev";
const gh = (repo: string, n: number, kind: "pull" | "issues" = "pull") => `https://github.com/${repo}/${kind}/${n}`;

function Pr({ repo, n, kind }: { repo: string; n: number; kind?: "pull" | "issues" }) {
  return <Ext href={gh(repo, n, kind)}>#{n}</Ext>;
}

export default function Cv() {
  return (
    <main id="main" className="wrap section page">
      <article className="article cv">
        <header>
          <span className="tag tag-soft">CV</span>
          <h1>Ilyas Mallah</h1>
          <p className="cv-role">Software engineer · Veenendaal, Netherlands</p>
          <p className="case-lede">
            I am a third-year Computer Science student working on performance and security in compilers, runtimes and AI inference
            engines. I am open to internships and contract work, part-time during the year or full-time in the summer.
          </p>
          <div className="cta-row cv-actions">
            <a className="button" href={PDF} download>
              <Download size={17} strokeWidth={2} aria-hidden="true" />
              Download the CV (PDF)
            </a>
            <a className="button button-quiet" href={`mailto:${EMAIL}`}>
              <Mail size={17} strokeWidth={2} aria-hidden="true" />
              {EMAIL}
            </a>
          </div>
          <p className="cv-links">
            <Ext href="https://www.linkedin.com/in/ilyas-mallah">LinkedIn</Ext>
            <Ext href="https://github.com/ilyas-mallah">GitHub</Ext>
          </p>
        </header>

        <section className="cv-part" aria-labelledby="cv-experience">
          <h2 className="cv-h" id="cv-experience">
            Experience
          </h2>
          <ul className="cv-list">
            <li>
              <p className="cv-entry">
                <span>
                  <strong>Rolantir</strong>, analytics platform for the Roblox games market
                </span>
                <span className="cv-when">Co-founder, June 2026 to present</span>
              </p>
              <ul>
                <li>
                  I built almost all of the backend (TypeScript, PostgreSQL, TimescaleDB) for a catalog of over 1 million games.
                </li>
                <li>
                  I moved the live 13.9 GB SQLite database to TimescaleDB with the full history, which cut hourly chart queries from
                  400 to 900 ms to 3 to 8 ms. <Link href="/work/rolantir/">The case study</Link>
                </li>
              </ul>
            </li>
            <li>
              <p className="cv-entry">
                <span>
                  <strong>Dig It</strong>, Roblox game
                </span>
                <span className="cv-when">Co-founder, October 2024 to March 2025</span>
              </p>
              <ul>
                <li>I did the programming, design and live operations for a game with 73 million visits and 27,400 players online at its peak.</li>
                <li>I led the negotiation when the game was sold.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="cv-part" aria-labelledby="cv-oss">
          <h2 className="cv-h" id="cv-oss">
            Open source
          </h2>
          <ul className="cv-list">
            <li>
              <p className="cv-entry">
                <span>
                  <strong>Luau</strong>, Roblox&apos;s scripting language
                </span>
                <span className="cv-when">{prs(LUAU_MERGED)} merged in 2026</span>
              </p>
              <ul>
                <li>
                  I gave integer <code>==</code> in branches its own IR command in the native code generator, which cut a comparison
                  from 3.18 ns to 0.63 ns (<Pr repo="luau-lang/luau" n={2571} />).
                </li>
                <li>
                  I fixed an x64 register allocator miscompile when restoring a spilled value (<Pr repo="luau-lang/luau" n={2987} />).
                </li>
              </ul>
            </li>
            <li>
              <p className="cv-entry">
                <span>
                  <strong>Wasmtime, wabt, mruby, wgpu</strong>
                </span>
                <span className="cv-when">{prs(OCTOBER_MERGED)} merged in October 2026</span>
              </p>
              <ul>
                <li>
                  I fixed Wasmtime&apos;s panic on float to 8- and 16-bit integer conversions on x64, an issue open since 2022 (
                  <Pr repo="bytecodealliance/wasmtime" n={14778} />
                  ), and I am the credited reporter of{" "}
                  <Ext href="https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-mghf-wjfp-p5xm">CVE-2026-115893</Ext>.
                </li>
                <li>
                  I fixed wabt&apos;s <code>wasm2c</code> on 32-bit hosts (<Pr repo="WebAssembly/wabt" n={2874} />
                  ), mruby&apos;s <code>pack</code> and <code>unpack</code> for strings over 2 GiB (
                  <Pr repo="mruby/mruby" n={7692} />) and naga&apos;s fuzz build (<Pr repo="gfx-rs/wgpu" n={10637} />).
                </li>
              </ul>
            </li>
            <li>
              <p className="cv-entry">
                <span>
                  <strong>LLVM</strong>, libc++ and Clang
                </span>
                <span className="cv-when">
                  {LLVM_MERGED} merged, {countWord(LLVM_OPEN, "en")} {LLVM_OPEN === 1 ? "PR" : "PRs"} in review
                </span>
              </p>
              <ul>
                <li>
                  My merged PRs fix the callee pop size of x86 tail calls with aligned stack arguments (
                  <Pr repo="llvm/llvm-project" n={235417} />). They also make Clang&apos;s format attribute warning work without its
                  libc call warning (<Pr repo="llvm/llvm-project" n={232898} />).
                </li>
                <li>
                  My PRs in review add hardening assertions to <code>insert</code>, <code>emplace</code>, <code>string</code> and{" "}
                  <code>valarray</code> (<Pr repo="llvm/llvm-project" n={230490} />, <Pr repo="llvm/llvm-project" n={234566} />,{" "}
                  <Pr repo="llvm/llvm-project" n={236120} />).
                </li>
              </ul>
            </li>
            <li>
              <p className="cv-entry">
                <span>
                  <strong>vLLM</strong>
                </span>
                <span className="cv-when">
                  {countWord(VLLM_OPEN, "en")} {VLLM_OPEN === 1 ? "PR" : "PRs"} in review
                </span>
              </p>
              <ul>
                <li>
                  I made Hopper pick the block-FP8 kernel by batch size, which gives 17 to 52% more throughput on an H100 NVL (
                  <Pr repo="vllm-project/vllm" n={60464} />).
                </li>
                <li>
                  I added a context window for EAGLE-3 drafters, which raises decode at 32k from 16 to 34 tok/s on an A40 (
                  <Pr repo="vllm-project/vllm" n={63245} />).
                </li>
              </ul>
            </li>
            <li>
              <p className="cv-entry">
                <span>
                  <strong>llama.cpp</strong>
                </span>
                <span className="cv-when">
                  {LLAMA_OPEN} {LLAMA_OPEN === 1 ? "PR" : "PRs"} open
                </span>
              </p>
              <ul>
                <li>
                  I traced half-speed q4_0 KV cache decode on RTX 50 GPUs to a CUDA 12.8 compiler bug, and my kernel workaround gives
                  up to 2.1x faster decode at 32k context (<Pr repo="ggml-org/llama.cpp" n={30077} />).{" "}
                  <Link href="/work/llama-cpp/">The case study</Link>
                </li>
              </ul>
            </li>
            <li>
              <p className="cv-entry">
                <span>
                  <strong>tt-metal</strong>
                </span>
                <span className="cv-when">1 issue with fix</span>
              </p>
              <ul>
                <li>
                  I found <code>ttnn.logit</code> up to 8,767 ULP off near 0.5 with a 54 op simulator sweep, and my fix brings it to 3
                  ULP (<Pr repo="tenstorrent/tt-metal" n={59930} kind="issues" />).
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="cv-part" aria-labelledby="cv-projects">
          <h2 className="cv-h" id="cv-projects">
            Projects
          </h2>
          <ul className="cv-list">
            <li>
              <p>
                <strong>Ulana</strong> is an optimizing WebAssembly to Luau compiler of about 47,000 lines of Luau. SQLite, QuickJS, jq
                and zstd run as generated Luau and match wasmtime.
              </p>
            </li>
            <li>
              <p>
                <strong>Ganglion</strong> is a Rust and CUDA connectome simulator. It runs a fruit fly nervous system (165,122
                neurons) at 0.37 s per simulated second on one RTX 3070 Ti, with the same output as its Python reference.
              </p>
            </li>
            <li>
              <p>
                <strong>Lute FFI</strong> is a specification and five-milestone implementation of a C foreign function interface for
                Lute, with full Luau types. It is not yet public.
              </p>
            </li>
          </ul>
        </section>

        <section className="cv-part" aria-labelledby="cv-education">
          <h2 className="cv-h" id="cv-education">
            Education
          </h2>
          <ul className="cv-list">
            <li>
              <p className="cv-entry">
                <span>
                  <strong>Utrecht University</strong>, BSc Computer Science
                </span>
                <span className="cv-when">September 2024 to early 2028 (expected)</span>
              </p>
              <ul>
                <li>My average grade is 8 out of 10, and my minor is Entrepreneurship.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="cv-part" aria-labelledby="cv-skills">
          <h2 className="cv-h" id="cv-skills">
            Skills
          </h2>
          <dl className="cv-skills">
            <div>
              <dt>Programming</dt>
              <dd>Luau, C++, Rust, CUDA, Python, TypeScript, C#, .NET</dd>
            </div>
            <div>
              <dt>Areas</dt>
              <dd>compilers and JITs, WebAssembly, GPU performance, PostgreSQL and TimescaleDB</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Nsight Compute, perf, Git, CMake, Docker</dd>
            </div>
            <div>
              <dt>Spoken languages</dt>
              <dd>Dutch, English</dd>
            </div>
          </dl>
        </section>

        <p className="report-cta">
          <a className="button" href={PDF} download>
            <Download size={17} strokeWidth={2} aria-hidden="true" />
            Download the CV (PDF)
          </a>
        </p>
      </article>
    </main>
  );
}
