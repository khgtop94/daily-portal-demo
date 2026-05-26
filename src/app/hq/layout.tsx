import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/lib/session";

export default async function HQLayout({ children }: { children: React.ReactNode }) {
  const user = await getActiveUser("hq");
  if (!user) {
    redirect("/login?tab=hq");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row gap-6">
        <aside className="sm:w-56 shrink-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
            HQ 메뉴
          </p>
          <nav className="space-y-0.5 text-sm">
            <NavItem href="/hq">대시보드</NavItem>
            <NavItem href="/hq/receipts">영수증 결재</NavItem>
            <NavItem href="/hq/permissions">권한 매트릭스</NavItem>
            <NavItem href="/hq/audit-log">감사 로그</NavItem>
          </nav>
          <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-medium text-slate-800 mb-1">현재 세션</p>
            <p>{user.name}</p>
            <p className="text-slate-500 mt-0.5">role : <span className="font-mono">{user.role}</span></p>
            <p className="text-slate-500">cookie : <span className="font-mono">dd_session</span></p>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 hover:text-brand-700"
    >
      {children}
    </Link>
  );
}
