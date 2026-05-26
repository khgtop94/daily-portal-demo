import Link from "next/link";

export default function ArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">아키텍처 & 설계 의도</h1>
        <p className="text-slate-600">
          Daily Portal의 핵심 설계 결정. 자세한 ADR은{" "}
          <a className="text-brand-600 hover:underline" href="https://github.com/khgtop94/daily-portal-case-study/tree/main/ADR" target="_blank" rel="noreferrer">
            케이스 스터디 레포의 ADR 디렉토리
          </a>{" "}
          에 있습니다.
        </p>
      </header>

      {/* Quick nav */}
      <nav className="card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">목차</p>
        <ul className="text-sm grid sm:grid-cols-2 gap-1.5">
          <li><a href="#supabase" className="text-brand-600 hover:underline">① Supabase + RLS</a></li>
          <li><a href="#three-tier" className="text-brand-600 hover:underline">② 3-tier 세션 분리</a></li>
          <li><a href="#permissions" className="text-brand-600 hover:underline">③ Capability 권한</a></li>
          <li><a href="#state-machine" className="text-brand-600 hover:underline">④ 결재 상태 머신</a></li>
          <li><a href="#data-model" className="text-brand-600 hover:underline">⑤ 데이터 모델 (ERD)</a></li>
          <li><a href="#exif" className="text-brand-600 hover:underline">⑥ EXIF 위변조 검증</a></li>
          <li><a href="#migration" className="text-brand-600 hover:underline">⑦ 마이그레이션 전략 (GAS → 신 포털)</a></li>
          <li><a href="#audit" className="text-brand-600 hover:underline">⑧ 감사 로그 + 트리거</a></li>
        </ul>
      </nav>

      <Section id="supabase" title="① Supabase + RLS 선택 — 2중 권한 방어">
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
  );

-- 안전관리자(safety)는 safety_note가 있는 일지 추가 검토 가능
CREATE POLICY "safety_review_logs"
  ON daily_logs FOR SELECT
  USING (
    (SELECT role FROM hq_users WHERE user_id = auth.uid()) = 'safety'
    AND safety_note IS NOT NULL
  );`} />
      </Section>

      <Section id="three-tier" title="② 3-tier 세션 분리 — 단일 토큰 도용으로 권한 상승 불가">
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
  if (req.nextUrl.pathname.startsWith('/worker') && session?.type !== 'worker') {
    return NextResponse.redirect(new URL('/login?tab=worker', req.url))
  }
  // ... (client 동일)
}`} />
        <Note>
          💡 데모 사이트에서 개발자 도구 → Application → Cookies 를 열면 세 쿠키가 독립
          발급되는 것을 직접 확인할 수 있습니다.
        </Note>
      </Section>

      <Section id="permissions" title="③ Capability 집합 기반 권한 — 위계 추론 없음">
        <p>
          역할 위계 (admin {">"} support {">"} ...) 추론 없이, 각 capability를{" "}
          <strong>역할 Set</strong> 으로 직접 정의합니다. 새 기능 = 새 Set. 추론 코드 0줄.
        </p>
        <CodeBlock language="typescript" code={`const CAPABILITIES = {
  CAN_APPROVE_HQ:        new Set(['admin', 'support']),
  CAN_APPROVE_OPS:       new Set(['admin', 'support', 'operations']),
  CAN_REVIEW_SAFETY:     new Set(['admin', 'support', 'operations', 'safety']),
  CAN_APPROVE_MATERIAL:  new Set(['admin', 'support', 'operations']),
  CAN_CLOSE_MEETING:     new Set(['admin', 'support', 'operations', 'executive', 'director']),
} as const

export const can = (role, cap) => CAPABILITIES[cap].has(role)

// 사용
if (!can(user.role, 'CAN_APPROVE_HQ')) {
  throw new ForbiddenError()
}`} />
        <p>
          데모 페이지 →{" "}
          <Link href="/hq/permissions" className="text-brand-600 hover:underline">
            8단계 권한 매트릭스
          </Link>{" "}
          (역할 클릭 시 capability 하이라이트)
        </p>
      </Section>

      <Section id="state-machine" title="④ 결재 흐름 — 명시적 5단계 상태 머신">
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
        <Note>
          각 단계 반려 (<code>ops_rejected</code> 등) 시 사유 NOT NULL.
          <code> UNIQUE(site_id, year_month) </code>로 중복 결재 사전 차단.
        </Note>
        <p>
          데모 페이지 →{" "}
          <Link href="/hq/receipts" className="text-brand-600 hover:underline">
            영수증 결재 (필터·검색·승인/반려 가능)
          </Link>
        </p>
      </Section>

      <Section id="data-model" title="⑤ 핵심 데이터 모델 (ERD 발췌)">
        <p>주요 테이블 관계. 모든 결재·근태·일지는 사용자·사이트·시간을 키로 묶입니다.</p>
        <CodeBlock language="text" code={`┌────────────┐     ┌──────────────┐     ┌───────────┐
│ hq_users   │     │ worker_users │     │ clients   │
│  - id      │     │  - id        │     │  - id     │
│  - role(8) │     │  - job_type  │     │           │
└─────┬──────┘     └──────┬───────┘     └─────┬─────┘
      │                   │                   │
      │ writes            │ assigned          │ has access
      ▼                   ▼                   ▼
┌───────────────────────────────────────────────────┐
│ sites                                             │
│  - id, name, region, client_id, job_type, gps     │
└───────────────────────────┬───────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌─────────────┐  ┌────────────┐  ┌──────────────┐
    │ daily_logs  │  │ attendance │  │ receipts     │
    │  - worker   │  │  - worker  │  │  - site      │
    │  - photos[] │  │  - gps     │  │  - year_month│
    │  - safety   │  │  - flag    │  │  - state(SM) │
    │             │  │            │  │  - history[] │
    └─────────────┘  └────────────┘  └──────────────┘
            │               │               │
            └───────────────┴───────────────┘
                            ▼
                    ┌──────────────┐
                    │  audit_log   │  ← trigger 자동 기록
                    │  - actor     │
                    │  - action    │
                    │  - target    │
                    │  - at        │
                    └──────────────┘`} />
        <Note>
          모든 mutation 테이블에는 trigger로 <code>audit_log</code> 자동 insert.
          애플리케이션이 잊어버려도 누락 없음.
        </Note>
      </Section>

      <Section id="exif" title="⑥ 사진 EXIF 위변조 검증 — 도메인 특수 설계">
        <p>
          작업일지·영수증에 첨부되는 사진은 단순 기록물이 아니라{" "}
          <strong>법정 점검·안전 입증 자료</strong>가 될 수 있습니다. EXIF의 촬영시각·GPS를 검증하지 않으면,
          사후에 작성한 사진이 "그날 점검한 증거"로 둔갑할 위험이 있습니다.
        </p>
        <FlowDiagram
          steps={[
            { label: "사진 업로드", note: "worker" },
            { label: "EXIF 파싱", note: "촬영시각/GPS" },
            { label: "사이트 좌표 대조", note: "반경 100m" },
            { label: "정상 / 의심", note: "분기" },
            { label: "HQ 리뷰 큐", note: "의심 시" },
          ]}
        />
        <CodeBlock language="typescript" code={`// 첨부 사진 EXIF 검증 (개념도)
async function verifyAttachment(photo: Buffer, site: Site) {
  const exif = await parseExif(photo)
  if (!exif.gps) {
    return { verified: 'missing', note: 'GPS 정보 없음' }
  }
  const dist = haversine(exif.gps, site.gps)
  if (dist > 100) {
    return { verified: 'suspicious', note: \`사이트 좌표와 \${dist}m 차이\` }
  }
  const ageMin = (Date.now() - new Date(exif.capturedAt)) / 60_000
  if (ageMin > 60 * 24) {
    return { verified: 'suspicious', note: '24시간 이상 지난 사진' }
  }
  return { verified: 'ok' }
}

// 의심 → 안전관리자 검토 큐로 라우팅
if (result.verified !== 'ok') {
  await enqueueSafetyReview(receiptId, attachmentId, result.note)
  await notifyRole('safety', \`EXIF 의심 첨부 1건\`, \`/hq/receipts/\${receiptId}\`)
}`} />
        <p>
          데모 페이지 →{" "}
          <Link href="/hq/receipts/r-004" className="text-brand-600 hover:underline">
            결재 상세 r-004 (EXIF GPS 누락 사례)
          </Link>
        </p>
      </Section>

      <Section id="migration" title="⑦ 마이그레이션 전략 — GAS → 신 포털 9단계">
        <p>
          모트라스 도메인은 처음 Google Apps Script + Sheets로 빠르게 자동화한 뒤,
          Next.js + Supabase 신 포털로 단계적으로 옮기는 중. 1인 운영 환경에서
          <strong> 한 번에 전환 = 사고 위험 최대 </strong>이므로 9단계로 잘게 쪼개 단계별 검증/롤백.
        </p>
        <CodeBlock language="text" code={`Phase 1 — 기능 인벤토리             ✅ 완료
Phase 2 — 데이터 모델 매핑          ✅ 완료
Phase 3 — 마이그레이션 스크립트     ✅ 완료
Phase 4 — 세션 분리 적용 (3-tier)   ✅ 완료
Phase 5 — 사진 EXIF 검증 적용       ✅ 완료
Phase 6 — 결재 흐름 신 포털 통합     🚧 진행중
Phase 7 — 사이트 단위 권한 토글     🚧 진행중
Phase 8 — 사진 썸네일 카드 UI       🚧 진행중
Phase 9 — GAS read-only → 폐지       ⏳ 대기`} />
        <Note>
          각 Phase는 별도 PR로 분리, 운영 중 사이트 일부에만 활성화 후 검증 → 전체 확산.
          롤백 트리거가 항상 준비됨.
        </Note>
      </Section>

      <Section id="audit" title="⑧ 감사 로그 + DB 트리거">
        <p>
          애플리케이션 코드에서 매번 <code>auditLog.insert()</code> 호출하면 어딘가에서 빼먹습니다.
          그래서 DB <strong>trigger 로 자동 기록</strong>합니다.
        </p>
        <CodeBlock language="sql" code={`CREATE OR REPLACE FUNCTION log_receipt_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (actor, actor_role, action, target, at, details)
  VALUES (
    current_setting('app.current_user_id'),
    current_setting('app.current_user_role'),
    CASE
      WHEN NEW.state = 'hq_approved' THEN 'FINAL_APPROVE_RECEIPT'
      WHEN NEW.state LIKE '%_rejected' THEN 'REJECT_RECEIPT'
      ELSE 'APPROVE_RECEIPT'
    END,
    NEW.id,
    NOW(),
    jsonb_build_object('from', OLD.state, 'to', NEW.state)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER receipts_audit
  AFTER UPDATE ON receipts
  FOR EACH ROW
  WHEN (OLD.state IS DISTINCT FROM NEW.state)
  EXECUTE FUNCTION log_receipt_change();`} />
        <p>
          데모 페이지 →{" "}
          <Link href="/hq/audit-log" className="text-brand-600 hover:underline">
            감사 로그
          </Link>{" "}
          (영수증 승인/반려 후 즉시 반영)
        </p>
      </Section>
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="card p-6 scroll-mt-20">
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
          <div className="border border-slate-300 rounded-md px-3 py-1.5 bg-white text-center min-w-[120px]">
            <p className="text-xs font-mono text-slate-800">{s.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.note}</p>
          </div>
          {i < steps.length - 1 && <span className="text-slate-400">→</span>}
        </div>
      ))}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-600">
      {children}
    </div>
  );
}
