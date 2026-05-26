import { MOCK_USERS } from "@/lib/mock-data";
import type { SessionType } from "@/lib/types";
import { loginAs, logout } from "./actions";

const TABS: { type: SessionType; label: string; hint: string }[] = [
  { type: "hq",     label: "본사 (HQ)",     hint: "관리·결재 권한군 (8단계 역할)" },
  { type: "worker", label: "도급 (Worker)", hint: "현장 작업 — 작업일지·근태·영수증 작성" },
  { type: "client", label: "발주처 (Client)", hint: "사이트별 모니터링·영수증 검토" },
];

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">데모 체험 — 역할 선택</h1>
      <p className="text-slate-600 mb-8">
        실제 시스템은 이메일·비밀번호 + 2FA로 로그인하지만, 본 데모는 클릭만으로 역할을
        전환할 수 있습니다.{" "}
        <strong className="text-slate-800">
          세 종류의 세션 쿠키(<code>dd_session</code>, <code>dd_worker_session</code>,{" "}
          <code>dd_client_session</code>)
        </strong>{" "}
        가 독립적으로 발급되는 것을 개발자 도구 → Application → Cookies 에서 확인할 수 있습니다.
      </p>

      <TabSwitch searchParams={searchParams} />
    </div>
  );
}

async function TabSwitch({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = (params.tab as SessionType) || "hq";

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map((t) => (
          <a
            key={t.type}
            href={`/login?tab=${t.type}`}
            className={
              "px-5 py-3 text-sm font-medium border-b-2 -mb-px " +
              (activeTab === t.type
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500 hover:text-slate-700")
            }
          >
            {t.label}
          </a>
        ))}
      </div>

      {/* Content */}
      {TABS.map((t) =>
        t.type === activeTab ? (
          <div key={t.type} className="card p-6 mt-6">
            <p className="text-sm text-slate-500 mb-4">{t.hint}</p>
            <div className="space-y-2">
              {MOCK_USERS.filter((u) => u.sessionType === t.type).map((u) => (
                <form key={u.id} action={loginAs}>
                  <input type="hidden" name="userId" value={u.id} />
                  <button
                    type="submit"
                    className="w-full text-left border border-slate-200 rounded-lg px-4 py-3 hover:border-brand-300 hover:bg-brand-50/40 transition flex items-center justify-between"
                  >
                    <span>
                      <span className="font-medium text-slate-900">{u.name}</span>
                      <span className="ml-3 text-xs text-slate-500">{u.email}</span>
                    </span>
                    {u.role && (
                      <span className="pill bg-slate-100 text-slate-700 border-slate-200">
                        {u.role}
                      </span>
                    )}
                  </button>
                </form>
              ))}
            </div>
            <form action={logout} className="mt-5 pt-5 border-t border-slate-100">
              <input type="hidden" name="type" value={t.type} />
              <button type="submit" className="btn-secondary text-xs">
                이 세션 로그아웃
              </button>
            </form>
          </div>
        ) : null
      )}
    </>
  );
}
