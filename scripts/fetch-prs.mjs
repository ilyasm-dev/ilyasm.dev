// Writes data/prs.json from the GitHub search API. Merged means merged into the repo's default branch, or closed by a landing bot (Copybara) with a commit on it. On any failure the committed snapshot stays and the build goes on.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LOGINS = ["ilyas-mallah", "green-real"];
const EXCLUDED_OWNERS = new Set(["ilyas-mallah", "ilyasm-dev", "green-real"]);
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "data", "prs.json");

const HEADERS = { Accept: "application/vnd.github+json", "User-Agent": "ilyasm-dev-build" };
let token = process.env.GITHUB_TOKEN;

async function gh(url) {
  const withAuth = () => (token ? { ...HEADERS, Authorization: `Bearer ${token}` } : HEADERS);
  let res = await fetch(url, { headers: withAuth(), signal: AbortSignal.timeout(20000) });
  if (res.status === 401 && token) {
    token = undefined; // a bad token must not block public data
    res = await fetch(url, { headers: withAuth(), signal: AbortSignal.timeout(20000) });
  }
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function fetchLogin(login) {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const q = encodeURIComponent(`is:pr author:${login}`);
    const body = await gh(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}`);
    items.push(...body.items);
    if (body.items.length < 100) break;
  }
  return items.map((i) => ({ login, i }));
}

const defaultBranches = new Map();
async function defaultBranch(repo) {
  if (!defaultBranches.has(repo)) {
    defaultBranches.set(repo, (await gh(`https://api.github.com/repos/${repo}`)).default_branch);
  }
  return defaultBranches.get(repo);
}

// A PR merged into a feature branch is not accepted upstream, so it is dropped.
async function mergedIntoDefault(pr) {
  const base = (await gh(`https://api.github.com/repos/${pr.repo}/pulls/${pr.number}`)).base.ref;
  return base === (await defaultBranch(pr.repo));
}

// Copybara and similar bots land a change as their own commit and close the PR, so GitHub shows closed with no merged_at.
const LANDING_BOTS = new Set(["copybara-service[bot]"]);
const MAX_LANDING_CHECKS = 60;

// The closing date when a landing bot closed the PR with a commit that is on the default branch, else null.
async function landedByBot(pr) {
  const events = [];
  for (let page = 1; page <= 5; page++) {
    const body = await gh(`https://api.github.com/repos/${pr.repo}/issues/${pr.number}/events?per_page=100&page=${page}`);
    events.push(...body);
    if (body.length < 100) break;
  }
  const closed = events.filter((e) => e.event === "closed").at(-1);
  if (!closed?.commit_id || !LANDING_BOTS.has(closed.actor?.login)) return null;
  const branch = await defaultBranch(pr.repo);
  const cmp = await gh(`https://api.github.com/repos/${pr.repo}/compare/${branch}...${closed.commit_id}?per_page=1`);
  return cmp.status === "identical" || cmp.status === "behind" ? closed.created_at.slice(0, 10) : null;
}

function convert({ login, i }) {
  const repo = i.repository_url.replace("https://api.github.com/repos/", "");
  const merged = Boolean(i.pull_request?.merged_at);
  if (EXCLUDED_OWNERS.has(repo.split("/")[0])) return null;
  if (repo === "rce-incorporated/Fiu" && i.created_at < "2025") return null;
  return {
    repo,
    number: i.number,
    title: i.title,
    url: i.html_url,
    state: merged ? "merged" : "open",
    createdAt: i.created_at.slice(0, 10),
    mergedAt: merged ? i.pull_request.merged_at.slice(0, 10) : null,
    author: login,
    closedUnmerged: i.state === "closed" && !merged ? i.closed_at : null,
  };
}

// Closed PRs without merged_at stay dropped unless a landing bot closed them. Newest first, capped, and an API error
// throws so the committed snapshot stays.
async function resolveClosed(closed) {
  closed.sort((a, b) => b.closedUnmerged.localeCompare(a.closedUnmerged));
  const landed = [];
  for (const pr of closed.slice(0, MAX_LANDING_CHECKS)) {
    const mergedAt = await landedByBot(pr);
    if (mergedAt) landed.push({ ...pr, state: "merged", mergedAt });
  }
  if (closed.length > MAX_LANDING_CHECKS) {
    console.warn(`fetch-prs: ${closed.length - MAX_LANDING_CHECKS} older closed pull requests not checked for a landing bot`);
  }
  return landed;
}

try {
  const all = (await Promise.all(LOGINS.map(fetchLogin))).flat();
  const converted = all.map(convert).filter(Boolean);
  const candidates = [...converted.filter((pr) => !pr.closedUnmerged), ...(await resolveClosed(converted.filter((pr) => pr.closedUnmerged)))];
  const prs = [];
  for (const { closedUnmerged, ...pr } of candidates) {
    if (pr.state !== "merged" || (await mergedIntoDefault(pr))) prs.push(pr);
  }
  prs.sort((a, b) => (b.mergedAt ?? b.createdAt).localeCompare(a.mergedAt ?? a.createdAt) || b.number - a.number);
  if (prs.length === 0) throw new Error("no pull requests returned");
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(prs, null, 2) + "\n");
  console.log(`fetch-prs: wrote ${prs.length} pull requests`);
} catch (err) {
  let kept = "no snapshot";
  try {
    kept = `${JSON.parse(await readFile(OUT, "utf8")).length} pull requests in the committed snapshot`;
  } catch {}
  console.warn(`fetch-prs: fetch failed (${err.message}). Keeping ${kept}.`);
}
