# ilyasm.dev

Next.js site built as a static export, for GitHub Pages.

```
npm install
npm run dev     # local preview at http://localhost:3000
npm run build   # static site in out/
```

Writing drafts live in `content/writing/*.md`. Their routes are parked in `app/_writing/` (a private folder, not
built or linked). Rename it back to `app/writing/` to publish them. `public/CNAME` and `public/.nojekyll` are copied into `out/`.
