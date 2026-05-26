import Link from "next/link";
import { MOCK_RECEIPTS, getSiteById } from "@/lib/mock-data";
import { formatKRW, STATE_LABEL, STATE_COLOR } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Icon } from "@/components/Icon";

const STATE_BUCKETS: { key: string; label: string; states: string[] }[] = [
  { key: "all",      label: "전체",       states: [] },
  { key: "pending",  label: "대기/진행",  states: ["submitted", "ops_approved", "client_approved"] },
  { key: "approved", label: "최종 승인",  states: ["hq_approved"] },
  { key: "rejected", label: "반려",       states: ["ops_rejected", "client_rejected", "hq_rejected"] },
];

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ bucket?: string; q?: string }>;
}) {
  const { bucket = "all", q = "" } = await searchParams;
  const bucketDef = STATE_BUCKETS.find((b) => b.key === bucket) || STATE_BUCKETS[0];

  const filtered = MOCK_RECEIPTS.filter((r) => {
    if (bucketDef.states.length > 0 && !bucketDef.states.includes(r.state)) return false;
    if (q) {
      const site = getSiteById(r.siteId);
      const haystack = `${r.description} ${site?.name} ${site?.clientName} ${r.yearMonth}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const total = filtered.reduce((a, r) => a + r.amount, 0);

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="영수증 결재"
        subtitle={`${filtered.length}건 · 합계 ${formatKRW(total)}`}
      />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex gap-1.5 flex-wrap">
          {STATE_BUCKETS.map((b) => (
            <Link
              key={b.key}
              href={`/hq/receipts?bucket=${b.key}${q ? `&q=${q}` : ""}`}
              className={
                "px-3 py-1.5 rounded-lg text-sm border " +
                (b.key === bucket
                  ? "bg-brand-50 border-brand-300 text-brand-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300")
              }
            >
              {b.label}
            </Link>
          ))}
        </div>
        <form className="flex-1 relative" action="/hq/receipts">
          {bucket !== "all" && <input type="hidden" name="bucket" value={bucket} />}
          <Icon.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="설명·사이트·발주처·연월 검색…"
            className="input pl-9"
          />
        </form>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 결재 없음"
          body="필터를 변경하거나 검색어를 비워보세요."
          icon="Search"
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r) => {
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
                      이력 {r.history.length}건 · 첨부 {r.attachments.length}건 ·
                      최종 전이 {r.history[r.history.length - 1].byRole}
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
      )}

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
