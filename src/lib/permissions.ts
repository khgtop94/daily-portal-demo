// Capability-based permission model — see ADR-0003 of case-study
import type { Capability, Role } from "./types";

// Each capability is a Set of roles allowed to perform the action.
// Adding a new feature = adding/extending a Set. No hierarchical inference.

export const CAPABILITIES: Record<Capability, ReadonlySet<Role>> = {
  CAN_APPROVE_HQ: new Set<Role>(["admin", "support"]),
  CAN_APPROVE_OPS: new Set<Role>(["admin", "support", "operations"]),
  CAN_APPROVE_CLIENT: new Set<Role>([]), // client-side only — not in HQ matrix
  CAN_CREATE_RECEIPT: new Set<Role>([
    "admin",
    "support",
    "operations",
    "manager",
  ]),
  CAN_MANAGE_ACCOUNT: new Set<Role>(["admin", "support"]),
  CAN_VIEW_AUDIT_LOG: new Set<Role>(["admin", "support", "executive"]),
  CAN_REVIEW_SAFETY: new Set<Role>([
    "admin",
    "support",
    "operations",
    "safety",
  ]),
  CAN_REGISTER_WORKER: new Set<Role>(["admin", "support", "operations"]),
  CAN_MANAGE_CLIENT_PORTAL: new Set<Role>(["admin", "support"]),
};

export function can(role: Role | undefined, capability: Capability): boolean {
  if (!role) return false;
  return CAPABILITIES[capability].has(role);
}

export const ALL_ROLES: readonly Role[] = [
  "admin",
  "support",
  "operations",
  "executive",
  "director",
  "manager",
  "safety",
  "staff",
];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin (시스템 관리자)",
  support: "Support (지원팀)",
  operations: "Operations (관리팀장)",
  executive: "Executive (임원)",
  director: "Director (이사)",
  manager: "Manager (매니저)",
  safety: "Safety (안전관리자)",
  staff: "Staff (일반 직원)",
};

export const ROLE_TIER: Record<Role, "vertical" | "horizontal"> = {
  admin: "vertical",
  support: "vertical",
  operations: "vertical",
  executive: "horizontal",
  director: "horizontal",
  manager: "horizontal",
  safety: "horizontal",
  staff: "horizontal",
};
