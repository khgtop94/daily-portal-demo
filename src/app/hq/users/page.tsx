import Link from "next/link";
import { MOCK_USERS, MOCK_SITES } from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import PageHeader from "@/components/PageHeader";
import { Icon } from "@/components/Icon";

const TYPE_COLOR: Record<string, string> = {
  hq:     "bg-brand-100 text-brand-700 border-brand-200",
  worker: "bg-amber-100 text-amber-700 border-amber-200",
  client: "bg-purple-100 text-purple-700 border-purple-200",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await getActiveUser("hq");
  if (!user) return null;
  const { type } = await searchParams;
  const filter: "all" | "hq" | "worker" | "client" =
    type === "hq" || type === "worker" || type === "client" ? type : "all";
  const canManage = can(user.role, "CAN_MANAGE_ACCOUNT");

  const filtered =
    filter === "all" ? MOCK_USERS : MOCK_USERS.filter((u) => u.sessionType === filter);

  const counts = {
    all:    MOCK_USERS.length,
    hq:     MOCK_USERS.filter((u) => u.sessionType === "hq").length,
    worker: MOCK_USERS.filter((u) => u.sessionType === "worker").length,
    client: MOCK_USERS.filter((u) => u.sessionType === "client").length,
  };

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="사용자 관리"
        subtitle={`전체 ${counts.all}명 · capability CAN_MANAGE_ACCOUNT 보유자만 변경 가능`}
        actions={
          canManage ? (
            <button className="btn-primary text-sm" disabled>
              <Icon.Users className="w-4 h-4" /> 신규 등록 (데모)
            </button>
          ) : null
        }
      />

      <div className="flex gap-1.5 text-sm">
        <FilterChip href="/hq/users" label={`전체 ${counts.all}`} active={filter === "all"} />
        <FilterChip href="/hq/users?type=hq" label={`본사 ${counts.hq}`} active={filter === "hq"} />
        <FilterChip href="/hq/users?type=worker" label={`도급 ${counts.worker}`} active={filter === "worker"} />
        <FilterChip href="/hq/users?type=client" label={`발주처 ${counts.client}`} active={filter === "client"} />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="table-header">유형</th>
              <th className="table-header">이름</th>
              <th className="table-header">이메일</th>
              <th className="table-header">역할 / 직무</th>
              <th className="table-header">배정 사이트</th>
              <th className="table-header text-center">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const sites = (u.siteIds || [])
                .map((id) => MOCK_SITES.find((s) => s.id === id))
                .filter((s): s is NonNullable<typeof s> => !!s);
              return (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="table-cell">
                    <span className={"pill " + TYPE_COLOR[u.sessionType]}>{u.sessionType}</span>
                  </td>
                  <td className="table-cell text-slate-800">{u.name}</td>
                  <td className="table-cell text-slate-500 text-xs">{u.email}</td>
                  <td className="table-cell text-slate-700 text-xs">
                    {u.role && <span className="font-mono">{u.role}</span>}
                    {u.jobType && <span className="ml-1 text-slate-400">· {u.jobType}</span>}
                  </td>
                  <td className="table-cell text-xs text-slate-600">
                    {sites.length === 0 ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      sites.map((s) => s.name).join(", ")
                    )}
                  </td>
                  <td className="table-cell text-center">
                    {u.active ? (
                      <span className="text-emerald-600">●</span>
                    ) : (
                      <span className="text-slate-300">○</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        💡 실 운영 시 신규 등록 → 임시 비밀번호 생성 → 첫 로그인 시 강제 변경 흐름.
        도급 등록은 별도 capability(<code>CAN_REGISTER_WORKER</code>) 필요.
      </p>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        "px-3 py-1.5 rounded-lg border " +
        (active
          ? "bg-brand-50 border-brand-300 text-brand-700"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300")
      }
    >
      {label}
    </Link>
  );
}
