import { MOCK_ATTENDANCE, getSiteById, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Icon } from "@/components/Icon";

const FLAG_LABEL: Record<string, { label: string; color: string }> = {
  ok:          { label: "정상",     color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  late:        { label: "지각",     color: "bg-amber-100 text-amber-700 border-amber-200" },
  early_leave: { label: "조퇴",     color: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function AttendancePage() {
  const sortedRecords = [...MOCK_ATTENDANCE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="출퇴근 조회"
        subtitle="GPS 좌표 기반 출퇴근 기록. 사이트 좌표와 일치 검증 (실 운영 시 RLS로 본인 데이터만)."
      />

      {sortedRecords.length === 0 ? (
        <EmptyState title="기록 없음" icon="Clock" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">날짜</th>
                <th className="table-header">근무자</th>
                <th className="table-header">사이트</th>
                <th className="table-header">출근</th>
                <th className="table-header">퇴근</th>
                <th className="table-header">GPS</th>
                <th className="table-header">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRecords.map((a) => {
                const worker = getUserById(a.workerId);
                const site = getSiteById(a.siteId);
                const flagMeta = a.flag ? FLAG_LABEL[a.flag] : null;
                return (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="table-cell text-xs text-slate-500">{a.date}</td>
                    <td className="table-cell text-slate-800">{worker?.name}</td>
                    <td className="table-cell text-slate-600 text-xs">{site?.name}</td>
                    <td className="table-cell text-slate-700 font-mono text-xs whitespace-nowrap">
                      {a.clockIn ? formatDate(a.clockIn).slice(11) : "—"}
                    </td>
                    <td className="table-cell text-slate-700 font-mono text-xs whitespace-nowrap">
                      {a.clockOut ? formatDate(a.clockOut).slice(11) : (
                        <span className="text-amber-600">근무 중</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {a.clockInGps ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Icon.Gps className="w-3 h-3" />
                          {a.clockInGps.lat.toFixed(3)}, {a.clockInGps.lng.toFixed(3)}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {flagMeta ? (
                        <span className={"pill " + flagMeta.color}>{flagMeta.label}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-500">
        💡 실 운영 시 GPS 좌표가 사이트 등록 좌표 반경 100m 밖이면 자동 플래그.
        반복 위반 시 알림 → 안전관리자 검토 큐로 라우팅.
      </p>
    </div>
  );
}
