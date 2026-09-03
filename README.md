# StackCircuit365 Website

Marketing site for StackCircuit365, hosted at stackcircuit.dev.
Built with Next.js (App Router), TypeScript, and Tailwind CSS.
Statically exported for GitHub Pages.

Repo: https://github.com/codehost-commit/stackcircuit365

## Develop

    npm install
    npm run dev

Open http://localhost:3000

## Pages

- `/`                Home (hero, countdown, audience split, recovery modes, incident demo, scope, safety, free-forever)
- `/for-developers`  Technical walkthrough ("Under the hood")
- `/for-beginners`   Plain-language walkthrough ("The simple version")
- `/about`           About the product and the two founders
- `/legal`           Terms, Privacy, Attributions (one page, anchored)

## Founder photos

Drop the two founder images into `public/founders/`:

- `public/founders/founder-1.jpeg`  ->  Rahul Awasthi (Lead Developer and Architect)
- `public/founders/founder-2.jpeg`  ->  Pritam Avuthu (Lead Product Designer)

Portrait orientation looks best (about 4:5, for example 520 x 650). Placeholder
files are committed so the layout renders; replace them with the real photos.

## Build (static export)

    npm run build

This writes a fully static site to `out/`. `next.config.mjs` sets
`output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`.
`public/CNAME` (stackcircuit.dev) and `public/.nojekyll` are copied into `out/`
so GitHub Pages serves the custom domain and does not strip the `_next` folder.

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to
`main`. One-time setup in the GitHub repo:

1. Settings -> Pages -> Build and deployment -> Source: "GitHub Actions".
2. Push to `main`. The workflow builds `out/` and publishes it.
3. Settings -> Pages -> Custom domain: enter `stackcircuit.dev` (the CNAME file
   already sets this). Point your DNS at GitHub Pages, then enable HTTPS.

The same `out/` folder also deploys to Vercel or any static host.
