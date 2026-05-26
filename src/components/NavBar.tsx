import Link from "next/link";
import { getAnySession } from "@/lib/session";

export default async function NavBar() {
  const session = await getAnySession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold text-slate-900">
            Daily Portal <span className="text-xs text-slate-400 ml-1">demo</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm text-slate-600">
            <Link href="/architecture" className="hover:text-brand-600">아키텍처</Link>
            <Link href="/hq/permissions" className="hover:text-brand-600">권한 매트릭스</Link>
            <Link href="/hq/receipts" className="hover:text-brand-600">결재 흐름</Link>
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
        <div className="text-sm">
          {session ? (
            <span className="text-slate-600">
              <span className="pill bg-slate-100 text-slate-700 border-slate-200 mr-2">
                {session.type.toUpperCase()}
              </span>
              {session.user.name}
              <Link
                href="/login"
                className="ml-3 text-brand-600 hover:underline"
              >
                전환
              </Link>
            </span>
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
