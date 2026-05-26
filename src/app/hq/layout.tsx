import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/lib/session";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

const MENU = [
  { href: "/hq",                label: "대시보드",       icon: "Home"        as const, group: "overview"  },
  { href: "/hq/receipts",       label: "영수증 결재",     icon: "Receipt"     as const, group: "approvals" },
  { href: "/hq/materials",      label: "자재 요청",       icon: "Box"         as const, group: "approvals" },
  { href: "/hq/meetings",       label: "회의록",         icon: "Meeting"     as const, group: "ops"       },
  { href: "/hq/issues",         label: "일일 이슈",      icon: "Warning"     as const, group: "ops"       },
  { href: "/hq/attendance",     label: "출퇴근 조회",    icon: "Clock"       as const, group: "ops"       },
  { href: "/hq/users",          label: "사용자 관리",    icon: "Users"       as const, group: "admin"     },
  { href: "/hq/sites",          label: "사이트 관리",    icon: "Site"        as const, group: "admin"     },
  { href: "/hq/permissions",    label: "권한 매트릭스",   icon: "Shield"      as const, group: "admin"     },
  { href: "/hq/notifications",  label: "알림",          icon: "Bell"        as const, group: "personal"  },
  { href: "/hq/audit-log",      label: "감사 로그",      icon: "Audit"       as const, group: "admin"     },
];

const GROUP_LABEL: Record<string, string> = {
  overview:  "개요",
  approvals: "결재",
  ops:       "운영",
  admin:     "관리",
  personal:  "개인",
};

export default async function HQLayout({ children }: { children: React.ReactNode }) {
  const user = await getActiveUser("hq");
  if (!user) {
    redirect("/login?tab=hq");
  }

  const unread = MOCK_NOTIFICATIONS.filter((n) => n.userId === user.id && !n.read).length;

  const groups = MENU.reduce<Record<string, typeof MENU>>((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Mobile menu — horizontal scrollable chips */}
      <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-1.5 pb-2 min-w-max">
          {MENU.map((item) => {
            const IconComp = Icon[item.icon];
            const isBell = item.href === "/hq/notifications";
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                <IconComp className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.label}</span>
                {isBell && unread > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white rounded-full px-1.5 leading-none">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-60 shrink-0">
          <nav className="space-y-4">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                  {GROUP_LABEL[group]}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const IconComp = Icon[item.icon];
                    const isBell = item.href === "/hq/notifications";
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition"
                      >
                        <IconComp className="w-4 h-4 text-slate-400" />
                        <span className="flex-1">{item.label}</span>
                        {isBell && unread > 0 && (
                          <span className="text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                            {unread}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
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
