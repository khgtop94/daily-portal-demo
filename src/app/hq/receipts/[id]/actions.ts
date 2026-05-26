"use server";

import { revalidatePath } from "next/cache";
import { appendReceiptEvent, getReceiptById } from "@/lib/mock-data";
import { getActiveUser } from "@/lib/session";
import type { ApprovalState } from "@/lib/types";

export async function approveReceipt(formData: FormData) {
  const id = String(formData.get("id") || "");
  const nextState = String(formData.get("nextState") || "") as ApprovalState;
  const user = await getActiveUser("hq");
  if (!user) return;
  const r = getReceiptById(id);
  if (!r) return;
  appendReceiptEvent(
    id,
    {
      at: new Date().toISOString(),
      by: user.id,
      byRole: user.role || "staff",
      from: r.state,
      to: nextState,
      comment: "데모 — 승인 처리",
    },
    nextState
  );
  revalidatePath(`/hq/receipts/${id}`);
  revalidatePath("/hq/receipts");
  revalidatePath("/hq");
}

export async function rejectReceipt(formData: FormData) {
  const id = String(formData.get("id") || "");
  const currentState = String(formData.get("currentState") || "") as ApprovalState;
  const user = await getActiveUser("hq");
  if (!user) return;
  const r = getReceiptById(id);
  if (!r) return;

  // map current state → corresponding *_rejected
  const rejectedState: ApprovalState =
    currentState === "submitted"
      ? "ops_rejected"
      : currentState === "ops_approved"
        ? "client_rejected"
        : currentState === "client_approved"
          ? "hq_rejected"
          : "ops_rejected";

  appendReceiptEvent(
    id,
    {
      at: new Date().toISOString(),
      by: user.id,
      byRole: user.role || "staff",
      from: r.state,
      to: rejectedState,
      comment: "데모 — 반려 처리 (사유 입력 UI는 실 운영에서 모달)",
    },
    rejectedState
  );
  revalidatePath(`/hq/receipts/${id}`);
  revalidatePath("/hq/receipts");
  revalidatePath("/hq");
}
