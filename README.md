# Daily Portal — Live Demo

> Anonymized live demo of a 1-person full-stack enterprise portal.
> Companion to [daily-portal-case-study](https://github.com/khgtop94/daily-portal-case-study).

**Live**: (Vercel URL goes here after deployment)

## What this demonstrates

- **3-tier session separation** (HQ / Worker / Client) with three independent cookies
- **8-step permission model** (vertical system roles + horizontal job roles)
- **Capability-based permission checks** (no hierarchy inference)
- **Approval state machine** with audit log
- **Clean App Router + Server Action** patterns (Next.js 16)

## Stack

- Next.js 16 (App Router)
- React 18
- Tailwind CSS 3
- TypeScript 5
- **In-memory mock data** — no real DB, no real auth, all data anonymized

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

```bash
# 1. Push to GitHub (private or public)
git remote add origin https://github.com/<you>/daily-portal-demo.git
git push -u origin main

# 2. Import on vercel.com — Vercel auto-detects Next.js, no env vars needed
```

## Disclaimer

This demo is **anonymized and fictional**. It does not contain real company code,
real customer names, real worker data, or any production credentials. It exists
solely as a portfolio/case-study artifact.

The patterns shown here mirror — but are not — the patterns used in the real
`daiduckportal` system, which is an internal company asset.

## License

MIT — see LICENSE file.

## About the builder

**김한결 (Han-Gyeol Kim)** · FM 도메인 풀스택 개발자 · 전기기사 5년차

- Case study: https://github.com/khgtop94/daily-portal-case-study
- Resume: available on request
