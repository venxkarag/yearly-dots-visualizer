# YEAR // dots

A techy, dark-themed **yearly days visualizer**. Every dot is one day of the
year — elapsed days glow, today pulses, and the rest wait in the dark. Built
with **Next.js (App Router + TypeScript)** and ready to deploy on **Vercel**.

![every dot = one day](https://img.shields.io/badge/each_dot-one_day-00ffc8?style=flat-square&labelColor=05070a)

## Features

- **365 / 366 dots** laid out month by month as a clean matrix grid.
- **Live status** — past / today / future, computed in the visitor's local time
  (no hydration mismatch) and auto-rolls over at midnight.
- **Stats HUD** — day-of-year, % complete, elapsed, days remaining, week, and
  leap-year flag, with an animated progress bar.
- **Hover tooltip** showing the exact date for any dot.
- Zero runtime dependencies beyond React/Next — pure CSS, no UI libraries.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.

Or with the CLI:

```bash
npm i -g vercel
vercel
```

## Project structure

```
app/
  layout.tsx        Root layout + metadata
  page.tsx          Renders the visualizer
  globals.css       Dark techy theme + grid background
components/
  YearGrid.tsx      Client component: grid, stats, tooltip
  YearGrid.module.css
lib/
  year.ts           Pure date logic (status, stats, month groups)
```

## Customizing

- **Accent color / theme:** edit the CSS variables in `app/globals.css`
  (`--accent`, `--past`, `--future`, …).
- **Dots per row:** change the `repeat(31, …)` rule in
  `components/YearGrid.module.css`.
