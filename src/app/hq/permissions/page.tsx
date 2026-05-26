import PermissionMatrix from "./PermissionMatrix";

export default function PermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">8단계 권한 매트릭스</h1>
        <p className="text-sm text-slate-500 mt-1">
          역할 칸을 클릭하면 capability 행이 하이라이트됩니다. 수직 3단계(시스템 관리) +
          수평 5단계(직무 분기)의 하이브리드 모델 — 위계가 아닌 capability 집합 기반.
        </p>
      </header>

      <PermissionMatrix searchParams={searchParams} />

      <section className="card p-5 bg-slate-50 border-slate-200">
        <h2 className="font-semibold text-slate-800 text-sm mb-2">왜 이 모델인가</h2>
        <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <li>• <strong>시스템 관리 권한 ≠ 비즈니스 결재 권한</strong> — admin/support는 시스템 통제권만, 비즈니스 결재는 별도 capability</li>
          <li>• <strong>안전관리자(safety)를 별도 분기</strong> — FM 도메인 특수성. 법정 선임 직무를 일반 staff와 분리</li>
          <li>• <strong>capability 집합 기반</strong> — 위계 추론 없이 단순 Set 포함 체크. 새 기능 추가 시 Set만 정의</li>
          <li>• 자세한 설계 근거 → <a className="text-brand-600 hover:underline" href="https://github.com/khgtop94/daily-portal-case-study/blob/main/ADR/0003-eight-step-permission.md" target="_blank" rel="noreferrer">ADR-0003</a></li>
        </ul>
      </section>
    </div>
  );
}
