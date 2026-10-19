import {
  Archive,
  ArrowDown,
  Award,
  ArrowRight,
  Braces,
  Brain,
  Check,
  Code,
  Cpu,
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
  Timer,
  Users,
  Wrench,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ChartQueryBars, DecodeBars } from "@/components/BeforeAfterBars";
import CopyButton from "@/components/CopyButton";
import Ext from "@/components/ExternalLink";
import { BillClimb, DatabaseMove, GaugeHalf, ShieldInput } from "@/components/Illustrations";
import { Mark, Status, type StatusKind } from "@/components/Marks";
import ReplyHours from "@/components/ReplyHours";
import Showcase from "@/components/Showcase";
import SocialIcon, { type IconName } from "@/components/SocialIcons";
import { COPY } from "@/content/copy";
import prsData from "@/data/prs.json";
import { fill, type Lang } from "@/lib/i18n";
import { allPosts, monthYear } from "@/lib/posts";
import { tokenize } from "@/lib/race";

// The home page in either language. All text comes from content/copy. Links, icons and figures from data stay here,
// so both languages share them.

const ICON = { size: 20, strokeWidth: 1.75, "aria-hidden": true } as const;

const SOCIALS: { name: string; href: string; aria: "linkedin" | "github" | "x" | "discord"; icon: IconName }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ilyas-mallah", aria: "linkedin", icon: "linkedin" },
  { name: "GitHub", href: "https://github.com/ilyas-mallah", aria: "github", icon: "github" },
  { name: "X", href: "https://x.com/ilyasmdev", aria: "x", icon: "x" },
  { name: "Discord", href: "https://discord.com/users/1557401037042618432", aria: "discord", icon: "discord" },
];

// Path of a square photo in public/, such as "/ilyas.jpg". Until it's set, the IM monogram is the avatar.
const ABOUT_PHOTO: string | null = null;

const EMAIL = "hello@ilyasm.dev";

const SAFEGUARD_ICONS: LucideIcon[] = [FileSignature, Eye, Lock, GitPullRequest, PackageCheck];

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

const AREA_ART = [GaugeHalf, DatabaseMove, BillClimb, ShieldInput];

// Highlights are from the hub's contributions/README.md. The full list is data/prs.json, written at build time by scripts/fetch-prs.mjs.
// The advisory is shown at the level of its public page only: the credit and the fixed versions.
const HIGHLIGHTS: { name: string; icon: LucideIcon; href: string; status: StatusKind }[] = [
  { name: "vLLM", icon: Server, href: "https://github.com/vllm-project/vllm/pull/60464", status: "review" },
  { name: "Wasmtime", icon: Award, href: "https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-mghf-wjfp-p5xm", status: "done" },
  { name: "Wasmtime", icon: Cpu, href: "https://github.com/bytecodealliance/wasmtime/pull/14778", status: "merged" },
  { name: "wabt", icon: ShieldCheck, href: "https://github.com/WebAssembly/wabt/pull/2874", status: "merged" },
];

type Pr = { repo: string; number: number; title: string; url: string; state: "open" | "merged"; createdAt: string; mergedAt: string | null; author: string };
const PRS = prsData as Pr[];
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

// Merged, from the hub's contributions/README.md. The ns figures for #2571 are in projects/luau/README.md and assets/cv.md.
const LUAU_PRS: { label: string; href: string }[] = [
  { label: "#2987", href: "https://github.com/luau-lang/luau/pull/2987" },
  { label: "#2571", href: "https://github.com/luau-lang/luau/pull/2571" },
  { label: "#2683", href: "https://github.com/luau-lang/luau/pull/2683" },
  { label: "#2648", href: "https://github.com/luau-lang/luau/pull/2648" },
];

const LUAU_MERGED = "https://github.com/luau-lang/luau/pulls?q=is%3Apr+author%3Agreen-real+is%3Amerged";

const IN_PROGRESS: { name: string; icon: LucideIcon; kind: StatusKind }[] = [
  { name: "Ulana", icon: FileCode, kind: "dev" },
  { name: "Ganglion", icon: Brain, kind: "dev" },
  { name: "infdoc", icon: Stethoscope, kind: "dev" },
];

// Published posts, newest first. They are English, so the Dutch page marks them as such.
const POSTS = allPosts();

// The chat race runs on the English answer's length in every language, so the measured seconds stay the same.
const RACE_TOKENS = tokenize(COPY.en.showcase.chatAnswer).length;

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
          <span className="grad">{c.title[1]}</span>
        </h1>
        <p className="lede">{c.lede}</p>
        <div className="cta-row">
          <a className="button" href="#contact">
            <Mail {...ICON} size={17} />
            {c.contact}
          </a>
          <a className="button button-quiet" href="#start">
            {c.howItWorks}
          </a>
          <span className="cta-note">{c.available}</span>
        </div>
        <Showcase copy={copy.showcase} lang={lang} raceTokens={RACE_TOKENS} />
        <p className="hero-credit">
          <Wrench size={16} strokeWidth={2} aria-hidden="true" />
          <span>{c.creditEngines}</span>
        </p>
        <p className="hero-credit">
          <GitMerge size={16} strokeWidth={2} aria-hidden="true" />
          <span>
            {c.creditLuau} {c.creditWasmtime}{" "}
            <Ext href={LUAU_MERGED} note={lang}>
              {c.seeThem}
            </Ext>
          </span>
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
          {c.areas.map((a, i) => {
            const Art = AREA_ART[i];
            return (
              <article className="area" key={a.title}>
                <span className="area-art">
                  <Art />
                </span>
                <h3>{a.title}</h3>
                <p>{a.line}</p>
                <p className="proof">{a.proof}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="wrap section" id="work">
        <h2 className="section-title">{c.workTitle}</h2>

        <div className="work-grid">
          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Database} />
              <div className="card-head-text">
                <h3 className="card-title">Rolantir</h3>
              </div>
              <Status kind="done">{c.rolantir.status}</Status>
            </div>
            <p className="card-text">{c.rolantir.text}</p>
            <div className="stats">
              <div>
                <Timer size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>{c.rolantir.stats[0].value}</strong>
                <span>{c.rolantir.stats[0].sub}</span>
              </div>
              <div>
                <Archive size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>{c.rolantir.stats[1].value}</strong>
                <span>{c.rolantir.stats[1].sub}</span>
              </div>
            </div>
            <ChartQueryBars copy={copy.bars} />
            <p className="card-more work-foot">
              {caseLink("/work/rolantir/")}
              <Ext href="https://rolantir.dev" note={lang}>
                rolantir.dev (beta)
              </Ext>
            </p>
          </article>

          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Gpu} />
              <div className="card-head-text">
                <h3 className="card-title">llama.cpp</h3>
              </div>
              <Status kind="review">{c.llama.status}</Status>
            </div>
            <p className="card-text">{c.llama.text}</p>
            <div className="stats">
              <div>
                <Gauge size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>{c.llama.stats[0].value}</strong>
                <span>{c.llama.stats[0].sub}</span>
              </div>
              <div>
                <Code size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>{c.llama.stats[1].value}</strong>
                <span>{c.llama.stats[1].sub}</span>
              </div>
            </div>
            <DecodeBars copy={copy.bars} lang={lang} />
            <p className="card-more work-foot">
              {caseLink("/work/llama-cpp/")}
              <Ext href="https://github.com/ggml-org/llama.cpp/pull/30077" note={lang}>
                {c.llama.pr}
              </Ext>
            </p>
          </article>

          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Braces} />
              <div className="card-head-text">
                <h3 className="card-title">{c.luau.title}</h3>
              </div>
              <Status kind="merged">{c.luau.status}</Status>
            </div>
            <p className="card-text">{c.luau.text}</p>
            <ul className="pr-list">
              {LUAU_PRS.map((l, i) => (
                <li key={l.href}>
                  <Ext href={l.href} note={lang}>
                    <GitMerge size={14} strokeWidth={2} aria-hidden="true" />
                    {l.label}
                  </Ext>
                  <span>{c.luau.prs[i]}</span>
                </li>
              ))}
            </ul>
            <p className="card-more work-foot">
              <Ext href={LUAU_MERGED} note={lang}>
                {c.luau.all}
              </Ext>
            </p>
          </article>

          <article className="card work-card">
            <div className="card-head">
              <Mark icon={Gamepad2} />
              <div className="card-head-text">
                <h3 className="card-title">Dig It</h3>
              </div>
              <Status kind="done">{c.digIt.status}</Status>
            </div>
            <p className="card-text">{c.digIt.text}</p>
            <div className="stats">
              <div>
                <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>{c.digIt.stats[0].value}</strong>
                <span>{c.digIt.stats[0].sub}</span>
              </div>
              <div>
                <Users size={18} strokeWidth={1.75} aria-hidden="true" />
                <strong>{c.digIt.stats[1].value}</strong>
                <span>{c.digIt.stats[1].sub}</span>
              </div>
            </div>
            <p className="card-more work-foot">
              <Ext href="https://www.roblox.com/games/76455837887178" note={lang}>
                {c.digIt.game}
              </Ext>
              <Ext href="https://www.rotrends.com/game/6705549208" note={lang}>
                {c.digIt.history}
              </Ext>
            </p>
          </article>
        </div>
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
                <span className="phase-time">
                  <Timer size={15} strokeWidth={2} aria-hidden="true" />
                  {c.weeks}
                </span>
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
                <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
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
              <p>
                <Users size={16} strokeWidth={2} aria-hidden="true" />
                <span>{c.teamFixes}</span>
              </p>
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
          <p className="sweep-price">
            <Timer size={15} strokeWidth={2} aria-hidden="true" />
            {c.sweepPrice}
          </p>
        </div>
        <div className="safeguards">
          <h3 className="sub-title">{c.safeguardsTitle}</h3>
          <ul>
            {c.safeguards.map((text, i) => {
              const Icon = SAFEGUARD_ICONS[i];
              return (
                <li key={text}>
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">{c.ossTitle}</h2>
        <ul className="highlights">
          {HIGHLIGHTS.map((h, i) => (
            <li className="oss" key={h.href}>
              <div className="oss-head">
                <Mark icon={h.icon} />
                <div>
                  <Ext href={h.href} note={lang}>
                    {h.name}
                  </Ext>
                  <Status kind={h.status}>{c.highlights[i].status}</Status>
                </div>
              </div>
              <p className="oss-metric">
                <strong>{c.highlights[i].metric}</strong>
                <span>{c.highlights[i].unit}</span>
              </p>
              <p className="oss-text">{c.highlights[i].text}</p>
            </li>
          ))}
        </ul>
        <p className="hero-credit">
          <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
          <span>{c.hardening}</span>
        </p>
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
          {IN_PROGRESS.map((p, i) => (
            <article className="progress" key={p.name}>
              <div className="card-head">
                <Mark icon={p.icon} />
                <span className="card-title">{p.name}</span>
                <Status kind={p.kind}>{c.building[i].tag}</Status>
              </div>
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
              {ABOUT_PHOTO ? (
                <img className="about-mark about-photo" src={ABOUT_PHOTO} alt="Ilyas Mallah" width={88} height={88} />
              ) : (
                <span className="about-mark" aria-hidden="true">
                  IM
                </span>
              )}
              <h3 className="about-name">Ilyas Mallah</h3>
              <p className="about-role">{c.role}</p>
            </div>
            <p className="about-text">{c.aboutText}</p>
          </div>
          <div className="about-cta">
            <h3>{c.ctaTitle}</h3>
            <p>{c.ctaText}</p>
            <div className="contact-email">
              <Mail className="email-icon" size={22} strokeWidth={1.75} aria-hidden="true" />
              <a className="email" href={mailto}>
                {EMAIL}
              </a>
              <CopyButton value={EMAIL} aria={copy.copyButton.aria} text={copy.copyButton.text} copiedText={copy.copyButton.copied} />
            </div>
            <p className="about-reply">
              <span className="about-reply-dot" aria-hidden="true" />
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
