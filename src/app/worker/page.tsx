import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/lib/session";
import { MOCK_RECEIPTS, MOCK_SITES, getSiteById } from "@/lib/mock-data";
import { formatKRW, STATE_LABEL, STATE_COLOR } from "@/lib/format";

export default async function WorkerPage() {
  const user = await getActiveUser("worker");
  if (!user) redirect("/login?tab=worker");

  const mySites = (user.siteIds || [])
    .map((id) => getSiteById(id))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const myReceipts = MOCK_RECEIPTS.filter((r) => r.submittedBy === user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">도급 근무자 화면</h1>
        <p className="text-sm text-slate-500 mt-1">
          {user.name} · 도급 세션 (<code>dd_worker_session</code>)
        </p>
      </header>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">배정 사이트 ({mySites.length}개)</h2>
        <ul className="space-y-1.5 text-sm">
          {mySites.map((s) => (
            <li key={s.id} className="flex justify-between text-slate-700">
              <span>{s.name}</span>
              <span className="text-xs text-slate-400">{s.region}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">내가 제출한 영수증 ({myReceipts.length}건)</h2>
        <div className="space-y-2">
          {myReceipts.map((r) => (
            <Link
              key={r.id}
              href={`/hq/receipts/${r.id}`}
              className="flex justify-between border border-slate-200 rounded-lg px-3 py-2 text-sm hover:border-brand-300 hover:bg-slate-50/50"
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
          {myReceipts.length === 0 && (
            <p className="text-sm text-slate-400">제출 이력 없음</p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        💡 실 운영 시 작업일지 작성, GPS 출퇴근, 사진 첨부(EXIF 검증) 등이 이 페이지에서 이뤄집니다.
      </p>
    </div>
  );
}
