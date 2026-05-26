import Link from "next/link";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { markRead, markAllRead } from "./actions";

const SEV_COLOR: Record<string, string> = {
  info:    "bg-slate-100 text-slate-700 border-slate-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger:  "bg-rose-100 text-rose-700 border-rose-200",
};

export default async function NotificationsPage() {
  const user = await getActiveUser("hq");
  if (!user) return null;

  const mine = MOCK_NOTIFICATIONS.filter((n) => n.userId === user.id).sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
  const unreadCount = mine.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="알림"
        subtitle={`${user.name} 님 앞 ${mine.length}건 (미확인 ${unreadCount}건)`}
        actions={
          unreadCount > 0 ? (
            <form action={markAllRead}>
              <input type="hidden" name="userId" value={user.id} />
              <button className="btn-secondary text-sm">전체 읽음 처리</button>
            </form>
          ) : null
        }
      />

      {mine.length === 0 ? (
        <EmptyState title="알림 없음" icon="Bell" />
      ) : (
        <ul className="space-y-2">
          {mine.map((n) => (
            <li
              key={n.id}
              className={
                "card p-4 " + (n.read ? "opacity-70" : "border-l-4 border-l-brand-500")
              }
            >
              <div className="flex items-start gap-3">
                <span className={"pill shrink-0 " + SEV_COLOR[n.severity]}>{n.severity}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{n.body}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                  {n.link && (
                    <Link href={n.link} className="text-xs text-brand-600 hover:underline mt-1 inline-block">
                      바로 이동 →
                    </Link>
                  )}
                </div>
                {!n.read && (
                  <form action={markRead}>
                    <input type="hidden" name="id" value={n.id} />
                    <button className="btn-secondary text-xs px-2 py-1">읽음</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
