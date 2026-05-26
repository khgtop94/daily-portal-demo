import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_RECEIPTS, getSiteById, getUserById } from "@/lib/mock-data";
import { formatKRW } from "@/lib/format";
import ApprovalChain from "@/components/ApprovalChain";

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = MOCK_RECEIPTS.find((r) => r.id === id);
  if (!receipt) notFound();

  const site = getSiteById(receipt.siteId);
  const submitter = getUserById(receipt.submittedBy);

  return (
    <div className="space-y-6">
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
      </header>

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-4">결재 진행 상태</h2>
        <ApprovalChain state={receipt.state} history={receipt.history} />
      </section>

      <section className="card p-5 bg-slate-50 border-slate-200">
        <h2 className="font-semibold text-slate-800 text-sm mb-2">설계 노트</h2>
        <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <li>• 각 전이는 capability 체크를 통과해야 진행 (예: <code>CAN_APPROVE_HQ</code>)</li>
          <li>• 반려 시 사유 NOT NULL — "왜 반려됐는지 모름" 분쟁 사전 차단</li>
          <li>• 모든 전이는 <code>audit_log</code> 트리거로 자동 기록 (좌측 메뉴 "감사 로그")</li>
          <li>• 같은 사이트·같은 월 영수증 중복 결재 방지 : <code>UNIQUE(site_id, year_month)</code></li>
        </ul>
      </section>
    </div>
  );
}
