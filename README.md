# ilyasm.dev

Next.js site built as a static export, for GitHub Pages.

```
npm install
npm run dev     # local preview at http://localhost:3000
npm run build   # static site in out/
```

Writing drafts live in the private hub, not in this public repo. To publish a piece, copy it into
`content/writing/*.md` and rename `app/_writing/` (a private folder, not built or linked) back to `app/writing/`. `public/CNAME` and `public/.nojekyll` are copied into `out/`.
