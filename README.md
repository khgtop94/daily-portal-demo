# Daily Portal — Live Demo

> **1인 풀스택으로 1개월 만에 도입한 사내 통합 업무 포털**을 익명화·일반화하여 라이브로 구현한 케이스 스터디 데모입니다.
>
> Companion to → [daily-portal-case-study](https://github.com/khgtop94/daily-portal-case-study)

[![CI](https://github.com/khgtop94/daily-portal-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/khgtop94/daily-portal-demo/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌐 Live Demo

👉 **https://daily-portal-demo.vercel.app** (배포 후 URL로 업데이트 예정)

체험 계정 — 로그인 화면에서 클릭만 하면 됨:

| 세션 | 역할 예시 | 가시 기능 |
|---|---|---|
| **HQ (본사)** | admin / support / operations / executive / safety / staff | 결재·자재·회의·이슈·출퇴근·사용자·사이트·감사 로그 |
| **Worker (도급)** | 도급근무자 A~D | 작업일지·출퇴근·내 영수증 |
| **Client (발주처)** | ACME / 북부물류 / 남부IDC 담당자 | 권한 부여된 사이트만 조회 |

---

## 🎯 What this demonstrates

이 데모는 **케이스 스터디 문서에서 설명한 패턴들이 실제로 작동하는지** 직접 확인할 수 있는 라이브 자산입니다.

### 핵심 설계 시연

1. **3-tier 세션 분리** — 본사/도급/발주처 쿠키 독립 발급 (개발자 도구 → Cookies 로 확인 가능)
2. **8단계 권한 매트릭스** — 역할 클릭 시 capability 하이라이트, 수직(관리) + 수평(직무) 하이브리드
3. **결재 5단계 상태 머신** — `draft → submitted → ops → client → hq`, 실제 승인/반려 액션 작동
4. **감사 로그 자동 기록** — 결재 액션 후 즉시 `/hq/audit-log` 에 새 행 추가 (server actions + revalidate)
5. **EXIF 위변조 검증 시뮬** — `/hq/receipts/r-004` 에서 GPS 누락 사진의 안전관리자 라우팅 확인
6. **GPS 출퇴근** — 좌표 검증, 지각·조퇴 자동 플래그
7. **권한별 액션 가시성** — staff 로그인 시 결재 버튼 사라짐, operations 전환하면 나타남

### 도메인 깊이 (일반 portfolio 와 다른 점)

- 안전관리자(safety)를 별도 역할로 모델링 — FM 도메인 법정 직무
- 작업일지 사진 EXIF 검증 — 법정 점검 입증 자료의 위변조 방지
- 결재 흐름 unique constraint `(site_id, year_month)` — 같은 월 영수증 중복 결재 차단
- 회의록 안건별 결정 분리 — "회의했지만 뭘 결정했는지 모름" 사후 분쟁 방지

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **State (demo)**: In-memory mock data (production 시스템은 Supabase + PostgreSQL + RLS)
- **Auth (demo)**: Cookie-based session mock (production 은 Supabase Auth)
- **Testing**: Vitest (22 tests, covers permissions / format / mock data integrity)
- **CI**: GitHub Actions (typecheck + test + build on push/PR)
- **Deployment**: Vercel

---

## 📁 Structure

```
src/
├── app/
│   ├── page.tsx                 # 랜딩 (Feature 카드 9개)
│   ├── login/                   # 3-tier 탭 로그인
│   ├── architecture/            # 아키텍처 8 섹션 (RLS, 세션, capability, state machine, ERD, EXIF, migration, audit)
│   ├── hq/                      # 본사 (11개 페이지)
│   │   ├── page.tsx             # 대시보드
│   │   ├── receipts/            # 영수증 결재 (필터·검색·승인/반려)
│   │   ├── materials/           # 자재 요청 결재
│   │   ├── meetings/            # 회의록
│   │   ├── issues/              # 일일 이슈
│   │   ├── attendance/          # 출퇴근 조회
│   │   ├── users/               # 사용자 관리 (3-tier 필터)
│   │   ├── sites/               # 사이트 관리
│   │   ├── permissions/         # 권한 매트릭스 (인터랙티브)
│   │   ├── notifications/       # 알림 (읽음 처리)
│   │   └── audit-log/           # 감사 로그
│   ├── worker/                  # 도급 (5개 페이지)
│   └── client/                  # 발주처 (1개 페이지)
├── components/
│   ├── NavBar.tsx
│   ├── Footer.tsx
│   ├── ApprovalChain.tsx        # 결재 상태 머신 시각화
│   ├── Icon.tsx                 # 인라인 SVG 아이콘
│   ├── EmptyState.tsx
│   ├── PageHeader.tsx
│   └── StatCard.tsx
└── lib/
    ├── types.ts                 # 도메인 타입 정의
    ├── permissions.ts           # Capability 집합 (8 역할 × 12 capability)
    ├── session.ts               # 3-tier 쿠키 세션 detect
    ├── mock-data.ts             # in-memory 가상 데이터
    └── format.ts                # KRW, 날짜, 상태 라벨/색상
```

---

## 🚀 Run locally

```bash
git clone https://github.com/khgtop94/daily-portal-demo.git
cd daily-portal-demo
npm install
npm run dev
# → http://localhost:3000
```

## ✅ Run tests

```bash
npm test              # 단발 실행
npm run test:watch    # watch 모드
npm run test:coverage # 커버리지 리포트
```

## 🚢 Deploy to Vercel

1. Push to GitHub
2. vercel.com → New Project → Import this repo
3. 환경변수 추가 없이 그대로 Deploy

---

## ⚠️ Disclaimer

본 데모는 **익명화된 가상 시스템**입니다.

- 실제 회사의 코드·고객사·근무자·재무 데이터를 일체 포함하지 않습니다
- 회사명, 사이트명, 인물명, 좌표, 금액 모두 가상입니다
- 실 운영 코드는 사내 자산이며 별도 보관

본 저장소는 **케이스 스터디 + 포트폴리오** 목적입니다. 실제 운영 시스템(`daiduckportal`)의 패턴을 일반화하여 보여주는 데모로, 운영 시스템 자체의 복제가 아닙니다.

---

## About the builder

**김한결 (Han-Gyeol Kim)** · FM 도메인 풀스택 개발자 · 전기기사 5년차

- 실제 사내 시스템 단독 설계·구현·운영 중 (Next.js 16 + Supabase, 약 5만 라인)
- 모트라스 11공장 / 25명 / 월 42시간 관리 공수 절감
- ADR 3건 + RUNBOOK 거버넌스 문서 작성
- AI 보조 개발 워크플로우 정립 (Claude Code / Codex)

📘 Case study: https://github.com/khgtop94/daily-portal-case-study

---

## License

MIT — see LICENSE file.
