import Link from "next/link";
import { getActiveUser } from "@/lib/session";
import {
  MOCK_RECEIPTS,
  MOCK_DAILY_LOGS,
  MOCK_ATTENDANCE,
  getSiteById,
} from "@/lib/mock-data";
import { formatKRW, STATE_LABEL, STATE_COLOR, formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";

export default async function WorkerPage() {
  const user = await getActiveUser("worker");
  if (!user) return null;

  const sites = (user.siteIds || []).map((id) => getSiteById(id)).filter((s): s is NonNullable<typeof s> => !!s);
  const myReceipts = MOCK_RECEIPTS.filter((r) => r.submittedBy === user.id);
  const myLogs = MOCK_DAILY_LOGS.filter((d) => d.workerId === user.id);
  const myAttendance = MOCK_ATTENDANCE.filter((a) => a.workerId === user.id);
  const todayLogged = myLogs.some((d) => d.date === "2026-05-26");
  const todayClockedIn = myAttendance.some((a) => a.date === "2026-05-26" && a.clockIn);

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={`${user.name} · 현장 대시보드`}
        subtitle={`도급 세션 (dd_worker_session) · 직무 ${user.jobType}`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="배정 사이트" value={sites.length} icon="Site" />
        <StatCard label="이번 달 일지" value={myLogs.length} icon="Clipboard" />
        <StatCard label="오늘 출근" value={todayClockedIn ? "✓" : "—"} tone={todayClockedIn ? "emerald" : "amber"} icon="Clock" />
        <StatCard label="내 영수증" value={myReceipts.length} icon="Receipt" />
      </div>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">배정 사이트</h2>
        </div>
        {sites.length === 0 ? (
          <EmptyState title="배정 없음" />
        ) : (
          <ul className="space-y-2">
            {sites.map((s) => (
              <li key={s.id} className="border border-slate-100 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.clientName} · {s.region}</p>
                </div>
                <span className="pill bg-slate-100 text-slate-600 border-slate-200">{s.jobType}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">오늘 할 일</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <Link href="/worker/logs/new" className={"border-2 border-dashed rounded-lg p-4 text-center hover:bg-slate-50 transition " + (todayLogged ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300")}>
            <p className="text-sm font-medium text-slate-800">작업일지 작성</p>
            <p className="text-xs text-slate-500 mt-1">
              {todayLogged ? "오늘 작성 완료 ✓" : "오늘 일지가 비어 있습니다"}
            </p>
          </Link>
          <Link href="/worker/attendance" className={"border-2 border-dashed rounded-lg p-4 text-center hover:bg-slate-50 transition " + (todayClockedIn ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300")}>
            <p className="text-sm font-medium text-slate-800">{todayClockedIn ? "퇴근 처리" : "출근 체크"}</p>
            <p className="text-xs text-slate-500 mt-1">
              {todayClockedIn ? "출근 완료 ✓" : "GPS 위치 확인 필요"}
            </p>
          </Link>
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">내가 제출한 영수증</h2>
          <Link href="/worker/receipts" className="text-xs text-brand-600 hover:underline">전체</Link>
        </div>
        {myReceipts.length === 0 ? (
          <EmptyState title="제출 이력 없음" icon="Receipt" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {myReceipts.slice(0, 4).map((r) => (
              <li key={r.id}>
                <Link href={`/hq/receipts/${r.id}`} className="block py-2 hover:bg-slate-50 -mx-2 px-2 rounded">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{r.description}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{r.yearMonth} · {getSiteById(r.siteId)?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-slate-900">{formatKRW(r.amount)}</p>
                      <span className={"pill mt-0.5 " + STATE_COLOR[r.state]}>{STATE_LABEL[r.state]}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
