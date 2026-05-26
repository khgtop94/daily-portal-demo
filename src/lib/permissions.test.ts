import { describe, it, expect } from "vitest";
import { can, CAPABILITIES, ALL_ROLES, ROLE_TIER } from "./permissions";
import type { Role } from "./types";

describe("permissions / capability model", () => {
  describe("can()", () => {
    it("returns true when role is in the capability set", () => {
      expect(can("admin",   "CAN_APPROVE_HQ")).toBe(true);
      expect(can("support", "CAN_APPROVE_HQ")).toBe(true);
    });

    it("returns false when role is NOT in the capability set", () => {
      expect(can("staff",      "CAN_APPROVE_HQ")).toBe(false);
      expect(can("operations", "CAN_APPROVE_HQ")).toBe(false);
      expect(can("manager",    "CAN_APPROVE_HQ")).toBe(false);
    });

    it("returns false when role is undefined", () => {
      expect(can(undefined, "CAN_APPROVE_HQ")).toBe(false);
    });

    it("separates system capabilities from business capabilities", () => {
      // executive can close meetings but cannot manage accounts (system)
      expect(can("executive", "CAN_CLOSE_MEETING")).toBe(true);
      expect(can("executive", "CAN_MANAGE_ACCOUNT")).toBe(false);
    });

    it("recognizes safety as a domain-special role", () => {
      // safety can review safety items but cannot approve receipts
      expect(can("safety", "CAN_REVIEW_SAFETY")).toBe(true);
      expect(can("safety", "CAN_APPROVE_OPS")).toBe(false);
      // safety is NOT just a "higher staff" — staff cannot review safety
      expect(can("staff", "CAN_REVIEW_SAFETY")).toBe(false);
    });
  });

  describe("CAPABILITIES table", () => {
    it("covers every Capability key", () => {
      const expectedCaps = [
        "CAN_APPROVE_HQ",
        "CAN_APPROVE_OPS",
        "CAN_APPROVE_CLIENT",
        "CAN_CREATE_RECEIPT",
        "CAN_MANAGE_ACCOUNT",
        "CAN_VIEW_AUDIT_LOG",
        "CAN_REVIEW_SAFETY",
        "CAN_REGISTER_WORKER",
        "CAN_MANAGE_CLIENT_PORTAL",
        "CAN_MANAGE_SITE",
        "CAN_APPROVE_MATERIAL",
        "CAN_CLOSE_MEETING",
      ];
      for (const cap of expectedCaps) {
        expect(CAPABILITIES).toHaveProperty(cap);
      }
    });

    it("uses only valid roles in every capability set", () => {
      const validRoles = new Set<Role>(ALL_ROLES);
      for (const [cap, roles] of Object.entries(CAPABILITIES)) {
        for (const r of roles) {
          expect(validRoles.has(r), `${cap} contains invalid role ${r}`).toBe(true);
        }
      }
    });
  });

  describe("role tier classification", () => {
    it("classifies admin/support/operations as vertical (system)", () => {
      expect(ROLE_TIER.admin).toBe("vertical");
      expect(ROLE_TIER.support).toBe("vertical");
      expect(ROLE_TIER.operations).toBe("vertical");
    });

    it("classifies executive/director/manager/safety/staff as horizontal (job)", () => {
      expect(ROLE_TIER.executive).toBe("horizontal");
      expect(ROLE_TIER.director).toBe("horizontal");
      expect(ROLE_TIER.manager).toBe("horizontal");
      expect(ROLE_TIER.safety).toBe("horizontal");
      expect(ROLE_TIER.staff).toBe("horizontal");
    });
  });
});
