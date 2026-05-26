import Link from "next/link";
import { getActiveUser } from "@/lib/session";
import { MOCK_DAILY_LOGS, getSiteById } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function WorkerLogsPage() {
  const user = await getActiveUser("worker");
  if (!user) return null;

  const myLogs = MOCK_DAILY_LOGS.filter((d) => d.workerId === user.id).sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="작업일지"
        subtitle={`총 ${myLogs.length}건`}
        actions={
          <Link href="/worker/logs/new" className="btn-primary text-sm">
            + 새 일지
          </Link>
        }
      />

      {myLogs.length === 0 ? (
        <EmptyState title="아직 작성된 일지가 없습니다" body="우상단 '새 일지'로 시작하세요." icon="Clipboard" />
      ) : (
        <ul className="space-y-2.5">
          {myLogs.map((d) => {
            const site = getSiteById(d.siteId);
            return (
              <li key={d.id} className="card p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="font-medium text-slate-900">{d.date}</p>
                  <span className="text-xs text-slate-500">{d.shiftStart} – {d.shiftEnd}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1.5">{site?.name}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{d.summary}</p>
                {d.safetyNote && (
                  <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
                    🛡️ 안전 메모 — {d.safetyNote}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span>📷 사진 {d.photos}장</span>
                  {d.exifIssues > 0 && (
                    <span className="text-rose-600">EXIF 의심 {d.exifIssues}건</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
