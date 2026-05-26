import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/lib/session";
import { Icon } from "@/components/Icon";

const MENU = [
  { href: "/worker",            label: "대시보드",   icon: "Home"      as const },
  { href: "/worker/logs",       label: "작업일지",    icon: "Clipboard" as const },
  { href: "/worker/attendance", label: "출퇴근",      icon: "Clock"     as const },
  { href: "/worker/receipts",   label: "내 영수증",   icon: "Receipt"   as const },
];

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const user = await getActiveUser("worker");
  if (!user) redirect("/login?tab=worker");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Mobile menu */}
      <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-1.5 pb-2 min-w-max">
          {MENU.map((item) => {
            const IconComp = Icon[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                <IconComp className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block lg:w-52 shrink-0">
          <nav className="space-y-0.5">
            {MENU.map((item) => {
              const IconComp = Icon[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
                >
                  <IconComp className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-medium text-slate-800 mb-1">현재 세션</p>
            <p>{user.name}</p>
            <p className="text-slate-500 mt-0.5">직무 : <span className="font-mono">{user.jobType}</span></p>
            <p className="text-slate-500">cookie : <span className="font-mono">dd_worker_session</span></p>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
