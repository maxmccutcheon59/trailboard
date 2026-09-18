# Trailboard

[![CI](https://github.com/maxmccutcheon59/trailboard/actions/workflows/ci.yml/badge.svg)](https://github.com/maxmccutcheon59/trailboard/actions/workflows/ci.yml)

**Internship application pipeline** — a local-first Kanban board for tracking Summer internship apps (wishlist → offer).

Built by [Max McCutcheon](https://github.com/maxmccutcheon59) as a portfolio product that shows **TypeScript / React / product UX** alongside systems work ([Spindle](https://github.com/maxmccutcheon59/spindle)) and defensive tooling ([Watchwire](https://github.com/maxmccutcheon59/watchwire)).

## Why this exists

Most SWE internship resumes need more than one deep systems project. Trailboard is the “I can ship a real web product” signal: typed domain model, persistent client state, keyboard-friendly UI, import/export, and an honest README.

Not a job board. Not autofill. Your data stays in the browser (`localStorage`).

## Features

- Kanban columns: `Wishlist → Applied → OA → Phone → Onsite → Offer` (+ Rejected / Withdrawn)
- Add / edit / move cards (company, role, URL, notes, follow-up date)
- Search + status counts
- JSON export / import (backup or move machines)
- Zero backend — works offline after load

## Quick start

```bash
npm install
npm run dev -- --port 43201 --host 127.0.0.1
```

Open http://127.0.0.1:43201

```bash
npm run build
npm run test
```

## Stack

- Vite + React 19 + TypeScript
- CSS variables (no component-library lock-in)
- `localStorage` persistence with schema versioning

## Resume bullets (steal these)

- Built Trailboard, a TypeScript/React Kanban for internship tracking with local-first persistence, JSON import/export, and status analytics
- Modeled application pipeline as an explicit state machine (wishlist → offer) with searchable cards and follow-up dates

## License

MIT © Max McCutcheon
