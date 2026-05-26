import { MOCK_AUDIT_LOG, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">감사 로그</h1>
        <p className="text-sm text-slate-500 mt-1">
          모든 권한 변경·결재 전이는 PostgreSQL trigger로 자동 기록됩니다.
          본 페이지는 capability <code>CAN_VIEW_AUDIT_LOG</code> 보유자만 접근 가능합니다.
        </p>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-2">시각</th>
              <th className="text-left px-4 py-2">실행자</th>
              <th className="text-left px-4 py-2">역할</th>
              <th className="text-left px-4 py-2">행위</th>
              <th className="text-left px-4 py-2">대상</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_AUDIT_LOG.map((e) => {
              const actor = getUserById(e.actor);
              return (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 text-slate-500 text-xs whitespace-nowrap">
                    {formatDate(e.at)}
                  </td>
                  <td className="px-4 py-2 text-slate-800">{actor?.name || e.actor}</td>
                  <td className="px-4 py-2">
                    <span className="pill bg-slate-100 text-slate-700 border-slate-200">
                      {e.actorRole}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-700">{e.action}</td>
                  <td className="px-4 py-2 text-slate-600 text-xs">{e.target}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        💡 실 운영 시 보존 기간·검색 인덱스·PII 마스킹 정책이 추가됩니다.
      </p>
    </div>
  );
}
