import Link from "next/link";
import { MOCK_RECEIPTS, MOCK_SITES, MOCK_USERS } from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import { formatKRW } from "@/lib/format";
import { can } from "@/lib/permissions";

export default async function HQDashboard() {
  const user = await getActiveUser("hq");
  if (!user) return null;

  const pending = MOCK_RECEIPTS.filter((r) => r.state === "submitted").length;
  const opsApproved = MOCK_RECEIPTS.filter((r) => r.state === "ops_approved").length;
  const clientApproved = MOCK_RECEIPTS.filter((r) => r.state === "client_approved").length;
  const finalApproved = MOCK_RECEIPTS.filter((r) => r.state === "hq_approved").length;
  const totalAmount = MOCK_RECEIPTS.reduce((a, r) => a + r.amount, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">HQ 대시보드</h1>
        <p className="text-sm text-slate-500 mt-1">
          {user.name} ({user.role}) · 본사 세션 (<code>dd_session</code>)
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="제출 대기" value={pending} hint="관리팀장 검토 필요" />
        <Stat label="OPS 승인" value={opsApproved} hint="발주처 검토 단계" />
        <Stat label="발주처 승인" value={clientApproved} hint="본사 최종 결재 필요" />
        <Stat label="최종 승인" value={finalApproved} hint="이번 분기" />
      </div>

      <div className="card p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
          이번 데모의 결재 총액
        </p>
        <p className="text-3xl font-bold text-slate-900">{formatKRW(totalAmount)}</p>
        <p className="text-xs text-slate-500 mt-1">
          (가상 데이터 · {MOCK_RECEIPTS.length}건)
        </p>
      </div>

      {/* Capability check */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">현재 세션의 권한</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <CapItem ok={can(user.role, "CAN_APPROVE_HQ")} label="영수증 최종 결재" />
          <CapItem ok={can(user.role, "CAN_APPROVE_OPS")} label="영수증 OPS 결재" />
          <CapItem ok={can(user.role, "CAN_MANAGE_ACCOUNT")} label="포털 계정 생성/수정" />
          <CapItem ok={can(user.role, "CAN_VIEW_AUDIT_LOG")} label="감사 로그 조회" />
          <CapItem ok={can(user.role, "CAN_REVIEW_SAFETY")} label="안전 항목 검토" />
          <CapItem ok={can(user.role, "CAN_REGISTER_WORKER")} label="등록 신청" />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          💡 역할에 따라 보이는 권한이 달라집니다. 좌측 상단{" "}
          <Link href="/login?tab=hq" className="text-brand-600 hover:underline">
            "전환"
          </Link>{" "}
          으로 다른 역할로 로그인하면 즉시 비교 가능.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">활성 사이트 ({MOCK_SITES.length}개)</h2>
        <ul className="text-sm divide-y divide-slate-100">
          {MOCK_SITES.map((s) => (
            <li key={s.id} className="py-2 flex justify-between text-slate-700">
              <span>{s.name}</span>
              <span className="text-slate-400 text-xs">{s.region}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xs text-slate-500">
        등록 사용자 : 본사 {MOCK_USERS.filter((u) => u.sessionType === "hq").length}명 ·
        도급 {MOCK_USERS.filter((u) => u.sessionType === "worker").length}명 ·
        발주처 {MOCK_USERS.filter((u) => u.sessionType === "client").length}명
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
    </div>
  );
}

function CapItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={ok ? "text-emerald-600" : "text-slate-300"}>
        {ok ? "✓" : "—"}
      </span>
      <span className={ok ? "text-slate-700" : "text-slate-400 line-through"}>
        {label}
      </span>
    </div>
  );
}
