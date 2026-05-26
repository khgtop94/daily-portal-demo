import Link from "next/link";
import { MOCK_MEETINGS, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import type { MeetingStatus } from "@/lib/types";

const STATUS_COLOR: Record<MeetingStatus, string> = {
  open:         "bg-blue-100 text-blue-700 border-blue-200",
  in_progress:  "bg-amber-100 text-amber-700 border-amber-200",
  closed:       "bg-emerald-100 text-emerald-700 border-emerald-200",
  overdue:      "bg-rose-100 text-rose-700 border-rose-200",
};
const STATUS_LABEL: Record<MeetingStatus, string> = {
  open: "예정", in_progress: "진행중", closed: "종결", overdue: "마감초과",
};

export default function MeetingsPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="회의록"
        subtitle="안건·결정·결재 일원화. 마감 초과 회의 자동 알림."
      />

      {MOCK_MEETINGS.length === 0 ? (
        <EmptyState title="회의 없음" icon="Meeting" />
      ) : (
        <div className="space-y-3">
          {MOCK_MEETINGS.map((m) => (
            <Link
              key={m.id}
              href={`/hq/meetings/${m.id}`}
              className="card p-4 block hover:border-brand-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"pill " + STATUS_COLOR[m.status]}>{STATUS_LABEL[m.status]}</span>
                    <span className="text-xs text-slate-500">{m.date}</span>
                    {m.dueDate && (
                      <span className="text-xs text-slate-400">· 마감 {m.dueDate}</span>
                    )}
                  </div>
                  <p className="font-medium text-slate-900">{m.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    참석 {m.attendees.length}명 · 안건 {m.agenda.length}건
                    {m.agenda.filter((a) => a.decision).length > 0 &&
                      ` · 결정 ${m.agenda.filter((a) => a.decision).length}건`}
                  </p>
                </div>
                <div className="flex -space-x-1.5 shrink-0">
                  {m.attendees.slice(0, 4).map((id) => {
                    const u = getUserById(id);
                    return (
                      <div
                        key={id}
                        className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white text-[10px] flex items-center justify-center text-slate-600 font-medium"
                        title={u?.name}
                      >
                        {u?.name.slice(0, 1)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
