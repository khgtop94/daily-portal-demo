// Core domain types — anonymized for case-study demo

export type SessionType = "hq" | "worker" | "client";

export type Role =
  | "admin"
  | "support"
  | "operations"
  | "executive"
  | "director"
  | "manager"
  | "safety"
  | "staff";

export type Capability =
  | "CAN_APPROVE_HQ"
  | "CAN_APPROVE_OPS"
  | "CAN_APPROVE_CLIENT"
  | "CAN_CREATE_RECEIPT"
  | "CAN_MANAGE_ACCOUNT"
  | "CAN_VIEW_AUDIT_LOG"
  | "CAN_REVIEW_SAFETY"
  | "CAN_REGISTER_WORKER"
  | "CAN_MANAGE_CLIENT_PORTAL";

export type ApprovalState =
  | "draft"
  | "submitted"
  | "ops_approved"
  | "client_approved"
  | "hq_approved"
  | "ops_rejected"
  | "client_rejected"
  | "hq_rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  sessionType: SessionType;
  role?: Role; // for HQ users
  siteIds?: string[]; // sites this user has access to
}

export interface Site {
  id: string;
  name: string; // anonymized
  region: string;
}

export interface Receipt {
  id: string;
  siteId: string;
  yearMonth: string; // e.g. "2026-05"
  amount: number;
  description: string;
  submittedBy: string;
  state: ApprovalState;
  history: ApprovalEvent[];
}

export interface ApprovalEvent {
  at: string; // ISO timestamp
  by: string; // user id
  byRole: Role | "worker" | "client";
  from: ApprovalState;
  to: ApprovalState;
  comment?: string;
}

export interface AuditLogEntry {
  id: string;
  at: string;
  actor: string; // user id
  actorRole: Role | "worker" | "client";
  action: string;
  target: string;
  details?: Record<string, unknown>;
}
