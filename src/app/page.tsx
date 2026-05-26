import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Hero */}
      <section className="text-center mb-16">
        <p className="text-sm font-medium text-brand-600 mb-3">
          1인 풀스택 사내 통합 포털 · Live Demo
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
          Daily Portal
          <span className="block text-2xl sm:text-3xl text-slate-500 font-medium mt-2">
            FM 도메인 풀스택 케이스 스터디
          </span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          실제 사내에서 1인이 1개월 만에 도입·운영 중인 통합 업무 포털을
          익명화·일반화하여 라이브로 구현한 데모입니다.
          <br />
          3-tier 세션, 8단계 권한 모델, 결재 흐름 상태 머신을 직접 클릭해 볼 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="btn-primary text-base px-5 py-2.5">
            🚀 데모 체험 시작
          </Link>
          <a
            href="https://github.com/khgtop94/daily-portal-case-study"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-base px-5 py-2.5"
          >
            📘 케이스 스터디 보기 ↗
          </a>
        </div>
      </section>

      {/* What you'll see */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">데모에서 확인할 수 있는 것</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Feature
            href="/architecture"
            icon="🏛️"
            title="아키텍처 & 설계 의도"
            body="3-tier 세션 분리, 결재 5단계 상태 머신, 2중 권한 방어 구조를 다이어그램으로."
          />
          <Feature
            href="/hq/permissions"
            icon="🔐"
            title="8단계 권한 매트릭스"
            body="역할을 클릭하면 capability 집합이 하이라이트. 수직(관리) + 수평(직무) 하이브리드 모델."
          />
          <Feature
            href="/hq/receipts"
            icon="📑"
            title="결재 흐름 인터랙티브"
            body="실제 5건의 영수증 결재가 어느 단계에 있는지 클릭해 history와 감사 로그를 확인."
          />
        </div>
      </section>

      {/* About the builder */}
      <section className="card p-6 sm:p-8 mb-12">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
          About the builder
        </p>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          김한결 · FM 도메인 풀스택 개발자
        </h3>
        <p className="text-slate-600 leading-relaxed">
          전기기사 5년차. 본직(시설관리)을 유지하며 사내 통합 업무 포털을 1인으로
          설계·구현·운영 중. <strong>현장 운영 4년</strong>의 도메인 지식이 시스템 설계에
          그대로 녹아 있는 — 시장에 드문 조합. FM 회사 IT/DX 팀, FM-Tech / 공정관제 SaaS,
          사내 시스템을 단독으로 끌고 가야 하는 IT 부서에서 즉시 가치를 만들 수 있습니다.
        </p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
          <li>• Daily 포털 — 1인 도입 (170 커밋 / 5만 라인)</li>
          <li>• motras-gas — 11공장 / 25명 / 월 42시간 절감</li>
          <li>• ADR 3건 + RUNBOOK (거버넌스 문서)</li>
          <li>• AI 보조 개발 워크플로우 (Claude Code / Codex)</li>
        </ul>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center max-w-2xl mx-auto">
        ⚠️ 본 데모는 익명화된 가상 시스템입니다. 실제 회사의 코드·고객사·데이터를 포함하지 않으며,
        설계 의도와 기술 선택 근거를 보여주기 위한 포트폴리오 자산입니다.
      </p>
    </div>
  );
}

function Feature({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="card p-5 hover:border-brand-300 hover:shadow-md transition block"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
    </Link>
  );
}
