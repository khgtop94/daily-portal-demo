"use server";

import { revalidatePath } from "next/cache";
import { MOCK_NOTIFICATIONS, markNotificationRead } from "@/lib/mock-data";

export async function markRead(formData: FormData) {
  const id = String(formData.get("id") || "");
  markNotificationRead(id);
  revalidatePath("/hq/notifications");
  revalidatePath("/hq");
}

export async function markAllRead(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  MOCK_NOTIFICATIONS.filter((n) => n.userId === userId).forEach((n) => (n.read = true));
  revalidatePath("/hq/notifications");
  revalidatePath("/hq");
}
