import Link from "next/link";
import { MOCK_RECEIPTS, getSiteById } from "@/lib/mock-data";
import { formatKRW } from "@/lib/format";
import { STATE_LABEL, STATE_COLOR } from "@/lib/format";

export default function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">영수증 결재</h1>
        <p className="text-sm text-slate-500 mt-1">
          상태별 5건의 가상 영수증. 클릭하면 결재 단계와 감사 로그를 확인할 수 있습니다.
        </p>
      </header>

      <div className="space-y-2.5">
        {MOCK_RECEIPTS.map((r) => {
          const site = getSiteById(r.siteId);
          return (
            <Link
              key={r.id}
              href={`/hq/receipts/${r.id}`}
              className="card p-4 hover:border-brand-300 hover:shadow-md transition block"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"pill " + STATE_COLOR[r.state]}>
                      {STATE_LABEL[r.state]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {r.yearMonth} · {site?.name}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900">{r.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    이력 {r.history.length}건 · 최종 전이{" "}
                    {r.history[r.history.length - 1].byRole}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-900">{formatKRW(r.amount)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card p-4 bg-slate-50 border-slate-200">
        <p className="text-xs text-slate-600">
          🔍 <strong>구현 노트</strong> : 모든 전이는 PostgreSQL trigger로 <code>audit_log</code> 테이블에 자동 기록됩니다.
          단계 건너뛰기는 unique constraint <code>(site_id, year_month)</code> + 명시적 상태 머신으로 차단됩니다.
          자세한 설계 근거 →{" "}
          <a
            className="text-brand-600 hover:underline"
            href="https://github.com/khgtop94/daily-portal-case-study/blob/main/DIAGRAMS/approval-flow.md"
            target="_blank"
            rel="noreferrer"
          >
            결재 흐름 다이어그램
          </a>
        </p>
      </div>
    </div>
  );
}
