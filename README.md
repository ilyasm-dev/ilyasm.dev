# ilyasm.dev

Next.js site built as a static export, for GitHub Pages.

```
npm install
npm run dev     # local preview at http://localhost:3000
npm run build   # static site in out/
```

`public/CNAME` and `public/.nojekyll` are copied into `out/`.

## Writing

Drafts live in the private hub, never in this repo. A published post is `content/writing/<slug>.md` with its images in
`public/writing/media/`. It may start with front matter (`date: 2026-10-08`, `summary: ...` between two `---` lines).
`/writing/` lists the posts and the sample report. The footer links to it and the sitemap lists it once a post exists.

To check a draft locally, copy it into `content/drafts/` and its images into `public/draft-media/` (both ignored by
git), then run `PREVIEW_DRAFTS=1 npm run build`. Drafts get a draft label and `noindex`, and a normal build leaves
them out. Delete the copies afterwards.

## CV

`/cv/` is the page for hiring readers, and the CV PDF links to it. `public/Ilyas-Mallah-CV.pdf` is a copy of the
hub's `assets/Ilyas-Mallah-CV.pdf`. Refresh it when the CV changes.

## Languages

English pages live in `app/(en)/`, Dutch ones in `app/(nl)/nl/`. Each group has its own root layout, so every page gets the right `html lang`, and `app/global-not-found.tsx` is the one 404. The home and privacy pages are shared components (`components/HomePage.tsx`, `components/PrivacyPage.tsx`) that take their text from `content/copy/en.tsx` or `content/copy/nl.tsx`. `lib/i18n.ts` lists the pages that exist in both languages, which drives the language switch, the hreflang links and the sitemap. Every other page is English only.

## Deploy

`npm run build` first runs `scripts/fetch-prs.mjs`, which writes `data/prs.json` from the GitHub search API (open and merged pull requests by `ilyas-mallah` and `green-real` in other people's repos). If the fetch fails, the committed snapshot is used and the build continues. `.github/workflows/deploy.yml` builds on every push to `main` and daily, then deploys `out/` to GitHub Pages (Settings, Pages, "Source: GitHub Actions").
