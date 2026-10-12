// Writes data/prs.json from the GitHub search API. Merged means merged into the repo's default branch. On any failure the committed snapshot stays and the build goes on.
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

// A PR merged into a feature branch is not accepted upstream, so it is dropped.
const defaultBranches = new Map();
async function mergedIntoDefault(pr) {
  if (!defaultBranches.has(pr.repo)) {
    defaultBranches.set(pr.repo, (await gh(`https://api.github.com/repos/${pr.repo}`)).default_branch);
  }
  const base = (await gh(`https://api.github.com/repos/${pr.repo}/pulls/${pr.number}`)).base.ref;
  return base === defaultBranches.get(pr.repo);
}

function convert({ login, i }) {
  const repo = i.repository_url.replace("https://api.github.com/repos/", "");
  const merged = Boolean(i.pull_request?.merged_at);
  if (EXCLUDED_OWNERS.has(repo.split("/")[0])) return null;
  if (i.state === "closed" && !merged) return null;
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
  };
}

try {
  const all = (await Promise.all(LOGINS.map(fetchLogin))).flat();
  const converted = all.map(convert).filter(Boolean);
  const prs = [];
  for (const pr of converted) {
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
