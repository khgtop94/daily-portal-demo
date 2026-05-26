"use server";

import { revalidatePath } from "next/cache";
import { setMaterialState } from "@/lib/mock-data";

export async function approveMaterial(formData: FormData) {
  const id = String(formData.get("id") || "");
  setMaterialState(id, "approved");
  revalidatePath("/hq/materials");
  revalidatePath("/hq");
}

export async function rejectMaterial(formData: FormData) {
  const id = String(formData.get("id") || "");
  setMaterialState(id, "rejected", "데모 — 반려 사유 입력 UI는 실 운영에서 모달로 처리");
  revalidatePath("/hq/materials");
  revalidatePath("/hq");
}
