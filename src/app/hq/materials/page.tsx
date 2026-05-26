import { MOCK_MATERIAL_REQUESTS, getSiteById, getUserById } from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { formatKRW, formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { approveMaterial, rejectMaterial } from "./actions";

const STATE_COLOR: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  approved:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected:  "bg-rose-100 text-rose-700 border-rose-200",
  fulfilled: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATE_LABEL: Record<string, string> = {
  pending: "대기", approved: "승인", rejected: "반려", fulfilled: "완료",
};

export default async function MaterialsPage() {
  const user = await getActiveUser("hq");
  if (!user) return null;
  const canApprove = can(user.role, "CAN_APPROVE_MATERIAL");

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="자재 요청"
        subtitle="현장에서 신청한 자재 결재 — 관리팀장 이상 권한"
      />

      {MOCK_MATERIAL_REQUESTS.length === 0 ? (
        <EmptyState title="요청 없음" icon="Box" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">신청일</th>
                <th className="table-header">사이트</th>
                <th className="table-header">품목</th>
                <th className="table-header text-right">수량</th>
                <th className="table-header text-right">단가</th>
                <th className="table-header text-right">총액</th>
                <th className="table-header">상태</th>
                <th className="table-header text-right">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_MATERIAL_REQUESTS.map((m) => {
                const site = getSiteById(m.siteId);
                const requester = getUserById(m.requestedBy);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="table-cell text-xs text-slate-500 whitespace-nowrap">{formatDate(m.createdAt)}</td>
                    <td className="table-cell">
                      <p className="text-slate-800">{site?.name}</p>
                      <p className="text-xs text-slate-400">{requester?.name}</p>
                    </td>
                    <td className="table-cell text-slate-800">{m.itemName}</td>
                    <td className="table-cell text-right text-slate-700">{m.qty}</td>
                    <td className="table-cell text-right text-slate-700">{formatKRW(m.unitPrice)}</td>
                    <td className="table-cell text-right font-medium text-slate-900">{formatKRW(m.qty * m.unitPrice)}</td>
                    <td className="table-cell">
                      <span className={"pill " + STATE_COLOR[m.state]}>{STATE_LABEL[m.state]}</span>
                      {m.rejectReason && (
                        <p className="text-xs text-rose-500 mt-1">{m.rejectReason}</p>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      {m.state === "pending" && canApprove ? (
                        <div className="flex justify-end gap-1.5">
                          <form action={approveMaterial}>
                            <input type="hidden" name="id" value={m.id} />
                            <button className="btn-emerald text-xs px-2.5 py-1">승인</button>
                          </form>
                          <form action={rejectMaterial}>
                            <input type="hidden" name="id" value={m.id} />
                            <button className="btn-danger text-xs px-2.5 py-1">반려</button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!canApprove && (
        <p className="text-xs text-slate-500">
          ⚠️ 현재 역할(<code>{user.role}</code>)은 자재 요청 결재 권한이 없습니다.
          <code> admin / support / operations </code>로 전환 시 액션 버튼이 활성화됩니다.
        </p>
      )}
    </div>
  );
}
