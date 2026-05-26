import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_RECEIPTS, getSiteById, getUserById } from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { formatKRW, formatDate } from "@/lib/format";
import ApprovalChain from "@/components/ApprovalChain";
import { Icon } from "@/components/Icon";
import { approveReceipt, rejectReceipt } from "./actions";

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = MOCK_RECEIPTS.find((r) => r.id === id);
  if (!receipt) notFound();

  const session = await getActiveUser("hq");
  const site = getSiteById(receipt.siteId);
  const submitter = getUserById(receipt.submittedBy);

  // What action is available given current state + role?
  let nextActionLabel: string | null = null;
  let nextState: string | null = null;
  if (session) {
    if (receipt.state === "submitted" && can(session.role, "CAN_APPROVE_OPS")) {
      nextActionLabel = "관리팀장 승인 (→ OPS Approved)";
      nextState = "ops_approved";
    } else if (receipt.state === "client_approved" && can(session.role, "CAN_APPROVE_HQ")) {
      nextActionLabel = "본사 최종 승인 (→ HQ Approved)";
      nextState = "hq_approved";
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <Link href="/hq/receipts" className="text-sm text-brand-600 hover:underline">
          ← 결재 목록
        </Link>
      </div>

      <header className="card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-slate-500 mb-1">
              {site?.name} · {receipt.yearMonth}
            </p>
            <h1 className="text-xl font-bold text-slate-900">{receipt.description}</h1>
            <p className="text-xs text-slate-500 mt-1.5">
              제출자 : {submitter?.name} ({submitter?.sessionType})
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{formatKRW(receipt.amount)}</p>
          </div>
        </div>

        {/* Action buttons */}
        {nextActionLabel && nextState && (
          <div className="mt-5 pt-5 border-t border-slate-100 flex gap-2 flex-wrap">
            <form action={approveReceipt}>
              <input type="hidden" name="id" value={receipt.id} />
              <input type="hidden" name="nextState" value={nextState} />
              <button className="btn-emerald">
                <Icon.Check className="w-4 h-4" /> {nextActionLabel}
              </button>
            </form>
            <form action={rejectReceipt}>
              <input type="hidden" name="id" value={receipt.id} />
              <input type="hidden" name="currentState" value={receipt.state} />
              <button className="btn-danger">
                <Icon.X className="w-4 h-4" /> 반려
              </button>
            </form>
          </div>
        )}
        {!nextActionLabel && session && (
          <p className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            현재 역할(<code>{session.role}</code>)이 이 단계에서 취할 액션 없음.
          </p>
        )}
      </header>

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-4">결재 진행 상태</h2>
        <ApprovalChain state={receipt.state} history={receipt.history} />
      </section>

      {/* Attachments with EXIF */}
      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Icon.Camera className="w-4 h-4 text-slate-400" />
          첨부 파일 ({receipt.attachments.length})
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {receipt.attachments.map((a) => (
            <div key={a.id} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{a.filename}</p>
                  <p className="text-xs text-slate-400">{(a.sizeKB / 1024).toFixed(2)} MB</p>
                </div>
                <span
                  className={
                    "pill shrink-0 " +
                    (a.exif.verified === "ok"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : a.exif.verified === "suspicious"
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : "bg-amber-100 text-amber-700 border-amber-200")
                  }
                >
                  EXIF {a.exif.verified}
                </span>
              </div>
              <dl className="text-xs text-slate-500 space-y-0.5">
                <div className="flex justify-between">
                  <dt>촬영시각</dt>
                  <dd className="font-mono">{formatDate(a.exif.capturedAt)}</dd>
                </div>
                {a.exif.gps ? (
                  <div className="flex justify-between">
                    <dt>GPS</dt>
                    <dd className="font-mono">
                      {a.exif.gps.lat.toFixed(3)}, {a.exif.gps.lng.toFixed(3)}
                    </dd>
                  </div>
                ) : (
                  <p className="text-amber-600">{a.exif.note || "GPS 정보 없음"}</p>
                )}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5 bg-slate-50 border-slate-200">
        <h2 className="font-semibold text-slate-800 text-sm mb-2">설계 노트</h2>
        <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <li>• 각 전이는 capability 체크를 통과해야 진행 (예: <code>CAN_APPROVE_HQ</code>)</li>
          <li>• 반려 시 사유 NOT NULL — "왜 반려됐는지 모름" 분쟁 사전 차단</li>
          <li>• 모든 전이는 <code>audit_log</code> 트리거로 자동 기록 (좌측 메뉴 "감사 로그")</li>
          <li>• 같은 사이트·같은 월 영수증 중복 결재 방지 : <code>UNIQUE(site_id, year_month)</code></li>
          <li>• <strong>EXIF 위변조 검증</strong> — 사진 첨부 시 촬영시각/GPS 자동 검증. 의심 시 HQ 리뷰 큐로 라우팅. FM 도메인 특수 설계.</li>
        </ul>
      </section>
    </div>
  );
}
