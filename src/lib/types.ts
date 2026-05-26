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
  | "CAN_MANAGE_CLIENT_PORTAL"
  | "CAN_MANAGE_SITE"
  | "CAN_APPROVE_MATERIAL"
  | "CAN_CLOSE_MEETING";

export type ApprovalState =
  | "draft"
  | "submitted"
  | "ops_approved"
  | "client_approved"
  | "hq_approved"
  | "ops_rejected"
  | "client_rejected"
  | "hq_rejected";

export type JobType = "electrical" | "security" | "cleaning";

export interface User {
  id: string;
  name: string;
  email: string;
  sessionType: SessionType;
  role?: Role;
  siteIds?: string[];
  jobType?: JobType;
  phone?: string;
  active?: boolean;
}

export interface Site {
  id: string;
  name: string;
  region: string;
  clientName: string;
  jobType: JobType;
  workerCount: number;
  activeContract: boolean;
}

export interface Receipt {
  id: string;
  siteId: string;
  yearMonth: string;
  amount: number;
  description: string;
  submittedBy: string;
  state: ApprovalState;
  history: ApprovalEvent[];
  attachments: ReceiptAttachment[];
}

export interface ReceiptAttachment {
  id: string;
  filename: string;
  sizeKB: number;
  exif: {
    capturedAt: string;
    gps?: { lat: number; lng: number };
    verified: "ok" | "suspicious" | "missing";
    note?: string;
  };
}

export interface ApprovalEvent {
  at: string;
  by: string;
  byRole: Role | "worker" | "client";
  from: ApprovalState;
  to: ApprovalState;
  comment?: string;
}

export interface AuditLogEntry {
  id: string;
  at: string;
  actor: string;
  actorRole: Role | "worker" | "client";
  action: string;
  target: string;
  details?: Record<string, unknown>;
}

export interface DailyLog {
  id: string;
  siteId: string;
  workerId: string;
  date: string;        // YYYY-MM-DD
  shiftStart: string;  // HH:mm
  shiftEnd: string;    // HH:mm
  summary: string;
  safetyNote?: string;
  photos: number;
  exifIssues: number;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  siteId: string;
  date: string;
  clockIn: string;     // ISO
  clockOut?: string;   // ISO
  clockInGps?: { lat: number; lng: number };
  clockOutGps?: { lat: number; lng: number };
  flag?: "late" | "early_leave" | "ok";
}

export type MeetingStatus = "open" | "in_progress" | "closed" | "overdue";

export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string[]; // user ids
  agenda: { topic: string; decision: string | null }[];
  status: MeetingStatus;
  dueDate?: string;
}

export interface MaterialRequest {
  id: string;
  siteId: string;
  requestedBy: string;
  itemName: string;
  qty: number;
  unitPrice: number;
  state: "pending" | "approved" | "rejected" | "fulfilled";
  rejectReason?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
  createdAt: string;
  read: boolean;
  severity: "info" | "warning" | "danger";
}

export interface DailyIssue {
  id: string;
  siteId: string;
  title: string;
  description: string;
  raisedBy: string;
  raisedAt: string;
  status: "open" | "resolved" | "escalated";
  resolvedAt?: string;
}
