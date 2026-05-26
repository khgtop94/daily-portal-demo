import Link from "next/link";
import {
  MOCK_RECEIPTS,
  MOCK_SITES,
  MOCK_USERS,
  MOCK_MATERIAL_REQUESTS,
  MOCK_DAILY_ISSUES,
  MOCK_MEETINGS,
  MOCK_NOTIFICATIONS,
  MOCK_ATTENDANCE,
  getSiteById,
  getUserById,
} from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import { formatKRW, STATE_LABEL, STATE_COLOR, formatDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { Icon } from "@/components/Icon";

export default async function HQDashboard() {
  const user = await getActiveUser("hq");
  if (!user) return null;

  const pending = MOCK_RECEIPTS.filter((r) => r.state === "submitted").length;
  const opsApproved = MOCK_RECEIPTS.filter((r) => r.state === "ops_approved").length;
  const clientApproved = MOCK_RECEIPTS.filter((r) => r.state === "client_approved").length;
  const finalApproved = MOCK_RECEIPTS.filter((r) => r.state === "hq_approved").length;
  const totalAmount = MOCK_RECEIPTS.reduce((a, r) => a + r.amount, 0);

  const openIssues = MOCK_DAILY_ISSUES.filter((i) => i.status === "open" || i.status === "escalated");
  const pendingMaterials = MOCK_MATERIAL_REQUESTS.filter((m) => m.state === "pending");
  const overdueMeetings = MOCK_MEETINGS.filter((m) => m.status === "overdue");
  const myUnreadNotifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === user.id && !n.read);

  const todayAttendance = MOCK_ATTENDANCE.filter(
    (a) => a.date === "2026-05-26"
  );

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="HQ 대시보드"
        subtitle={`${user.name} (${user.role}) · 본사 세션 (dd_session)`}
      />

      {/* Hero stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="제출 대기" value={pending} hint="관리팀장 검토 필요" icon="Inbox" tone="amber" />
        <StatCard label="OPS 승인" value={opsApproved} hint="발주처 검토 단계" icon="Receipt" tone="brand" />
        <StatCard label="발주처 승인" value={clientApproved} hint="본사 최종 결재 필요" icon="Receipt" tone="brand" />
        <StatCard label="최종 승인" value={finalApproved} hint="이번 분기" icon="Check" tone="emerald" />
      </div>

      {/* Operational hot list */}
      <div className="grid lg:grid-cols-3 gap-4">
        <StatCard
          label="열린 이슈"
          value={openIssues.length}
          hint={openIssues.length > 0 ? "확인 필요" : "이상 없음"}
          icon="Warning"
          tone={openIssues.length > 0 ? "rose" : "slate"}
        />
        <StatCard
          label="대기 자재 요청"
          value={pendingMaterials.length}
          hint="관리팀장 결재 대기"
          icon="Box"
          tone={pendingMaterials.length > 0 ? "amber" : "slate"}
        />
        <StatCard
          label="회의록 지연"
          value={overdueMeetings.length}
          hint={overdueMeetings.length > 0 ? "마감 초과" : "일정 정상"}
          icon="Meeting"
          tone={overdueMeetings.length > 0 ? "rose" : "slate"}
        />
      </div>

      {/* Recent receipts requiring my attention */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">결재 대기 영수증</h2>
          <Link href="/hq/receipts" className="text-xs text-brand-600 hover:underline">
            전체 보기 →
          </Link>
        </div>
        {MOCK_RECEIPTS.filter((r) => r.state === "submitted" || r.state === "client_approved").length === 0 ? (
          <EmptyState title="결재 대기 없음" body="모든 영수증 처리 완료." icon="Check" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {MOCK_RECEIPTS.filter((r) => r.state === "submitted" || r.state === "client_approved")
              .slice(0, 4)
              .map((r) => {
                const site = getSiteById(r.siteId);
                return (
                  <li key={r.id}>
                    <Link
                      href={`/hq/receipts/${r.id}`}
                      className="block py-2.5 hover:bg-slate-50 -mx-2 px-2 rounded-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{r.description}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{site?.name} · {r.yearMonth}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-slate-900">{formatKRW(r.amount)}</p>
                          <span className={"pill mt-0.5 " + STATE_COLOR[r.state]}>{STATE_LABEL[r.state]}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      {/* Two-column: notifications + open issues */}
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Icon.Bell className="w-4 h-4 text-slate-400" /> 나의 알림 (미확인)
            </h2>
            <Link href="/hq/notifications" className="text-xs text-brand-600 hover:underline">전체</Link>
          </div>
          {myUnreadNotifs.length === 0 ? (
            <EmptyState title="새 알림 없음" icon="Bell" />
          ) : (
            <ul className="space-y-2">
              {myUnreadNotifs.slice(0, 4).map((n) => (
                <li key={n.id} className="border border-slate-100 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <span
                      className={
                        "pill " +
                        (n.severity === "danger"
                          ? "bg-rose-100 text-rose-700 border-rose-200"
                          : n.severity === "warning"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200")
                      }
                    >
                      {n.severity}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Icon.Warning className="w-4 h-4 text-slate-400" /> 열린 일일 이슈
            </h2>
            <Link href="/hq/issues" className="text-xs text-brand-600 hover:underline">전체</Link>
          </div>
          {openIssues.length === 0 ? (
            <EmptyState title="열린 이슈 없음" icon="Check" />
          ) : (
            <ul className="space-y-2">
              {openIssues.slice(0, 4).map((i) => {
                const site = getSiteById(i.siteId);
                return (
                  <li key={i.id} className="border border-slate-100 rounded-lg p-2.5">
                    <p className="text-sm font-medium text-slate-800">{i.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{site?.name} · {formatDate(i.raisedAt)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Today's attendance */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Icon.Clock className="w-4 h-4 text-slate-400" /> 오늘의 출퇴근 (2026-05-26)
          </h2>
          <Link href="/hq/attendance" className="text-xs text-brand-600 hover:underline">전체</Link>
        </div>
        {todayAttendance.length === 0 ? (
          <EmptyState title="기록 없음" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {todayAttendance.map((a) => {
              const worker = getUserById(a.workerId);
              const site = getSiteById(a.siteId);
              return (
                <li key={a.id} className="py-2 flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    <span className="font-medium">{worker?.name}</span>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <span className="text-slate-500">{site?.name}</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    출근 {a.clockIn?.slice(11, 16)} {a.clockOut ? `· 퇴근 ${a.clockOut.slice(11, 16)}` : "· 근무 중"}
                    {a.flag && a.flag !== "ok" && (
                      <span className="pill ml-2 bg-amber-100 text-amber-700 border-amber-200">{a.flag}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Capability check */}
      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Icon.Shield className="w-4 h-4 text-slate-400" />
          현재 세션의 권한
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {[
            ["CAN_APPROVE_HQ",         "영수증 최종 결재"],
            ["CAN_APPROVE_OPS",        "영수증 OPS 결재"],
            ["CAN_MANAGE_ACCOUNT",     "포털 계정 생성/수정"],
            ["CAN_VIEW_AUDIT_LOG",     "감사 로그 조회"],
            ["CAN_REVIEW_SAFETY",      "안전 항목 검토"],
            ["CAN_REGISTER_WORKER",    "등록 신청"],
            ["CAN_APPROVE_MATERIAL",   "자재 요청 결재"],
            ["CAN_MANAGE_SITE",        "사이트 관리"],
            ["CAN_CLOSE_MEETING",      "회의 종결"],
          ].map(([cap, label]) => {
            const ok = can(user.role, cap as any);
            return (
              <div key={cap} className="flex items-center gap-2">
                <span className={ok ? "text-emerald-600" : "text-slate-300"}>{ok ? "✓" : "—"}</span>
                <span className={ok ? "text-slate-700" : "text-slate-400 line-through"}>{label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          💡 좌측 상단{" "}
          <Link href="/login?tab=hq" className="text-brand-600 hover:underline">"전환"</Link> 으로 다른 역할로 재로그인 시 즉시 비교 가능.
        </p>
      </section>

      <div className="text-xs text-slate-500">
        활성 사이트 {MOCK_SITES.filter((s) => s.activeContract).length}개 · 등록 사용자
        {" "}본사 {MOCK_USERS.filter((u) => u.sessionType === "hq").length}명
        {" "}· 도급 {MOCK_USERS.filter((u) => u.sessionType === "worker").length}명
        {" "}· 발주처 {MOCK_USERS.filter((u) => u.sessionType === "client").length}명
        {" "}· 본 데모의 결재 총액 {formatKRW(totalAmount)}
      </div>
    </div>
  );
}
