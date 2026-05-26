import { getActiveUser } from "@/lib/session";
import { MOCK_ATTENDANCE, getSiteById } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { formatDate } from "@/lib/format";

export default async function WorkerAttendancePage() {
  const user = await getActiveUser("worker");
  if (!user) return null;

  const mine = MOCK_ATTENDANCE.filter((a) => a.workerId === user.id).sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const todayActive = mine.find((a) => a.date === "2026-05-26" && !a.clockOut);

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title="출퇴근 (GPS)" subtitle="현장 좌표와 자동 대조 — 반경 100m 밖이면 자동 플래그" />

      {/* Today action */}
      <section className="card p-5">
        <p className="text-xs text-slate-500 mb-3">오늘 (2026-05-26)</p>
        {todayActive ? (
          <div>
            <p className="text-sm text-slate-700 mb-1">
              <Icon.Clock className="w-4 h-4 inline -mt-0.5 mr-1 text-emerald-500" />
              <strong>{getSiteById(todayActive.siteId)?.name}</strong> 에서 근무 중
            </p>
            <p className="text-xs text-slate-500">
              출근 {formatDate(todayActive.clockIn).slice(11)} ·
              GPS {todayActive.clockInGps?.lat.toFixed(3)}, {todayActive.clockInGps?.lng.toFixed(3)}
            </p>
            <button type="button" className="btn-primary mt-3" disabled>
              <Icon.Gps className="w-4 h-4" /> 퇴근 체크 (데모)
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-3">아직 오늘 출근 기록이 없습니다.</p>
            <button type="button" className="btn-emerald" disabled>
              <Icon.Gps className="w-4 h-4" /> 출근 체크 (데모)
            </button>
            <p className="text-xs text-slate-400 mt-2">
              📍 실 운영 시 브라우저 Geolocation API → 사이트 좌표와 일치 여부 검증.
            </p>
          </div>
        )}
      </section>

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">최근 기록</h2>
        {mine.length === 0 ? (
          <EmptyState title="기록 없음" icon="Clock" />
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {mine.map((a) => {
              const site = getSiteById(a.siteId);
              return (
                <li key={a.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-slate-800">{a.date} · {site?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      출근 {a.clockIn?.slice(11, 16)} {a.clockOut && `· 퇴근 ${a.clockOut.slice(11, 16)}`}
                    </p>
                  </div>
                  {a.flag && a.flag !== "ok" && (
                    <span className="pill bg-amber-100 text-amber-700 border-amber-200">{a.flag}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
