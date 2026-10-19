import type { Metadata } from "next";
import { pageMeta } from "@/lib/pageMeta";
import Link from "next/link";
import DecodeChart from "@/components/DecodeChart";
import Ext from "@/components/ExternalLink";
import { MemoryDetour } from "@/components/Illustrations";

// Facts and numbers from the hub's contributions/llama.cpp/30077-v-dequant-blackwell/notes.md and pr.md.
export const metadata: Metadata = pageMeta("llama.cpp case study", "A 10 line fix in llama.cpp that makes decoding up to 2.1x faster at 32k context on an RTX 5090 with a q4_0 cache.", "/work/llama-cpp/");

export default function LlamaCase() {
  return (
    <main id="main" className="wrap section page">
      <p className="back">
        <Link href="/#work">Back to selected work</Link>
      </p>
      <article className="article case-study">
        <header>
          <span className="tag tag-soft">Case study</span>
          <h1>Up to 2.1x faster decoding at 32k context in llama.cpp on an RTX 5090</h1>
          <p className="case-lede">
            Long AI conversations ran at about half speed on the newest NVIDIA graphics cards. I found why and fixed it in
            llama.cpp itself.
          </p>
        </header>

        <dl className="case-stats">
          <div>
            <dt>
              <span className="stat-good">2.1x</span> faster decoding
            </dt>
            <dd>at 32k context</dd>
          </div>
          <div>
            <dt>
              <span className="stat-good">1.7x</span> faster decoding
            </dt>
            <dd>at 16k context</dd>
          </div>
          <div>
            <dt>About 10 lines changed</dt>
            <dd>in two functions</dd>
          </div>
          <div>
            <dt>1728 of 1728 tests pass</dt>
            <dd>attention tests, with the fix</dd>
          </div>
        </dl>

        <section className="case-part">
          <h2 className="case-h case-h-bad">The problem</h2>
          <p>
            Attention ran at about half speed on an RTX 5090, a Blackwell GPU, when llama.cpp used a compressed q4_0 KV cache
            (the memory that holds each conversation&apos;s context). This happened in builds made with CUDA 12.8, the version in
            its Docker images.
          </p>
          <p>
            It was not a recent bug. I compiled the kernel from llama.cpp as it stood at six dates going back a year, and every CUDA 12.8 build for
            Blackwell had it. It affects GeForce RTX 50 and RTX PRO Blackwell cards on llama.cpp&apos;s own Docker images and Ubuntu
            release builds. Older GPUs and newer CUDA versions were fine.
          </p>
        </section>

        <section className="case-part">
          <h2 className="case-h">What I did</h2>
          <p>
            The CUDA 12.8 compiler kept a small value in slow local memory. I traced that and changed how the kernel reads it, in
            about 10 lines.
          </p>
          <MemoryDetour />
          <p className="case-tech">
            For engineers. On Blackwell, nvcc 12.8 gave the vector flash attention kernel a 128 to 336 byte stack frame when the
            V cache is q4_0 or q5_0. The trigger was a byte-pointer read of the dequantized word. The fix reads those bytes with
            shifts, so the value stays in registers and the stack frame is gone.
          </p>
          <p>
            In review, a maintainer tested the change on older cards and found q5_0 running slower on an RTX 3090. I limited the
            new code path to Blackwell, where the problem is, and checked that older GPUs compile to identical code.
          </p>
        </section>

        <section className="case-part">
          <h2 className="case-h case-h-good">The result</h2>
          <DecodeChart />
          <p>
            With the fix, the compressed q4_0 cache decodes at <span className="val-good">97%</span> of the speed of the
            uncompressed f16 cache at 16k context, against <span className="val-bad">57%</span> before. The q8_0 cache is
            unchanged.
          </p>
          <p className="case-proof">
            The fix is <Ext href="https://github.com/ggml-org/llama.cpp/pull/30077">pull request #30077</Ext>, open and in review.
          </p>
          <p>
            The full investigation, with the compiler output and the review, is in{" "}
            <Link href="/writing/blackwell-q4_0-cuda-12-8/">the write-up</Link>.
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
