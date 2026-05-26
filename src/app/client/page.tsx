import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/lib/session";
import { MOCK_RECEIPTS, MOCK_DAILY_LOGS, MOCK_DAILY_ISSUES, getSiteById } from "@/lib/mock-data";
import { formatKRW, STATE_LABEL, STATE_COLOR } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";

export default async function ClientPage() {
  const user = await getActiveUser("client");
  if (!user) redirect("/login?tab=client");

  const sites = (user.siteIds || [])
    .map((id) => getSiteById(id))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const visibleReceipts = MOCK_RECEIPTS.filter((r) =>
    (user.siteIds || []).includes(r.siteId)
  );
  const recentLogs = MOCK_DAILY_LOGS.filter((d) =>
    (user.siteIds || []).includes(d.siteId)
  ).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const openIssues = MOCK_DAILY_ISSUES.filter((i) =>
    (user.siteIds || []).includes(i.siteId) && i.status !== "resolved"
  );
  const pending = visibleReceipts.filter((r) => r.state === "ops_approved").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in">
      <PageHeader
        title={`${user.name} · 발주처 모니터링`}
        subtitle="권한 부여된 사이트만 표시 (RLS로 DB 레벨 격리)"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="권한 사이트" value={sites.length} icon="Site" />
        <StatCard label="검토 대기" value={pending} hint="발주처 승인 필요" icon="Receipt" tone={pending > 0 ? "amber" : "slate"} />
        <StatCard label="최근 일지" value={recentLogs.length} icon="Clipboard" />
        <StatCard label="열린 이슈" value={openIssues.length} icon="Warning" tone={openIssues.length > 0 ? "rose" : "slate"} />
      </div>

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">권한 부여된 사이트</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {sites.map((s) => (
            <li key={s.id} className="border border-slate-100 rounded-lg p-3">
              <p className="font-medium text-slate-800">{s.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.region} · {s.jobType}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">검토 대상 영수증</h2>
        </div>
        {visibleReceipts.length === 0 ? (
          <EmptyState title="영수증 없음" icon="Receipt" />
        ) : (
          <div className="space-y-2">
            {visibleReceipts.map((r) => (
              <Link
                key={r.id}
                href={`/hq/receipts/${r.id}`}
                className="block border border-slate-100 rounded-lg p-3 hover:border-brand-300 transition"
              >
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{r.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{getSiteById(r.siteId)?.name} · {r.yearMonth}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-900">{formatKRW(r.amount)}</p>
                    <span className={"pill mt-0.5 " + STATE_COLOR[r.state]}>{STATE_LABEL[r.state]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">최근 작업 일지</h2>
        {recentLogs.length === 0 ? (
          <EmptyState title="일지 없음" icon="Clipboard" />
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {recentLogs.map((d) => (
              <li key={d.id} className="py-2.5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-500">{d.date} · {getSiteById(d.siteId)?.name}</span>
                  <span className="text-xs text-slate-400">{d.shiftStart}-{d.shiftEnd}</span>
                </div>
                <p className="text-slate-700">{d.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-500">
        🔐 RLS 정책에 따라 권한 부여되지 않은 사이트의 데이터는 DB 레벨에서 조회 자체가 차단됩니다.
        발주처 portal 활성화 / 비활성화는 capability <code>CAN_MANAGE_CLIENT_PORTAL</code> 보유자(admin/support)가 제어합니다.
      </p>
    </div>
  );
}
