// In-memory mock data for demo — no database, no real users
// Anonymized: company/site/person names are fictional

import type { User, Site, Receipt, AuditLogEntry } from "./types";

export const MOCK_SITES: Site[] = [
  { id: "site-001", name: "ACME 산업 1공장 (전기)",   region: "경기 화성" },
  { id: "site-002", name: "ACME 산업 2공장 (전기)",   region: "경기 화성" },
  { id: "site-003", name: "북부 물류센터 (보안)",     region: "경기 평택" },
  { id: "site-004", name: "남부 데이터센터 (전기)",   region: "충남 천안" },
  { id: "site-005", name: "동부 오피스타워 (청소)",   region: "서울 강남" },
];

export const MOCK_USERS: User[] = [
  // HQ
  { id: "u-hq-1", name: "김본사 (Admin)",       email: "admin@daily-demo.test",       sessionType: "hq",     role: "admin"      },
  { id: "u-hq-2", name: "이지원 (Support)",     email: "support@daily-demo.test",     sessionType: "hq",     role: "support"    },
  { id: "u-hq-3", name: "박관리 (Operations)",  email: "ops@daily-demo.test",         sessionType: "hq",     role: "operations" },
  { id: "u-hq-4", name: "최임원 (Executive)",   email: "exec@daily-demo.test",        sessionType: "hq",     role: "executive"  },
  { id: "u-hq-5", name: "정안전 (Safety)",      email: "safety@daily-demo.test",      sessionType: "hq",     role: "safety"     },
  { id: "u-hq-6", name: "한직원 (Staff)",       email: "staff@daily-demo.test",       sessionType: "hq",     role: "staff"      },
  // Worker
  { id: "u-wk-1", name: "도급근무자 A",         email: "worker-a@daily-demo.test",    sessionType: "worker", siteIds: ["site-001", "site-002"] },
  { id: "u-wk-2", name: "도급근무자 B",         email: "worker-b@daily-demo.test",    sessionType: "worker", siteIds: ["site-003"] },
  // Client
  { id: "u-cl-1", name: "ACME 산업 담당자",     email: "client-acme@daily-demo.test", sessionType: "client", siteIds: ["site-001", "site-002"] },
  { id: "u-cl-2", name: "북부물류 담당자",      email: "client-nl@daily-demo.test",   sessionType: "client", siteIds: ["site-003"] },
];

export const MOCK_RECEIPTS: Receipt[] = [
  {
    id: "r-001",
    siteId: "site-001",
    yearMonth: "2026-05",
    amount: 1_240_000,
    description: "5월분 전기시설 유지보수 자재비",
    submittedBy: "u-wk-1",
    state: "ops_approved",
    history: [
      { at: "2026-05-21T09:12:00+09:00", by: "u-wk-1",  byRole: "worker",     from: "draft",     to: "submitted",    comment: "현장 영수증 12건 첨부" },
      { at: "2026-05-22T14:30:00+09:00", by: "u-hq-3",  byRole: "operations", from: "submitted", to: "ops_approved", comment: "현장 검증 완료" },
    ],
  },
  {
    id: "r-002",
    siteId: "site-002",
    yearMonth: "2026-05",
    amount: 820_500,
    description: "5월분 발전기 점검 부품",
    submittedBy: "u-wk-1",
    state: "submitted",
    history: [
      { at: "2026-05-24T17:45:00+09:00", by: "u-wk-1", byRole: "worker", from: "draft", to: "submitted" },
    ],
  },
  {
    id: "r-003",
    siteId: "site-003",
    yearMonth: "2026-04",
    amount: 450_000,
    description: "4월분 보안카메라 교체 자재",
    submittedBy: "u-wk-2",
    state: "hq_approved",
    history: [
      { at: "2026-04-30T19:00:00+09:00", by: "u-wk-2", byRole: "worker",     from: "draft",            to: "submitted" },
      { at: "2026-05-02T10:10:00+09:00", by: "u-hq-3", byRole: "operations", from: "submitted",        to: "ops_approved" },
      { at: "2026-05-05T11:20:00+09:00", by: "u-cl-2", byRole: "client",     from: "ops_approved",     to: "client_approved" },
      { at: "2026-05-07T16:00:00+09:00", by: "u-hq-1", byRole: "admin",      from: "client_approved",  to: "hq_approved" },
    ],
  },
  {
    id: "r-004",
    siteId: "site-001",
    yearMonth: "2026-04",
    amount: 2_100_000,
    description: "4월분 한전 변압기 교체 공사비",
    submittedBy: "u-wk-1",
    state: "client_rejected",
    history: [
      { at: "2026-04-28T12:00:00+09:00", by: "u-wk-1", byRole: "worker",     from: "draft",            to: "submitted" },
      { at: "2026-04-29T10:00:00+09:00", by: "u-hq-3", byRole: "operations", from: "submitted",        to: "ops_approved" },
      { at: "2026-05-02T15:30:00+09:00", by: "u-cl-1", byRole: "client",     from: "ops_approved",     to: "client_rejected", comment: "사전 견적 대비 18% 초과 — 사유 보고 요청" },
    ],
  },
  {
    id: "r-005",
    siteId: "site-004",
    yearMonth: "2026-05",
    amount: 3_500_000,
    description: "5월분 UPS 모듈 교체",
    submittedBy: "u-wk-2",
    state: "client_approved",
    history: [
      { at: "2026-05-15T11:00:00+09:00", by: "u-wk-2", byRole: "worker",     from: "draft",            to: "submitted" },
      { at: "2026-05-16T09:30:00+09:00", by: "u-hq-3", byRole: "operations", from: "submitted",        to: "ops_approved" },
      { at: "2026-05-18T13:00:00+09:00", by: "u-cl-1", byRole: "client",     from: "ops_approved",     to: "client_approved" },
    ],
  },
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: "a-001", at: "2026-05-26T09:01:00+09:00", actor: "u-hq-1", actorRole: "admin",      action: "GRANT_PORTAL_ACCESS", target: "u-cl-1", details: { sites: ["site-001", "site-002"] } },
  { id: "a-002", at: "2026-05-25T16:40:00+09:00", actor: "u-hq-2", actorRole: "support",    action: "CREATE_WORKER",       target: "u-wk-2" },
  { id: "a-003", at: "2026-05-22T14:30:00+09:00", actor: "u-hq-3", actorRole: "operations", action: "APPROVE_RECEIPT",     target: "r-001" },
  { id: "a-004", at: "2026-05-07T16:00:00+09:00", actor: "u-hq-1", actorRole: "admin",      action: "FINAL_APPROVE_RECEIPT", target: "r-003" },
  { id: "a-005", at: "2026-05-02T15:30:00+09:00", actor: "u-cl-1", actorRole: "client",     action: "REJECT_RECEIPT",      target: "r-004", details: { reason: "사전 견적 초과" } },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getSiteById(id: string): Site | undefined {
  return MOCK_SITES.find((s) => s.id === id);
}
