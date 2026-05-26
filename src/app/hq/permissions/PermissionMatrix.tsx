import Link from "next/link";
import {
  ALL_ROLES,
  CAPABILITIES,
  ROLE_LABELS,
  ROLE_TIER,
} from "@/lib/permissions";
import type { Capability, Role } from "@/lib/types";

const CAP_LABELS: Record<Capability, string> = {
  CAN_APPROVE_HQ: "영수증 최종 결재",
  CAN_APPROVE_OPS: "영수증 OPS 결재",
  CAN_APPROVE_CLIENT: "영수증 발주처 결재",
  CAN_CREATE_RECEIPT: "영수증 생성",
  CAN_MANAGE_ACCOUNT: "포털 계정 생성/수정",
  CAN_VIEW_AUDIT_LOG: "감사 로그 조회",
  CAN_REVIEW_SAFETY: "안전 항목 검토",
  CAN_REGISTER_WORKER: "도급 등록 신청",
  CAN_MANAGE_CLIENT_PORTAL: "발주처 포털 관리",
};

const ALL_CAPS = Object.keys(CAPABILITIES) as Capability[];

export default async function PermissionMatrix({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const activeRole = (role as Role) || null;

  return (
    <div className="space-y-4">
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[180px]">
                Capability
              </th>
              {ALL_ROLES.map((r) => (
                <th
                  key={r}
                  className={
                    "px-2 py-2 text-xs font-medium uppercase tracking-wider " +
                    (activeRole === r
                      ? "bg-brand-100 text-brand-800"
                      : "text-slate-500")
                  }
                >
                  <Link
                    href={
                      activeRole === r
                        ? "/hq/permissions"
                        : `/hq/permissions?role=${r}`
                    }
                    className="block hover:text-brand-700"
                  >
                    {r}
                    <span className="block text-[10px] mt-0.5 font-normal text-slate-400">
                      {ROLE_TIER[r] === "vertical" ? "수직" : "수평"}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ALL_CAPS.map((cap) => {
              const setForCap = CAPABILITIES[cap];
              const activeHasIt = activeRole ? setForCap.has(activeRole) : false;
              return (
                <tr
                  key={cap}
                  className={
                    activeRole
                      ? activeHasIt
                        ? "bg-emerald-50/40"
                        : "bg-slate-50/30 text-slate-400"
                      : ""
                  }
                >
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-800 text-xs">{CAP_LABELS[cap]}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{cap}</p>
                  </td>
                  {ALL_ROLES.map((r) => {
                    const has = setForCap.has(r);
                    const highlighted = activeRole === r;
                    return (
                      <td
                        key={r}
                        className={
                          "text-center text-sm " +
                          (highlighted ? "bg-brand-50" : "")
                        }
                      >
                        {has ? (
                          <span className="text-emerald-600 font-semibold">✓</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
        <span><strong className="text-slate-700">수직 단계</strong> (admin / support / operations) : 시스템 관리 권한</span>
        <span className="text-slate-300">|</span>
        <span><strong className="text-slate-700">수평 단계</strong> (executive ~ staff) : 직무별 분기</span>
      </div>
    </div>
  );
}
