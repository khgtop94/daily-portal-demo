import { MOCK_SITES, MOCK_RECEIPTS, MOCK_DAILY_ISSUES } from "@/lib/mock-data";
import { formatKRW } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

const JOB_COLOR: Record<string, string> = {
  electrical: "bg-blue-100 text-blue-700 border-blue-200",
  security:   "bg-purple-100 text-purple-700 border-purple-200",
  cleaning:   "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function SitesPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="사이트 관리"
        subtitle="활성/비활성 사이트, 직무, 근무자 수, 결재 통계"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOCK_SITES.map((s) => {
          const siteReceipts = MOCK_RECEIPTS.filter((r) => r.siteId === s.id);
          const siteIssues = MOCK_DAILY_ISSUES.filter(
            (i) => i.siteId === s.id && (i.status === "open" || i.status === "escalated")
          );
          const totalAmount = siteReceipts.reduce((a, r) => a + r.amount, 0);
          return (
            <div key={s.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {s.clientName} · {s.region}
                  </p>
                </div>
                {!s.activeContract && (
                  <span className="pill bg-slate-100 text-slate-600 border-slate-200 shrink-0">
                    비활성
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className={"pill " + JOB_COLOR[s.jobType]}>{s.jobType}</span>
                <span className="pill bg-slate-100 text-slate-600 border-slate-200">
                  근무자 {s.workerCount}명
                </span>
                {siteIssues.length > 0 && (
                  <span className="pill bg-rose-100 text-rose-700 border-rose-200">
                    이슈 {siteIssues.length}
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>결재 {siteReceipts.length}건</span>
                <span className="font-medium text-slate-700">{formatKRW(totalAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500">
        💡 실 운영 시 사이트 등록 시 GPS 좌표·반경·계약 기간·법정 점검 주기를 함께 등록.
        선임 안전관리자 자동 매핑.
      </p>
    </div>
  );
}
