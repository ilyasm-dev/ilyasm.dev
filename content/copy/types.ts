import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

// All text of the pages that exist in both languages. Structure, links and figures from data live in the shared
// components, so the two languages cannot drift apart in layout. Strings with {name} are filled in by the component.

type Step = { title: string; text: string };
export type Stat = { value: ReactNode; sub: string };

// Plain strings only: the showcase is a client component and gets this as a prop.
export type ShowcaseCopy = {
  aria: string;
  tabsAria: string;
  tabs: [ShowcaseTab, ShowcaseTab, ShowcaseTab];
  newTab: string;
  slowMotion: string;
  replay: string;
  replayAria: string;
  before: string;
  after: string;
  doneIn: string;
  seconds: string;
  chatQuestion: string;
  chatAnswer: string;
  chatLabel: string;
  servingLabel: string;
  chartLabel: string;
  chartDays: string[];
  chartQuerying: string;
  chartExample: string;
};

export type ShowcaseTab = { figureShort: string; topic: string; figure: string; meaning: string; measured: string; source: string };

export type ReplyCopy = {
  text: string;
  zoneFallback: string;
  yours: string;
};

export type Copy = {
  lang: Lang;
  locale: string;
  site: {
    title: string;
    description: string;
    ogAlt: string;
    ogImage: string;
    skip: string;
    nav: { start: string; work: string; contact: string };
    theme: string;
    switchTo: { label: string; name: string; lang: Lang };
    // The bar on the other language's page that offers this language. Written in this language.
    offer: { region: string; text: string; go: string; close: string };
    privacy: string;
    earlier: string;
    cv: string;
    writing: string;
    email: string;
  };
  copyButton: { text: string; copied: string; aria: string };
  reply: ReplyCopy;
  showcase: ShowcaseCopy;
  bars: {
    before: string;
    after: string;
    chartRange: [string, string];
    chartCaption: string;
    chartLabel: string;
    decodeCaption: string;
    decodeLabel: string;
    vllm: BarSet;
    tokenizer: BarSet;
  };
  home: {
    eyebrow: string;
    title: [string, string];
    lede: string;
    contact: string;
    howItWorks: string;
    available: string;
    creditEngines: ReactNode;
    creditLuau: string;
    seeThem: string;
    creditWasmtime: ReactNode;
    problemsTitle: string;
    areas: [Area, Area, Area, Area];
    startTitle: string;
    startLead: ReactNode;
    investigation: string;
    weeks: string;
    introBadge: string;
    priceNow: string;
    priceNowUsd: string;
    priceWas: string;
    priceScope: string;
    steps: [Step, Step, Step];
    includedAria: string;
    included: [string, string, string, string, string];
    sampleReport: string;
    fix: string;
    fixBadge: string;
    fixPrice: string;
    fixPriceFrom: string;
    fixNote: string;
    fixSteps: [Step, Step, Step];
    teamFixes: ReactNode;
    workTogether: string;
    priceFine: string;
    // The hardening sweep: a second offer at the investigation's price, so it has no price card of its own.
    sweepTitle: string;
    sweepText: string;
    sweepIncluded: [string, string, string];
    sweepPrice: string;
    safeguardsTitle: string;
    safeguards: [string, string, string, string, string];
    workTitle: string;
    workLead: string;
    readCase: string;
    mnn: { text: string; stats: [Stat, Stat]; pr: string };
    // Merged fixes without a speedup figure: what was wrong, what changed, how it was checked.
    proofsTitle: string;
    checkedLabel: string;
    proofs: [Proof, Proof, Proof, Proof, Proof];
    // One open pull request, with measurements.
    openTitle: string;
    vllm: { text: string; stats: [Stat, Stat]; pr: string; post: string };
    // Two quiet lines under the work: llama.cpp work in review, and earlier work that is not on GitHub.
    llamaAlso: { text: string };
    earlier: { text: string };
    // Posts are English only. {n} is the reading time in minutes.
    writingTitle: string;
    writingLead: string;
    writingMeta: string;
    writingAll: string;
    ossTitle: string;
    contributedTo: string;
    highlight: Highlight;
    hardening: string;
    allPrs: string;
    prMix: string;
    groupMerged: string;
    groupOpen: string;
    stateMerged: string;
    stateOpen: string;
    months: string[];
    aboutTitle: string;
    role: string;
    aboutText: ReactNode;
    ctaTitle: string;
    ctaText: ReactNode;
    mailSubject: string;
    socialAria: { linkedin: string; github: string; x: string; discord: string };
    buildingTitle: string;
    building: [Building, Building, Building];
  };
  privacy: {
    title: string;
    description: string;
    back: string;
    lede: ReactNode;
    sections: { title: string; paragraphs: ReactNode[] }[];
  };
};

type Area = { title: string; line: string; proof: string };
// The two value texts of a before and after chart, with its caption and its screen reader label.
type BarSet = { range: [string, string]; caption: string; label: string };
type Proof = { status: string; pr: string; metric: ReactNode; unit: string; text: string; check: string };
type Highlight = { status: string; metric: ReactNode; unit: string; text: string };
type Building = { text: string };
