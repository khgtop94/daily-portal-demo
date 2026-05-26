import { describe, it, expect } from "vitest";
import { formatKRW, formatDate, STATE_LABEL, STATE_COLOR } from "./format";

describe("format helpers", () => {
  describe("formatKRW", () => {
    it("adds Korean thousands separator and 원 suffix", () => {
      expect(formatKRW(1_000)).toBe("1,000원");
      expect(formatKRW(1_240_000)).toBe("1,240,000원");
    });

    it("handles zero and negative", () => {
      expect(formatKRW(0)).toBe("0원");
      expect(formatKRW(-500)).toBe("-500원");
    });
  });

  describe("formatDate", () => {
    it("formats ISO timestamp to YYYY-MM-DD HH:mm (local time)", () => {
      // 2026-05-26 09:30 KST
      const out = formatDate("2026-05-26T09:30:00+09:00");
      // The output is locale-dependent (machine TZ) — test the pattern, not the exact value
      expect(out).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it("pads single-digit components with zero", () => {
      const out = formatDate("2026-01-05T08:09:00+09:00");
      // Should not contain bare single-digit numbers in the date portion
      const datePart = out.slice(0, 10);
      expect(datePart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("STATE_LABEL", () => {
    it("covers every approval state", () => {
      const states = [
        "draft",
        "submitted",
        "ops_approved",
        "client_approved",
        "hq_approved",
        "ops_rejected",
        "client_rejected",
        "hq_rejected",
      ] as const;
      for (const s of states) {
        expect(STATE_LABEL[s]).toBeDefined();
        expect(STATE_LABEL[s]).not.toBe("");
      }
    });
  });

  describe("STATE_COLOR", () => {
    it("returns rose-toned color for every *_rejected state", () => {
      expect(STATE_COLOR.ops_rejected).toContain("rose");
      expect(STATE_COLOR.client_rejected).toContain("rose");
      expect(STATE_COLOR.hq_rejected).toContain("rose");
    });

    it("returns emerald color for the final approved state", () => {
      expect(STATE_COLOR.hq_approved).toContain("emerald");
    });
  });
});
