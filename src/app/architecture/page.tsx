export default function ArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">아키텍처 & 설계 의도</h1>
        <p className="text-slate-600">
          Daily Portal의 핵심 설계 결정 3가지. 자세한 ADR은{" "}
          <a className="text-brand-600 hover:underline" href="https://github.com/khgtop94/daily-portal-case-study/tree/main/ADR" target="_blank" rel="noreferrer">
            케이스 스터디 레포의 ADR 디렉토리
          </a>{" "}
          에 있습니다.
        </p>
      </header>

      {/* ADR-0001 */}
      <Section title="① Supabase + RLS 선택 — 2중 권한 방어">
        <p>
          1인 개발자가 운영하는 시스템에서 가장 큰 사고 가능성은{" "}
          <strong>애플리케이션 권한 체크 누락</strong> 입니다. 단일 레이어 방어는 어디선가 빼먹을
          확률이 0이 아닙니다.
        </p>
        <p>
          그래서 Supabase + PostgreSQL <code>RLS(Row Level Security)</code>를 선택해 권한을
          <strong> DB 레이어까지 두 번 체크</strong>합니다. 애플리케이션 버그가 권한 우회로
          직결되지 않는 구조.
        </p>
        <CodeBlock language="sql" code={`-- 도급 근무자는 자기 작업일지만 조회 가능
CREATE POLICY "workers_own_logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = worker_id);

-- 발주처는 권한 부여된 사이트만 조회
CREATE POLICY "clients_authorized_sites"
  ON receipts FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM client_site_permissions
      WHERE client_id = auth.uid()
    )
  );`} />
      </Section>

      {/* ADR-0002 */}
      <Section title="② 3-tier 세션 분리 — 단일 토큰 도용으로 권한 상승 불가">
        <p>
          본사/도급/발주처 세 그룹의 세션을 <strong>완전히 분리된 쿠키</strong>로 발급합니다.
          같은 사람이 본사 직원이자 발주처 담당자여도 두 신분은 서로 격리.
        </p>
        <FlowDiagram
          steps={[
            { label: "통합 로그인 화면", note: "/login" },
            { label: "본사 탭 → dd_session", note: "관리·결재" },
            { label: "도급 탭 → dd_worker_session", note: "현장 작업" },
            { label: "발주처 탭 → dd_client_session", note: "사이트 모니터링" },
          ]}
        />
        <CodeBlock language="typescript" code={`// middleware.ts (개념도)
export async function middleware(req: NextRequest) {
  const session = await detectSession(req.cookies)

  // HQ 영역은 dd_session 만 접근
  if (req.nextUrl.pathname.startsWith('/hq') && session?.type !== 'hq') {
    return NextResponse.redirect(new URL('/login?tab=hq', req.url))
  }
  // ... (worker, client 동일 패턴)
}`} />
        <p className="text-sm text-slate-500">
          💡 데모 사이트에서 개발자 도구 → Application → Cookies 를 열면 세 쿠키가 독립
          발급되는 것을 직접 확인할 수 있습니다.
        </p>
      </Section>

      {/* ADR-0003 */}
      <Section title="③ Capability 집합 기반 권한 — 위계 추론 없음">
        <p>
          역할 위계 (admin {">"} support {">"} ...) 추론 없이, 각 capability를{" "}
          <strong>역할 Set</strong> 으로 직접 정의합니다. 새 기능 = 새 Set. 추론 코드 0줄.
        </p>
        <CodeBlock language="typescript" code={`const CAN_APPROVE_HQ  = new Set(['admin', 'support'])
const CAN_APPROVE_OPS = new Set(['admin', 'support', 'operations'])
const CAN_REVIEW_SAFETY = new Set(['admin', 'support', 'operations', 'safety'])

export const can = (role, cap) => CAPABILITIES[cap].has(role)

// 사용
if (!can(user.role, 'CAN_APPROVE_HQ')) {
  throw new ForbiddenError()
}`} />
        <p>
          데모 페이지 →{" "}
          <a href="/hq/permissions" className="text-brand-600 hover:underline">
            8단계 권한 매트릭스
          </a>{" "}
          (역할 클릭 시 capability 하이라이트)
        </p>
      </Section>

      {/* State machine */}
      <Section title="④ 결재 흐름 — 명시적 5단계 상태 머신">
        <p>
          영수증 결재는 단계 건너뛰기 차단을 위해 상태 머신으로 명시 모델링.
          모든 전이는 PostgreSQL trigger로 <code>audit_log</code>에 자동 기록.
        </p>
        <FlowDiagram
          steps={[
            { label: "draft", note: "작성중" },
            { label: "submitted", note: "제출" },
            { label: "ops_approved", note: "관리팀장 승인" },
            { label: "client_approved", note: "발주처 승인" },
            { label: "hq_approved", note: "본사 최종" },
          ]}
        />
        <p className="text-sm text-slate-500">
          각 단계 반려 (<code>ops_rejected</code> 등) 시 사유 NOT NULL.
          <code> UNIQUE(site_id, year_month) </code>로 중복 결재 사전 차단.
        </p>
        <p>
          데모 페이지 →{" "}
          <a href="/hq/receipts" className="text-brand-600 hover:underline">
            영수증 결재 (5건의 가상 영수증)
          </a>
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-4 text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-3 py-1 text-xs font-mono text-slate-500 border-b border-slate-200">
        {language}
      </div>
      <pre className="text-xs bg-slate-900 text-slate-100 p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FlowDiagram({ steps }: { steps: { label: string; note: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1 my-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="border border-slate-300 rounded-md px-3 py-1.5 bg-white text-center min-w-[110px]">
            <p className="text-xs font-mono text-slate-800">{s.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.note}</p>
          </div>
          {i < steps.length - 1 && <span className="text-slate-400">→</span>}
        </div>
      ))}
    </div>
  );
}
