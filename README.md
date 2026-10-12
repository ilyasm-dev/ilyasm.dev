# ilyasm.dev

Next.js site built as a static export, for GitHub Pages.

```
npm install
npm run dev     # local preview at http://localhost:3000
npm run build   # static site in out/
```

Writing drafts live in the private hub, not in this public repo. To publish a piece, copy it into
`content/writing/*.md` and rename `app/_writing/` (a private folder, not built or linked) back to `app/writing/`. `public/CNAME` and `public/.nojekyll` are copied into `out/`.

## Deploy

`npm run build` first runs `scripts/fetch-prs.mjs`, which writes `data/prs.json` from the GitHub search API (open and merged pull requests by `ilyas-mallah` and `green-real` in other people's repos). If the fetch fails, the committed snapshot is used and the build continues. `.github/workflows/deploy.yml` builds on push and daily, then deploys `out/` to GitHub Pages. It needs Settings, Pages, "Source: GitHub Actions" in the repo, which is not enabled yet. The branch it deploys from (`prototype` now) is Ilyas's decision, and the `branches` line in the workflow follows it.
