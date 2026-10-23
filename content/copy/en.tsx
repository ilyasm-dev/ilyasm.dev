import Ext from "@/components/ExternalLink";
import type { Copy } from "./types";

export const en: Copy = {
  lang: "en",
  locale: "en_US",
  site: {
    title: "Ilyas Mallah, software engineer",
    description:
      "Ilyas Mallah, software engineer in the Netherlands. I find out why software is slow and make it fast, in AI inference, databases, runtimes and compilers.",
    ogAlt: "Ilyas Mallah. I find out why software is slow, and make it fast.",
    ogImage: "/og.png",
    skip: "Skip to content",
    nav: { start: "How it works", work: "Work", contact: "Contact" },
    theme: "Switch color theme",
    switchTo: { label: "NL", name: "Nederlands", lang: "nl" },
    offer: { region: "Language", text: "This page is also in English.", go: "Read in English", close: "Close" },
    privacy: "Privacy",
    earlier: "Earlier work (green-real)",
    cv: "CV",
    writing: "Writing",
    email: "Email",
  },
  copyButton: { text: "Copy", copied: "Copied", aria: "Copy email address" },
  reply: {
    text: "I reply within hours, 9 am to 9 pm {zone}{yours}.",
    zoneFallback: "Amsterdam time",
    yours: " ({start} to {end} your time)",
  },
  showcase: {
    aria: "Measured results",
    tabsAria: "Results",
    tabs: [
      {
        figureShort: "Up to 2.1x faster",
        topic: "AI replies",
        figure: "Up to 2.1x faster AI replies",
        meaning: "Long chats answer about twice as fast without new hardware.",
        measured: "Measured on an RTX 5090 GPU",
        source: "llama.cpp PR #30077",
      },
      {
        figureShort: "Up to 52% more",
        topic: "AI serving",
        figure: "Up to 52% more AI tokens per second",
        meaning: "Two GPUs now serve more than what three GPUs served before my fix.",
        measured: "Measured on an H100 GPU (shown {speedup}x faster)",
        source: "vLLM PR #60464",
      },
      {
        figureShort: "50x faster",
        topic: "Chart queries",
        figure: "50x faster chart queries",
        meaning: "Chart queries that went from slow to instant.",
        measured: "Measured on production",
        source: "Rolantir case",
      },
    ],
    newTab: " (opens in a new tab)",
    slowMotion: "slow motion 10x",
    replay: "replay",
    replayAria: "Replay",
    before: "before",
    after: "after",
    doneIn: "done in {s} s",
    seconds: "{s} s",
    chatQuestion: "Summarize the key risks in this 40-page contract.",
    chatAnswer:
      "Here are the main risks I found. First, the termination clause lets the supplier end the agreement with only " +
      "thirty days notice, while you must give ninety. Second, liability is capped at the fees paid in the last " +
      "three months, which is far below the cost of a serious outage. Third, the contract renews automatically for " +
      "a full year unless you cancel in writing sixty days before the end date. Fourth, intellectual property " +
      "created during the project stays with the supplier, so you would only hold a license to use it. Fifth, " +
      "prices may rise once a year by up to twelve percent without your approval. Finally, disputes must go to " +
      "arbitration in a foreign court, which makes any claim slow and expensive. I would negotiate the notice " +
      "period, the liability cap and the renewal terms before signing.",
    chatLabel:
      "Two chats answer the same question about a long contract. Before the fix the answer takes {before} seconds. After the fix it takes {after} seconds.",
    servingLabel:
      "Two grids of {tiles} bars, one per request served at once. Each bar fills {perTile} times, once per request at its measured time, then stays full. Before the fix the GPU produces {beforeTps} tokens per second and finishes all {requests} requests in {beforeS} seconds. After the fix it produces {afterTps} and finishes in {afterS} seconds.",
    chartLabel:
      "Two dashboard panels show the same example chart of a game's player count over a week. Each chart appears when its query finishes on the server. Before the rewrite the query takes {before} milliseconds. After it takes {after} milliseconds.",
    chartDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    chartQuerying: "querying",
    chartExample: "example data",
  },
  bars: {
    before: "before",
    after: "after",
    chartRange: ["400 to 900 ms", "3 to 8 ms"],
    chartCaption: "Hourly chart query time, measured on production, June 2026",
    chartLabel: "Hourly chart query time, 400 to 900 ms before and 3 to 8 ms after the rewrite",
    decodeCaption: "Decode speed at 32k tokens of context, RTX 5090, CUDA 12.8.1",
    decodeLabel: "Decode speed at 32k tokens of context, {m} tokens per second before the fix and {f} after",
  },
  home: {
    eyebrow: "Performance engineer for AI and backend systems",
    title: ["I find out why software is slow,", "and make it fast."],
    lede: "Faster responses, fewer GPUs, lower cloud bills. I find what's slow, prove it, and fix it.",
    contact: "Contact",
    howItWorks: "How it works",
    available: "Open to contract work.",
    creditEngines: (
      <>
        The llama.cpp and vLLM gains are fixes to the engines themselves, so they speed up everyone who runs them. Your own
        stack has inefficiencies of its own on top of that, and that&apos;s where I start.
      </>
    ),
    creditLuau:
      "I work inside compilers and language runtimes too. Roblox's Luau team has merged {n} of my fixes to its native code generator, register allocator and type checker.",
    seeThem: "See the Luau fixes",
    creditWasmtime: (
      <>
        Wasmtime&apos;s maintainers merged <Ext href="https://github.com/bytecodealliance/wasmtime/pull/14778">another</Ext>, to its
        x64 code generator, and credited me as the reporter of a{" "}
        <Ext href="https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-mghf-wjfp-p5xm">security advisory</Ext>.
      </>
    ),
    problemsTitle: "Problems I solve",
    areas: [
      {
        title: "AI models that run slower than the hardware allows",
        line: "I profile inference engines such as llama.cpp and vLLM down to the GPU kernels, and fix the bottleneck.",
        proof: "Up to 2.1x faster decoding at 32k context in llama.cpp on an RTX 5090 with a q4_0 cache and CUDA 12.8 (fix in review).",
      },
      {
        title: "Backends and databases that don't keep up",
        line: "Slow queries, data that keeps growing, and migrations that cannot lose anything on the way.",
        proof:
          "After I rewrote Rolantir's hourly chart queries, they took 3 to 8 ms instead of 400 to 900 ms, measured on production. The database move kept the full history.",
      },
      {
        title: "A cloud or GPU bill growing faster than your users",
        line: "I profile where the compute goes, find the work that should not be there, and fix it, so the same traffic needs less hardware.",
        proof: "In my sample audit, the same document traffic fit on 3 GPUs instead of 5 after one setting change.",
      },
      {
        title: "C, C++ or Rust code that reads untrusted input",
        line: "I sweep one parser, codec, runtime or VM for the bugs crafted input can trigger, and deliver each one with a reproducer and a fix.",
        proof:
          "Wasmtime's maintainers credited me as the reporter of a security advisory, and wabt and mruby merged my fixes for memory sizes and string lengths that wrapped.",
      },
    ],
    startTitle: "Start with a two-week investigation",
    startLead: (
      <>
        One fixed price to learn what&apos;s slow, why, and what fixing it is worth. <span>Then I fix it.</span>
      </>
    ),
    investigation: "Investigation",
    weeks: "2 weeks",
    introBadge: "Introductory price",
    priceNow: "€3,000",
    priceNowUsd: "/ $3,500",
    priceWas: "Regular price €4,500 / $5,500",
    priceScope: "One workload in one environment",
    steps: [
      { title: "You send the slow part", text: "Tell me what's slow and where it runs. Then we talk it through in a short call." },
      { title: "I find the cause", text: "I measure a baseline and trace the slowdown to its cause, at whatever layer it sits." },
      { title: "You get the report", text: "Ranked fixes, each with its expected gain, its cost and how sure I am." },
    ],
    includedAria: "Included",
    included: ["A measured baseline", "Causes with evidence", "Ranked fixes", "A fixed quote for the fix", "Up to 2 hours of calls"],
    sampleReport: "See a sample report",
    fix: "The fix",
    fixBadge: "Priced separately",
    fixPrice: "Fixed quote",
    fixPriceFrom: "from the report",
    fixNote: "You see the price before you decide.",
    fixSteps: [
      { title: "I fix it", text: "At the fixed price from the report, agreed in writing before I start." },
      { title: "You review the pull requests", text: "Every change goes through your CI, and nothing ships without your sign-off." },
      { title: "I measure the result", text: "Against the same baseline as the report, so you see what changed." },
    ],
    teamFixes: (
      <>
        <strong>Or your team fixes it from the report.</strong> It&apos;s written so your engineers can act on it.
      </>
    ),
    workTogether: "Let's work together",
    priceFine: "Rented GPU time is billed at cost, with your approval first. Prices exclude VAT.",
    sweepTitle: "Or a two-week hardening sweep",
    sweepText:
      "One C, C++ or Rust component that reads untrusted input, such as a parser, codec, runtime or VM. You get the bugs crafted input can trigger, each confirmed before it goes in the report.",
    sweepIncluded: ["Confirmed findings only", "A reproducer for each", "A fix for each"],
    sweepPrice: "Same price and the same two weeks as the investigation.",
    safeguardsTitle: "Working in your systems",
    safeguards: [
      "I sign your NDA.",
      "I work on a staging copy or with read-only access to production metrics.",
      "Nothing touches production without your sign-off.",
      "Changes come as normal pull requests through your CI.",
      "What I build for you is yours once paid.",
    ],
    workTitle: "Selected work",
    readCase: "Read the case",
    rolantir: {
      status: "co-founded",
      text: "Analytics for the Roblox platform. It tracks 1M+ games in a 24.5 GB live database. I started it from the backend, crawler and game tracker, and moved it live from SQLite to PostgreSQL with TimescaleDB without losing history.",
      stats: [
        {
          value: (
            <>
              <span className="stat-good">50x</span> faster chart queries
            </>
          ),
          sub: "measured on production",
        },
        {
          value: (
            <>
              <span className="stat-good">9.5x</span> smaller history
            </>
          ),
          sub: "35 GB stored in 3.7 GB",
        },
      ],
    },
    llama: {
      status: "upstream fix",
      text: "A fix in llama.cpp itself for long AI conversations on an RTX 5090. The compiler kept a small value in slow memory, and I changed how the kernel reads it.",
      stats: [
        {
          value: (
            <>
              <span className="stat-good">2.1x</span> faster decoding
            </>
          ),
          sub: "at 32k context",
        },
        { value: "About 10 lines changed", sub: "in two functions" },
      ],
      pr: "PR #30077 (open)",
    },
    luau: {
      title: "Luau compiler and runtime",
      status: "{n} merged",
      text: "Luau is the language behind Roblox. Its maintainers merged {n} of my fixes in 2026, to the native code generator, register allocator and type checker.",
      prs: [
        "x64 register allocator converted a value wrongly on reload from the stack",
        <>
          Integer comparisons from <span className="val-bad">3.18 ns</span> to <span className="val-good">0.63 ns</span> with
          predictable branches
        </>,
        "ARM64 fast path for looping over arrays, as x64 already had",
        "Type checking for calls through a __call metamethod",
      ],
      all: "All merged pull requests",
    },
    digIt: {
      status: "co-owned, sold",
      text: "A Roblox game I co-founded and co-owned from October 2024 to March 2025, then sold. I did design, backend systems and live operations.",
      stats: [
        { value: "73M visits", sub: "on Roblox" },
        { value: "27,400 players at once", sub: "at the peak" },
      ],
      game: "Game page on Roblox",
      history: "Player history on RoTrends",
    },
    writingTitle: "Writing",
    writingLead: "How I found two of these slowdowns, step by step, with the numbers and the dead ends.",
    writingMeta: "{n} min read",
    writingAll: "All writing",
    ossTitle: "Recent open source work",
    contributedTo: "Contributed to",
    highlights: [
      {
        status: "PRs open",
        metric: (
          <>
            Up to <span className="val-good">52%</span> more output tokens per second
          </>
        ),
        unit: "on the CUTLASS FP8 path, one H100 NVL",
        text: "Picks the matrix kernel by batch size. 17 to 52% more output tokens per second on one H100 NVL (Qwen3-8B-FP8) when vLLM uses its CUTLASS FP8 path.",
      },
      {
        status: "published",
        metric: "Credited reporter of a Wasmtime security advisory",
        unit: "GHSA-mghf-wjfp-p5xm, October 2026",
        text: "I reported a security bug to the Wasmtime maintainers in private. They fixed it in Wasmtime 36.0.19, 48.0.7 and 49.0.4, then published the advisory with me as its reporter.",
      },
      {
        status: "merged",
        metric: "Float to small integer conversions no longer crash the compiler",
        unit: "in Cranelift, Wasmtime's code generator, on x64",
        text: "Converting a float to an 8- or 16-bit integer crashed Cranelift's x64 backend, while its ARM64, RISC-V and s390x backends handled it. My fix converts through 32 bits, then saturates or traps. The maintainers merged it, which closed an issue open since 2022.",
      },
      {
        status: "merged",
        metric: "A 4 GiB memory no longer becomes 0 bytes",
        unit: "on 32-bit hosts, in WebAssembly's wasm2c",
        text: "wasm2c turns WebAssembly into C. On 32-bit hosts a 4 GiB memory size wrapped to 0, which freed memory still in use. My fix refuses sizes that don't fit, and the maintainers merged it.",
      },
    ],
    morePrsOne: "One more PR open.",
    morePrsMany: "{n} more PRs open.",
    hardening:
      "I also harden code that handles untrusted input, with bounds checks in LLVM's C++ library, a fix for a hang in zstd on a crafted file, and a merged mruby fix for string lengths that wrapped at 2 GiB.",
    allPrs: "Pull requests to other projects ({count})",
    prMix: "{merged} merged, {open} open, {projects} projects",
    groupMerged: "{n} merged",
    groupOpen: "{n} open",
    stateMerged: "merged",
    stateOpen: "open",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    aboutTitle: "Who you would work with",
    role: "Performance engineer for AI and backend systems",
    aboutText: (
      <>
        I&apos;m a software engineer in the Netherlands, and <strong>I specialize in performance</strong>. Performance problems
        often <em>fall between specialists</em>. The symptom is a slow API or a costly AI model, and the cause sits in a query
        plan, a runtime or a GPU kernel. I work at all of those layers, so{" "}
        <strong>one person follows the problem from the symptom to the fix</strong>. I do that inside your codebase, with your
        tools. vLLM and llama.cpp were once codebases I had never seen before, and thousands of other specialists had already
        worked on optimizing them. <em>I still found significant speedups in both.</em>
      </>
    ),
    ctaTitle: "So, something slower than it should be?",
    ctaText: (
      <>
        Email me the slow part, where it runs and the result you want, such as a latency or cost target.{" "}
        <span>
          If you don&apos;t know the technical details, describe what&apos;s slow or what it costs, and I&apos;ll ask the rest.
        </span>
      </>
    ),
    mailSubject: "Something slow in our system",
    socialAria: { linkedin: "LinkedIn profile", github: "GitHub profile", x: "X profile", discord: "Discord profile" },
    buildingTitle: "Also building",
    building: [
      {
        tag: "in development",
        text: "Compiles WebAssembly to Luau. Ten real programs, including SQLite and QuickJS, match the wasmtime reference output.",
      },
      {
        tag: "in development",
        text: "A Rust and CUDA simulator for an entire fly brain, all 165,122 neurons, with hand-written and optimized CPU and GPU kernels. One simulated second runs in 0.37 s on a consumer graphics card (RTX 3070 Ti).",
      },
      {
        tag: "in development",
        text: "A command-line check for silent slowdowns in self-hosted LLM serving. Every rule comes from a measured case.",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    description: "What this site and my emails do with personal data, and how to object.",
    back: "Back to the home page",
    lede: (
      <>
        I am Ilyas Mallah, trading as I. Mallah Development (KvK 98045024), Torenlaan 5 B, 1402 AT Bussum, the Netherlands. I am the
        controller. Contact: <a href="mailto:ilyas@ilyasm.dev">ilyas@ilyasm.dev</a>.
      </>
    ),
    sections: [
      {
        title: "This website",
        paragraphs: [
          "The site is static and hosted on GitHub Pages. It has no forms, no accounts and no cookies. Cloudflare Web Analytics counts page views and processes your IP address to do it, without cookies and without following you across sites. Fonts are served from this site. Your browser keeps two settings in local storage on your device: light or dark theme, and the language you pick. I never receive them.",
        ],
      },
      {
        title: "Email you send me",
        paragraphs: [
          "I keep your message and my reply in my mailbox (Spacemail, forwarded to Gmail) as long as the conversation is useful. I delete it two years after the last message. If we work together, invoices and contracts stay for seven years because Dutch tax law requires it.",
        ],
      },
      {
        title: "Email I send first",
        paragraphs: [
          "Sometimes I write to a person at a company about performance work. I use your name, work email and role from the company's own website. I also note what caught my attention, such as a blog post, a job ad or an open source project. I do not buy lists or guess addresses.",
          "My legal basis is legitimate interest (GDPR Art. 6(1)(f)). I weighed it this way. I contact you about your own work, I send one personal message, and you can stop it at once. If I hear nothing, I delete your details after 12 months.",
          <>
            To opt out, reply &ldquo;no&rdquo; or email me. I keep only your address on a suppression list so I never contact you again. I do
            not sell or share your data.
          </>,
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          <>
            You can ask me for access to your data, to correct it, to erase it, or to stop using it. You can also object to my emails at any
            time. Email me and I answer within one month. You can complain to the{" "}
            <Ext href="https://autoriteitpersoonsgegevens.nl/en">Autoriteit Persoonsgegevens</Ext>, the Dutch data protection authority.
          </>,
        ],
      },
    ],
  },
};
