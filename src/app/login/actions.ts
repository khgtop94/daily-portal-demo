"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/mock-data";
import { cookieName } from "@/lib/session";
import type { SessionType } from "@/lib/types";

export async function loginAs(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const user = getUserById(userId);
  if (!user) {
    redirect("/login?error=unknown_user");
  }
  const store = await cookies();
  store.set(cookieName(user.sessionType), user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day for demo
  });

  const dest =
    user.sessionType === "hq"
      ? "/hq"
      : user.sessionType === "worker"
        ? "/worker"
        : "/client";
  redirect(dest);
}

export async function logout(formData: FormData) {
  const type = String(formData.get("type") || "") as SessionType;
  const store = await cookies();
  store.delete(cookieName(type));
  redirect(`/login?tab=${type}`);
}
