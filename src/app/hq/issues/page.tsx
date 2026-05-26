import { MOCK_DAILY_ISSUES, getSiteById, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

const STATUS_COLOR: Record<string, string> = {
  open:       "bg-amber-100 text-amber-700 border-amber-200",
  resolved:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  escalated:  "bg-rose-100 text-rose-700 border-rose-200",
};
const STATUS_LABEL: Record<string, string> = {
  open: "열림", resolved: "해결", escalated: "상신",
};

export default function IssuesPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="일일 이슈"
        subtitle="현장에서 보고된 운영 이슈. 해결·상신 흐름 추적."
      />

      {MOCK_DAILY_ISSUES.length === 0 ? (
        <EmptyState title="이슈 없음" icon="Check" />
      ) : (
        <div className="space-y-3">
          {MOCK_DAILY_ISSUES.map((i) => {
            const site = getSiteById(i.siteId);
            const reporter = getUserById(i.raisedBy);
            return (
              <article key={i.id} className="card p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={"pill " + STATUS_COLOR[i.status]}>{STATUS_LABEL[i.status]}</span>
                  <span className="text-xs text-slate-500">{site?.name}</span>
                  <span className="text-xs text-slate-400">· {formatDate(i.raisedAt)}</span>
                </div>
                <h3 className="font-medium text-slate-900">{i.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{i.description}</p>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                  <span>보고자 · {reporter?.name}</span>
                  {i.resolvedAt && (
                    <span className="text-emerald-600">해결 · {formatDate(i.resolvedAt)}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
