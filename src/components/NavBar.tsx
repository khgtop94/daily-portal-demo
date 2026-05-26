import Link from "next/link";
import { getAnySession } from "@/lib/session";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";

export default async function NavBar() {
  const session = await getAnySession();

  const unread =
    session?.type === "hq"
      ? MOCK_NOTIFICATIONS.filter((n) => n.userId === session.user.id && !n.read).length
      : 0;

  const homeForType = session
    ? session.type === "hq"
      ? "/hq"
      : session.type === "worker"
        ? "/worker"
        : "/client"
    : "/";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href={homeForType} className="font-semibold text-slate-900 whitespace-nowrap">
            Daily Portal <span className="text-xs text-slate-400 ml-1">demo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-600">
            <Link href="/architecture" className="hover:text-brand-600">아키텍처</Link>
            <Link href="/hq/permissions" className="hover:text-brand-600">권한 매트릭스</Link>
            <a
              href="https://github.com/khgtop94/daily-portal-case-study"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-600"
            >
              케이스 스터디 ↗
            </a>
          </nav>
        </div>
        <div className="text-sm flex items-center gap-3">
          {session ? (
            <>
              {session.type === "hq" && unread > 0 && (
                <Link
                  href="/hq/notifications"
                  className="relative inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100"
                  aria-label="알림"
                >
                  <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                    {unread}
                  </span>
                  <span className="text-lg">🔔</span>
                </Link>
              )}
              <span className="text-slate-600 hidden sm:inline">
                <span className="pill bg-slate-100 text-slate-700 border-slate-200 mr-2">
                  {session.type.toUpperCase()}
                </span>
                {session.user.name}
              </span>
              <Link href="/login" className="text-brand-600 hover:underline text-xs">
                전환
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-xs px-3 py-1.5">
              데모 체험 시작
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
