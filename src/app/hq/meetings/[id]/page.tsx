import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_MEETINGS, getUserById } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = MOCK_MEETINGS.find((m) => m.id === id);
  if (!meeting) notFound();

  return (
    <div className="space-y-5 animate-in">
      <div>
        <Link href="/hq/meetings" className="text-sm text-brand-600 hover:underline">
          ← 회의록 목록
        </Link>
      </div>
      <PageHeader
        title={meeting.title}
        subtitle={`${meeting.date} · 상태 ${meeting.status}`}
      />

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">참석자 ({meeting.attendees.length}명)</h2>
        <ul className="flex flex-wrap gap-2">
          {meeting.attendees.map((id) => {
            const u = getUserById(id);
            return (
              <li
                key={id}
                className="pill bg-slate-100 text-slate-700 border-slate-200"
              >
                {u?.name} {u?.role && `· ${u.role}`}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">안건 ({meeting.agenda.length}건)</h2>
        <ol className="space-y-3">
          {meeting.agenda.map((a, i) => (
            <li key={i} className="border-l-2 border-slate-200 pl-3 py-1">
              <p className="font-medium text-slate-800">{i + 1}. {a.topic}</p>
              {a.decision ? (
                <p className="text-sm text-emerald-700 mt-0.5">
                  <span className="text-xs text-slate-500">결정 →</span> {a.decision}
                </p>
              ) : (
                <p className="text-sm text-slate-400 mt-0.5">결정 미정</p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="card p-5 bg-slate-50 border-slate-200">
        <h2 className="font-semibold text-slate-800 text-sm mb-2">설계 노트</h2>
        <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <li>• 안건마다 "결정" 필드 분리 — "회의했지만 뭘 결정했는지 모름" 사후 분쟁 방지</li>
          <li>• 마감 초과 회의(<code>overdue</code>) 는 cron으로 매일 알림 큐에 push</li>
          <li>• 회의 종결(<code>closed</code> 전이)은 capability <code>CAN_CLOSE_MEETING</code> 보유자만 가능 — 임원/이사 + admin 라인</li>
        </ul>
      </section>
    </div>
  );
}
