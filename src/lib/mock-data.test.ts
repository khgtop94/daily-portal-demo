import { describe, it, expect } from "vitest";
import {
  MOCK_SITES,
  MOCK_USERS,
  MOCK_RECEIPTS,
  MOCK_AUDIT_LOG,
  getSiteById,
  getUserById,
  getReceiptById,
  appendReceiptEvent,
} from "./mock-data";

describe("mock data integrity", () => {
  it("every receipt references an existing site", () => {
    for (const r of MOCK_RECEIPTS) {
      expect(getSiteById(r.siteId), `receipt ${r.id} has invalid site_id`).toBeDefined();
    }
  });

  it("every receipt's submittedBy references an existing user", () => {
    for (const r of MOCK_RECEIPTS) {
      expect(getUserById(r.submittedBy), `receipt ${r.id} has invalid submittedBy`).toBeDefined();
    }
  });

  it("every user's siteIds reference existing sites", () => {
    for (const u of MOCK_USERS) {
      for (const sid of u.siteIds || []) {
        expect(getSiteById(sid), `user ${u.id} has invalid site ${sid}`).toBeDefined();
      }
    }
  });

  it("receipts with hq_approved state have at least 3 history events", () => {
    for (const r of MOCK_RECEIPTS) {
      if (r.state === "hq_approved") {
        expect(r.history.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("audit log entries reference valid actors", () => {
    for (const e of MOCK_AUDIT_LOG) {
      const actor = getUserById(e.actor);
      // Auto-generated entries from appendReceiptEvent may use future IDs; allow if user lookup fails for non-system actors only
      if (e.actor.startsWith("u-")) {
        expect(actor, `audit ${e.id} references unknown actor ${e.actor}`).toBeDefined();
      }
    }
  });
});

describe("approval state transitions", () => {
  it("appendReceiptEvent updates state and history atomically", () => {
    // Use a receipt we know exists; create a temporary clone path via mutation
    const r = getReceiptById("r-002");
    expect(r).toBeDefined();
    if (!r) return;

    const originalState = r.state;
    const originalHistoryLength = r.history.length;

    appendReceiptEvent(
      "r-002",
      {
        at: new Date().toISOString(),
        by: "u-hq-3",
        byRole: "operations",
        from: originalState,
        to: "ops_approved",
        comment: "테스트",
      },
      "ops_approved"
    );

    expect(r.state).toBe("ops_approved");
    expect(r.history.length).toBe(originalHistoryLength + 1);
    expect(r.history[r.history.length - 1].comment).toBe("테스트");

    // Audit log should also have a new entry on top
    expect(MOCK_AUDIT_LOG[0].target).toBe("r-002");
  });
});
