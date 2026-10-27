import { ArrowDown, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { ServingBars, TokenizerBars } from "@/components/BeforeAfterBars";
import CopyButton from "@/components/CopyButton";
import Ext from "@/components/ExternalLink";
import { Status, type StatusKind } from "@/components/Status";
import ReplyHours from "@/components/ReplyHours";
import Showcase from "@/components/Showcase";
import SocialIcon, { type IconName } from "@/components/SocialIcons";
import { COPY } from "@/content/copy";
import type { Stat } from "@/content/copy/types";
import prsData from "@/data/prs.json";
import { fill, type Lang } from "@/lib/i18n";
import { prCount } from "@/lib/prCounts";
import { allPosts, monthYear } from "@/lib/posts";
import { tokenize } from "@/lib/race";

// The home page in either language. All text comes from content/copy. Links, icons and figures from data stay here,
// so both languages share them.

const SOCIALS: { name: string; href: string; aria: "linkedin" | "github" | "x" | "discord"; icon: IconName }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ilyas-mallah", aria: "linkedin", icon: "linkedin" },
  { name: "GitHub", href: "https://github.com/ilyas-mallah", aria: "github", icon: "github" },
  { name: "X", href: "https://x.com/ilyasmdev", aria: "x", icon: "x" },
  { name: "Discord", href: "https://discord.com/users/1557401037042618432", aria: "discord", icon: "discord" },
];

// Path of a square photo in public/, such as "/ilyas.jpg". Until it's set, the about card shows the name and role only.
const ABOUT_PHOTO: string | null = null;

const EMAIL = "hello@ilyasm.dev";

const CONTRIBUTED: { name: string; by?: string }[] = [
  { name: "LLVM" },
  { name: "vLLM" },
  { name: "llama.cpp" },
  { name: "Luau", by: "Roblox" },
  { name: "Wasmtime", by: "Bytecode Alliance" },
  { name: "wabt", by: "WebAssembly" },
  { name: "zstd", by: "Meta" },
  { name: "mruby" },
  { name: "wgpu" },
  { name: "tt-metal", by: "Tenstorrent" },
];

// Merged fixes of the Selected work section, from the hub's contributions/README.md, each with the setup it was checked in.
// The advisory is shown at the level of its public page only: the ID, the credit and the fixed versions.
const PROOFS: { name: string; href: string; status: StatusKind }[] = [
  { name: "Wasmtime", href: "https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-mghf-wjfp-p5xm", status: "done" },
  { name: "Wasmtime", href: "https://github.com/bytecodealliance/wasmtime/pull/14778", status: "merged" },
  { name: "ONNX", href: "https://github.com/onnx/onnx/pull/8650", status: "merged" },
  { name: "wabt", href: "https://github.com/WebAssembly/wabt/pull/2874", status: "merged" },
  { name: "mruby", href: "https://github.com/mruby/mruby/pull/7692", status: "merged" },
];

// The one open source highlight, work merged under the handle green-real. The full list is data/prs.json, written at build time by scripts/fetch-prs.mjs.
const LUAU_HIGHLIGHT = { name: "Luau", href: "https://github.com/luau-lang/luau/pull/2571", status: "merged" as StatusKind };

type Pr = { repo: string; number: number; title: string; url: string; state: "open" | "merged"; createdAt: string; mergedAt: string | null; author: string };
const PRS = prsData as Pr[];
const LUAU_COUNT = prCount("luau-lang/luau", "merged");
const MERGED = PRS.filter((p) => p.state === "merged").length;
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

const LUAU_MERGED = "https://github.com/luau-lang/luau/pulls?q=is%3Apr+author%3Agreen-real+is%3Amerged";

const IN_PROGRESS = ["Ulana", "Ganglion", "infdoc"];

// Published posts, newest first. They are English, so the Dutch page marks them as such.
const POSTS = allPosts();

// The chat race runs on the English answer's length in every language, so the measured seconds stay the same.
const RACE_TOKENS = tokenize(COPY.en.showcase.chatAnswer).length;

// The two figures of a work card. Each leads with its number, then the setup it was measured in.
function Stats({ stats }: { stats: [Stat, Stat] }) {
  return (
    <div className="stats">
      {stats.map((st, i) => (
        <div key={i}>
          <strong>{st.value}</strong>
          <span>{st.sub}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  const c = copy.home;
  // Pages that exist only in English are marked as such for browsers and crawlers.
  const enOnly = lang === "en" ? undefined : "en";
  const monthOf = (d: string) => `${c.months[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(c.mailSubject)}`;

  const caseLink = (href: string) => (
    <Link className="flow-link" href={href} hrefLang={enOnly}>
      {c.readCase}
      <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
    </Link>
  );

  return (
    <main id="main">
      <section className="hero wrap">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1>
          {c.title[0]}
          <br />
          {c.title[1]}
        </h1>
        <p className="lede">{c.lede}</p>
        <div className="cta-row">
          <a className="button" href="#contact">
            {c.contact}
          </a>
          <a className="button button-quiet" href="#start">
            {c.howItWorks}
          </a>
          <span className="cta-note">{c.available}</span>
        </div>
        <Showcase copy={copy.showcase} lang={lang} raceTokens={RACE_TOKENS} />
        <p className="hero-credit">{c.creditEngines}</p>
        <p className="hero-credit">
          {fill(c.creditLuau, { n: LUAU_COUNT })} {c.creditWasmtime}{" "}
          <Ext href={LUAU_MERGED} note={lang}>
            {c.seeThem}
          </Ext>
        </p>
        <div className="contributed hero-contributed">
          <span className="contributed-label">{c.contributedTo}</span>
          <ul>
            {CONTRIBUTED.map((p) => (
              <li key={p.name}>
                <strong>{p.name}</strong>
                {p.by && <span>{p.by}</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">{c.problemsTitle}</h2>
        <div className="areas">
          {c.areas.map((a) => (
            <article className="area" key={a.title}>
              <h3>{a.title}</h3>
              <p>{a.line}</p>
              <p className="proof">{a.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section" id="work">
        <h2 className="section-title">{c.workTitle}</h2>
        <p className="start-lead">{c.workLead}</p>

        <article className="card work-card work-lead">
          <div className="work-lead-text">
            <h3 className="card-title">MNN</h3>
            <p className="card-text">{c.mnn.text}</p>
            <Stats stats={c.mnn.stats} />
            <p className="card-more work-foot">
              <Ext href="https://github.com/alibaba/MNN/pull/5028" note={lang}>
                {c.mnn.pr}
              </Ext>
            </p>
          </div>
          <div className="work-lead-viz">
            <TokenizerBars copy={copy.bars} />
          </div>
        </article>

        <h3 className="sub-title work-sub">{c.proofsTitle}</h3>
        <ul className="proofs">
          {PROOFS.map((p, i) => (
            <li className="proof" key={p.href}>
              <div className="proof-who">
                <strong>{p.name}</strong>
                <span className="proof-links">
                  <Ext href={p.href} note={lang}>
                    {c.proofs[i].pr}
                  </Ext>
                  <Status kind={p.status}>{c.proofs[i].status}</Status>
                </span>
              </div>
              <div className="proof-what">
                <p className="proof-metric">{c.proofs[i].metric}</p>
                <p className="proof-unit">{c.proofs[i].unit}</p>
                <p className="proof-text">{c.proofs[i].text}</p>
              </div>
              <div className="proof-check">
                <span className="proof-check-label">{c.checkedLabel}</span>
                <p>{c.proofs[i].check}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="sub-title work-sub">{c.openTitle}</h3>
        <article className="card work-card work-lead">
          <div className="work-lead-text">
            <h3 className="card-title">vLLM</h3>
            <p className="card-text">{c.vllm.text}</p>
            <Stats stats={c.vllm.stats} />
            <p className="card-more work-foot">
              <Link className="flow-link" href="/writing/fp8-slower-than-bf16/" hrefLang={enOnly}>
                {c.vllm.post}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Ext href="https://github.com/vllm-project/vllm/pull/60464" note={lang}>
                {c.vllm.pr}
              </Ext>
            </p>
          </div>
          <div className="work-lead-viz">
            <ServingBars copy={copy.bars} />
          </div>
        </article>

        <p className="work-also">
          {c.llamaAlso.text}
          <span className="work-also-links">{caseLink("/work/llama-cpp/")}</span>
        </p>
        <p className="work-also">
          {c.earlier.text}
          <span className="work-also-links">{caseLink("/work/rolantir/")}</span>
        </p>
      </section>

      {POSTS.length > 0 && (
        <section className="wrap section" aria-labelledby="writing-title">
          <h2 className="section-title" id="writing-title">
            {c.writingTitle}
          </h2>
          <p className="start-lead">{c.writingLead}</p>
          <ul className="post-list home-posts">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link className="post-link" href={`/writing/${p.slug}/`} hrefLang={enOnly}>
                  <span className="post-title" lang={enOnly}>
                    {p.title}
                  </span>
                  <span className="post-summary" lang={enOnly}>
                    {p.summary}
                  </span>
                  <span className="post-meta">
                    {p.date ? `${monthYear(p.date, lang)} · ` : ""}
                    {fill(c.writingMeta, { n: p.minutes })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="card-more">
            <Link className="flow-link" href="/writing/" hrefLang={enOnly}>
              {c.writingAll}
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </section>
      )}

      <section className="wrap section" id="start">
        <h2 className="section-title">{c.startTitle}</h2>
        <p className="start-lead">{c.startLead}</p>
        <div className="phases">
          <article className="phase" aria-labelledby="phase-1">
            <div className="phase-head">
              <div className="phase-top">
                <h3 className="phase-label" id="phase-1">
                  <span className="phase-num">1</span> {c.investigation}
                </h3>
                <span className="phase-time">{c.weeks}</span>
              </div>
              <span className="price-badge">{c.introBadge}</span>
              <p className="price-now">
                <strong>{c.priceNow}</strong>
                <span>{c.priceNowUsd}</span>
              </p>
              <p className="price-was">{c.priceWas}</p>
              <p className="price-scope">{c.priceScope}</p>
            </div>
            <ol className="phase-steps">
              {c.steps.map((st) => (
                <li key={st.title}>
                  <strong>{st.title}</strong>
                  <span>{st.text}</span>
                </li>
              ))}
            </ol>
            <ul className="phase-checks" aria-label={c.includedAria}>
              {c.included.map((item) => (
                <li key={item}>
                  <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="phase-foot">
              <Link className="flow-link" href="/sample-report/" hrefLang={enOnly}>
                {c.sampleReport}
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
                  <span className="phase-num">2</span> {c.fix}
                </h3>
              </div>
              <span className="price-badge">{c.fixBadge}</span>
              <p className="price-now">
                <strong>{c.fixPrice}</strong>
                <span>{c.fixPriceFrom}</span>
              </p>
              <p className="price-was">{c.fixNote}</p>
            </div>
            <ol className="phase-steps">
              {c.fixSteps.map((st) => (
                <li key={st.title}>
                  <strong>{st.title}</strong>
                  <span>{st.text}</span>
                </li>
              ))}
            </ol>
            <div className="phase-alt">
              <p>{c.teamFixes}</p>
            </div>
            <div className="phase-foot">
              <a className="button" href="#contact">
                {c.workTogether}
                <ArrowDown size={17} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
        <p className="price-fine">{c.priceFine}</p>
        <div className="sweep">
          <h3 className="sub-title">{c.sweepTitle}</h3>
          <p className="sweep-text">{c.sweepText}</p>
          <ul className="phase-checks" aria-label={c.includedAria}>
            {c.sweepIncluded.map((item) => (
              <li key={item}>
                <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="sweep-price">{c.sweepPrice}</p>
        </div>
        <div className="safeguards">
          <h3 className="sub-title">{c.safeguardsTitle}</h3>
          <ul>
            {c.safeguards.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">{c.ossTitle}</h2>
        <div className="oss">
          <div className="oss-head">
            <Ext href={LUAU_HIGHLIGHT.href} note={lang}>
              {LUAU_HIGHLIGHT.name}
            </Ext>
            <Status kind={LUAU_HIGHLIGHT.status}>{c.highlight.status}</Status>
          </div>
          <p className="oss-metric">
            <strong>{c.highlight.metric}</strong>
            <span>{c.highlight.unit}</span>
          </p>
          <p className="oss-text">{fill(c.highlight.text, { n: LUAU_COUNT })}</p>
        </div>
        <p className="hero-credit">{c.hardening}</p>
        <details className="all-prs">
          <summary>
            <span>{fill(c.allPrs, { count: PRS.length })}</span>
            <span className="pr-mix">
              <span className="pr-mix-bar" aria-hidden="true">
                <span className="pr-mix-merged" style={{ width: `${(MERGED / PRS.length) * 100}%` }} />
              </span>
              <span className="pr-mix-text">{fill(c.prMix, { merged: MERGED, open: PRS.length - MERGED, projects: GROUPS.length })}</span>
            </span>
          </summary>
          <ul className="pr-groups">
            {GROUPS.map((g) => (
              <li key={g.repo}>
                <p className="pr-group-name">
                  <span>{g.repo}</span>
                  <span className="pr-group-count">
                    {g.merged > 0 && fill(c.groupMerged, { n: g.merged })}
                    {g.merged > 0 && g.prs.length > g.merged && ", "}
                    {g.prs.length > g.merged && fill(c.groupOpen, { n: g.prs.length - g.merged })}
                  </span>
                </p>
                <ul className="pr-all">
                  {g.prs.map((p) => (
                    <li key={p.url}>
                      <Ext href={p.url} lang={enOnly} note={lang}>
                        {withCode(p.title)}
                      </Ext>
                      <Status kind={p.state === "merged" ? "merged" : "review"}>{p.state === "merged" ? c.stateMerged : c.stateOpen}</Status>
                      <span className="pr-date">{monthOf(dateOf(p))}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="wrap section">
        <h2 className="section-title">{c.buildingTitle}</h2>
        <div className="progress-list">
          {IN_PROGRESS.map((name, i) => (
            <article className="progress" key={name}>
              <h3 className="card-title">{name}</h3>
              <p className="card-text">{c.building[i].text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section about" id="contact">
        <h2 className="section-title">{c.aboutTitle}</h2>
        <div className="about-card">
          <div className="about-who">
            <div className="about-id">
              {ABOUT_PHOTO && <img className="about-photo" src={ABOUT_PHOTO} alt="Ilyas Mallah" width={88} height={88} />}
              <h3 className="about-name">Ilyas Mallah</h3>
              <p className="about-role">{c.role}</p>
            </div>
            <p className="about-text">{c.aboutText}</p>
          </div>
          <div className="about-cta">
            <h3>{c.ctaTitle}</h3>
            <p>{c.ctaText}</p>
            <div className="contact-email">
              <a className="email" href={mailto}>
                {EMAIL}
              </a>
              <CopyButton value={EMAIL} aria={copy.copyButton.aria} text={copy.copyButton.text} copiedText={copy.copyButton.copied} />
            </div>
            <p className="about-reply">
              <ReplyHours lang={lang} copy={copy.reply} />
            </p>
            <ul className="socials">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <Ext className="social" href={s.href} aria-label={c.socialAria[s.aria]} note={lang}>
                    <SocialIcon name={s.icon} />
                    <span className="social-label">{s.name}</span>
                  </Ext>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
