# RO Emergencies On Call

An interactive, local-first web app for walking through common radiation oncology on-call emergencies using branching algorithms derived from the provided ARRO/ROCK teaching materials.

## Features

- Click-through emergency algorithms for CNS, thoracic, bleeding, and GI scenarios
- Decision-tree flow that updates recommendations as users branch through a case
- Quick-reference sections for triage, workup, consults, temporizing measures, and RT considerations
- Bundled algorithm figures in `public/figures/` with in-app modal viewing
- Searchable home screen and shareable routes
- Local development with Vite
- Static deployment support for GitHub Pages
- Optional deployment support for Vercel

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

## Production build

```bash
npm run build
npm run preview
```

## Deploy

### GitHub Pages

This repo includes a GitHub Actions workflow that builds the static site and deploys `dist/` to GitHub Pages.

1. Push the repository to GitHub.
2. In repository settings, enable GitHub Pages with GitHub Actions as the source.
3. If the site is hosted under a subpath, set `VITE_BASE_PATH` in the workflow or repository variables if needed.

### Vercel

This repo also includes a `vercel.json` for simple static deployment.

1. Import the repo into Vercel.
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`

## Source basis

The current interactive pathways are aligned to the bundled PNG algorithms while preserving citation text from the original teaching materials on each page.

## Important note

This app is an educational decision-support aid, not a substitute for attending review, institutional policy, multidisciplinary consultation, or clinical judgment.
