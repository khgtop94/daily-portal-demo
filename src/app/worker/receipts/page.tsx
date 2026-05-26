import Link from "next/link";
import { getActiveUser } from "@/lib/session";
import { MOCK_RECEIPTS, getSiteById } from "@/lib/mock-data";
import { formatKRW, STATE_LABEL, STATE_COLOR } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function WorkerReceiptsPage() {
  const user = await getActiveUser("worker");
  if (!user) return null;

  const mine = MOCK_RECEIPTS.filter((r) => r.submittedBy === user.id);

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="내 영수증"
        subtitle={`제출 ${mine.length}건`}
        actions={
          <button className="btn-primary text-sm" disabled>+ 새 영수증 (데모)</button>
        }
      />

      {mine.length === 0 ? (
        <EmptyState title="제출 이력 없음" icon="Receipt" />
      ) : (
        <div className="space-y-2">
          {mine.map((r) => (
            <Link
              key={r.id}
              href={`/hq/receipts/${r.id}`}
              className="card p-4 block hover:border-brand-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"pill " + STATE_COLOR[r.state]}>{STATE_LABEL[r.state]}</span>
                    <span className="text-xs text-slate-500">{r.yearMonth}</span>
                  </div>
                  <p className="font-medium text-slate-900">{r.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {getSiteById(r.siteId)?.name} · 첨부 {r.attachments.length}건
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-900 shrink-0">{formatKRW(r.amount)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
