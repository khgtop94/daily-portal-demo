import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/lib/session";
import { MOCK_RECEIPTS, getSiteById } from "@/lib/mock-data";
import { formatKRW, STATE_LABEL, STATE_COLOR } from "@/lib/format";

export default async function ClientPage() {
  const user = await getActiveUser("client");
  if (!user) redirect("/login?tab=client");

  const sites = (user.siteIds || [])
    .map((id) => getSiteById(id))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const visibleReceipts = MOCK_RECEIPTS.filter((r) =>
    (user.siteIds || []).includes(r.siteId)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">발주처 모니터링</h1>
        <p className="text-sm text-slate-500 mt-1">
          {user.name} · 발주처 세션 (<code>dd_client_session</code>)
        </p>
      </header>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">권한 부여된 사이트 ({sites.length}개)</h2>
        <ul className="space-y-1.5 text-sm">
          {sites.map((s) => (
            <li key={s.id} className="flex justify-between text-slate-700">
              <span>{s.name}</span>
              <span className="text-xs text-slate-400">{s.region}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-3">
          🔐 RLS 정책에 따라 권한 부여되지 않은 사이트의 데이터는 DB 레벨에서 조회 자체가 차단됩니다.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">검토 대상 영수증 ({visibleReceipts.length}건)</h2>
        <div className="space-y-2">
          {visibleReceipts.map((r) => (
            <Link
              key={r.id}
              href={`/hq/receipts/${r.id}`}
              className="flex justify-between border border-slate-200 rounded-lg px-3 py-2 text-sm hover:border-brand-300"
            >
              <div>
                <p className="font-medium text-slate-800">{r.description}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {r.yearMonth} · {getSiteById(r.siteId)?.name}
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-slate-900">{formatKRW(r.amount)}</p>
                <span className={"pill mt-1 " + STATE_COLOR[r.state]}>
                  {STATE_LABEL[r.state]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
