import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import Ext from "@/components/ExternalLink";
import { pageMeta } from "@/lib/pageMeta";
import { countWord, prCount, upperFirst } from "@/lib/prCounts";

// The page for hiring readers. The CV PDF and the hub's assets/cv.md link here, and its text follows that CV. CV
// visits stay their own path in Cloudflare Web Analytics, which drops query strings: a click from the PDF arrives
// with no referrer, a click from this site's footer with ilyasm.dev as referrer.
export const metadata: Metadata = pageMeta(
  "CV",
  "Ilyas Mallah's CV: open source work in Luau, llama.cpp, vLLM and LLVM, projects, experience and education, with the PDF to download.",
  "/cv/",
);

// The counts in the bullets come from data/prs.json, which every build rewrites from GitHub.
const VLLM_OPEN = prCount("vllm-project/vllm", "open");
const LLVM_OPEN = prCount("llvm/llvm-project", "open");
const LUAU_MERGED = prCount("luau-lang/luau", "merged");
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
            Third-year Computer Science student at Utrecht University. I work on performance and correctness across the stack: LLM
            inference engines (vLLM, llama.cpp), compilers and runtimes (Luau, Wasmtime), GPU kernels, and production backends.
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

        <section className="cv-part" aria-labelledby="cv-looking">
          <h2 className="cv-h" id="cv-looking">
            What I&apos;m looking for
          </h2>
          <p>Internships and contract work, part-time during the year or full-time in the summer.</p>
          <dl className="case-stats cv-facts">
            <div>
              <dt>Summer 2027</dt>
              <dd>full-time, 5 July to 3 September</dd>
            </div>
            <div>
              <dt>During the study year</dt>
              <dd>part-time</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>on-site within commuting distance in the Netherlands, or remote</dd>
            </div>
            <div>
              <dt>Graduating</dt>
              <dd>BSc Computer Science, early 2028</dd>
            </div>
          </dl>
        </section>

        <section className="cv-part" aria-labelledby="cv-oss">
          <h2 className="cv-h" id="cv-oss">
            Open source
          </h2>
          <ul className="cv-list">
            <li>
              <p>
                <strong>Luau</strong> (Roblox&apos;s scripting language, under the handle{" "}
                <Ext href="https://github.com/luau-lang/luau/pulls?q=is%3Apr+author%3Agreen-real+is%3Amerged">
                  <code>green-real</code>
                </Ext>
                ). {LUAU_MERGED} changes merged in 2026 into the x64 and AArch64 native code generator, the register allocator and the type
                checker.
              </p>
              <ul>
                <li>
                  Integer <code>==</code> in branches: a new IR command with x64 and AArch64 lowering. 3.18 ns to 0.63 ns per
                  comparison (<Pr repo="luau-lang/luau" n={2571} />
                  ).
                </li>
                <li>
                  Fixed an x64 register allocator miscompile when restoring a spilled value (<Pr repo="luau-lang/luau" n={2987} />
                  ).
                </li>
                <li>
                  Array fast path for <code>for ... in pairs</code> on AArch64, matching x64 (<Pr repo="luau-lang/luau" n={2683} />
                  ).
                </li>
              </ul>
            </li>
            <li>
              <p>
                <strong>llama.cpp</strong> (CUDA, LLM inference). Traced why decoding with a q4_0 KV cache ran at half speed on RTX
                50 series GPUs with CUDA 12.8 to a compiler bug, and worked around it in the kernel: up to 2.1x faster decode at 32k
                context on an RTX 5090 (<Pr repo="ggml-org/llama.cpp" n={30077} />, in review).{" "}
                <Link href="/work/llama-cpp/">The case study</Link>
              </p>
            </li>
            <li>
              <p>
                <strong>LLVM</strong> (libc++, Clang). {upperFirst(countWord(LLVM_OPEN, "en"))} {LLVM_OPEN === 1 ? "PR" : "PRs"} in review: hardening assertions for <code>insert</code>/
                <code>emplace</code> positions (<Pr repo="llvm/llvm-project" n={230490} />
                ), <code>resize_and_overwrite</code> bounds (<Pr repo="llvm/llvm-project" n={230605} />
                ), <code>valarray</code> sizes (<Pr repo="llvm/llvm-project" n={230606} />
                ), iterator ranges in <code>string</code> <code>insert</code>, <code>append</code> and <code>assign</code> (<Pr repo="llvm/llvm-project" n={234566} />
                ), <code>list::splice</code> and <code>erase(end())</code> (<Pr repo="llvm/llvm-project" n={232538} />,{" "}
                <Pr repo="llvm/llvm-project" n={232661} />
                ), negative counts in <code>views::drop</code>, <code>views::take</code> and <code>views::counted</code> (
                <Pr repo="llvm/llvm-project" n={234068} />
                ), a missing XMM register save in x86 variadic functions built with stack clash protection (
                <Pr repo="llvm/llvm-project" n={234871} />
                ), a Clang warning (<Pr repo="llvm/llvm-project" n={230491} />
                ), and a Clang Safe Buffers gate and its libc-call subgroups (<Pr repo="llvm/llvm-project" n={232898} />,{" "}
                <Pr repo="llvm/llvm-project" n={233604} />
                ).
              </p>
            </li>
            <li>
              <p>
                <strong>Wasmtime</strong> (WebAssembly runtime, Cranelift code generator). Added float to 8- and 16-bit integer
                conversions to the x64 backend, which panicked on them, closing an issue open since 2022 (
                <Pr repo="bytecodealliance/wasmtime" n={14778} />
                ). Made <code>fpromote</code> and <code>fdemote</code> with f16 or f128 operands fail cleanly, where aarch64 compiled
                them to wrong values and x64 and s390x panicked (<Pr repo="bytecodealliance/wasmtime" n={14883} />
                ). Both merged in October 2026. Credited reporter of security advisory{" "}
                <Ext href="https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-mghf-wjfp-p5xm">GHSA-mghf-wjfp-p5xm</Ext> (<span style={{ whiteSpace: "nowrap" }}>CVE-2026-115893</span>),
                published in October 2026 and fixed in Wasmtime 36.0.19, 48.0.7 and 49.0.4.
              </p>
            </li>
            <li>
              <p>
                <strong>wabt</strong> (WebAssembly tools). Fixed wasm2c on 32-bit hosts, where a 4 GiB memory size wrapped to 0 and
                freed memory still in use (<Pr repo="WebAssembly/wabt" n={2874} />
                ). Fixed four wabt tools that exited 0 when they could not write their output file, so they now exit with an error (
                <Pr repo="WebAssembly/wabt" n={2889} />
                ). Both merged in October 2026.
              </p>
            </li>
            <li>
              <p>
                <strong>mruby</strong> (embedded Ruby). Fixed <code>pack</code> and <code>unpack</code> string lengths that wrapped
                negative at 2 GiB and read outside the string (<Pr repo="mruby/mruby" n={7692} />
                ). Fixed <code>Float(&quot;0&quot;)</code> raising an error, a regression since 4.1.0-rc (
                <Pr repo="mruby/mruby" n={7701} />
                ). Fixed <code>Float#to_r</code> and <code>Rational(float)</code> raising <code>ZeroDivisionError</code> for very small
                floats (<Pr repo="mruby/mruby" n={7703} />
                ). All three merged in October 2026.
              </p>
            </li>
            <li>
              <p>
                <strong>wgpu</strong> (Rust graphics, naga shader translator). Fixed naga&apos;s fuzz build, broken on OSS-Fuzz
                since March 2026. Merged in October 2026 (<Pr repo="gfx-rs/wgpu" n={10637} />
                ).
              </p>
            </li>
            <li>
              <p>
                <strong>tt-metal</strong> (Tenstorrent AI accelerators). Found a float32 accuracy bug in <code>ttnn.logit</code>{" "}
                with a simulator sweep of 54 ops, up to 8,767 ULP off near 0.5. My fix brings it to 3 ULP (issue{" "}
                <Pr repo="tenstorrent/tt-metal" n={59930} kind="issues" />
                ).
              </p>
            </li>
            <li>
              <p>
                <strong>vLLM</strong> (LLM serving, {countWord(VLLM_OPEN, "en")} {VLLM_OPEN === 1 ? "PR" : "PRs"} in review). On Hopper, picked the CUTLASS block-FP8 kernel by batch
                size: 17 to 52% more serving throughput on an H100 NVL with Qwen3-8B FP8 (<Pr repo="vllm-project/vllm" n={60464} />
                ). Stopped block-FP8 models from crashing at startup when nvcc is older than 12.9 (
                <Pr repo="vllm-project/vllm" n={60438} />
                ). Removed a residual copy per layer that a compiler pass left in block-FP8 models (
                <Pr repo="vllm-project/vllm" n={60481} />
                ). Added a context window for EAGLE-3 speculative decoding drafters: decode at 32k tokens goes from 16 to 34 tok/s on an
                A40 with Llama-3.1-8B (<Pr repo="vllm-project/vllm" n={63245} />
                ).
              </p>
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
                <strong>Ulana</strong>, an optimizing WebAssembly to Luau compiler, written in Luau (about 39,000 lines of source).
                Ten real programs, among them SQLite, QuickJS, jq and zstd, run as generated Luau and match wasmtime&apos;s output.
              </p>
            </li>
            <li>
              <p>
                <strong>Ganglion</strong>, a Rust and CUDA simulator for brain wiring diagrams (connectomes). It runs a fruit fly
                central nervous system (165,122 neurons, 24.5 M connections) faster than real time on one RTX 3070 Ti. One simulated
                second takes 0.37 s. Its reference mode matches the Python reference simulator bit for bit.
              </p>
            </li>
            <li>
              <p>
                <strong>Lute FFI</strong>, a C foreign function interface for the Lute runtime, from specification to a
                five-milestone implementation with full Luau types. Not yet public: the proposal to the Lute maintainers is in
                preparation.
              </p>
            </li>
          </ul>
        </section>

        <section className="cv-part" aria-labelledby="cv-experience">
          <h2 className="cv-h" id="cv-experience">
            Experience
          </h2>
          <ul className="cv-list">
            <li>
              <p>
                <strong>Rolantir</strong>, analytics platform for the Roblox games market. Co-founder since June 2026. Its catalog holds
                over 1 million Roblox games in a 24.5 GB production database (October 2026). I built almost all of the backend
                (TypeScript, PostgreSQL and TimescaleDB). I moved the live 13.9 GB SQLite database to TimescaleDB with the full
                history kept. Hourly chart queries went from 400 to 900 ms to 3 to 8 ms. Fixed a recurring production deadlock.{" "}
                <Link href="/work/rolantir/">The case study</Link>
              </p>
            </li>
            <li>
              <p>
                <strong>Dig It</strong>, Roblox game. Co-founder, October 2024 to March 2025. Programming, design and live
                operations for a game that reached over 73 million visits. At its peak it had 27,400 players online at once,
                500,000 daily and 5.3 million monthly active users. Led the negotiation when the game was sold.{" "}
                <Ext href="https://www.roblox.com/games/76455837887178">Game page on Roblox</Ext>
              </p>
            </li>
          </ul>
        </section>

        <section className="cv-part" aria-labelledby="cv-education">
          <h2 className="cv-h" id="cv-education">
            Education
          </h2>
          <p>
            <strong>Utrecht University</strong>, BSc Computer Science. September 2024 to early 2028 (expected). Average grade 7.71
            out of 10. Minor: Entrepreneurship.
          </p>
        </section>

        <section className="cv-part" aria-labelledby="cv-skills">
          <h2 className="cv-h" id="cv-skills">
            Skills
          </h2>
          <dl className="cv-skills">
            <div>
              <dt>Languages</dt>
              <dd>Luau, C++, Rust, CUDA, Python, TypeScript, C#</dd>
            </div>
            <div>
              <dt>Areas</dt>
              <dd>
                compilers and JITs (IR, register allocation, x64 and AArch64 code generation), GPU performance, WebAssembly,
                databases (PostgreSQL, TimescaleDB)
              </dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Nsight Compute, perf, Git, CMake, Docker</dd>
            </div>
            <div>
              <dt>Spoken</dt>
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
