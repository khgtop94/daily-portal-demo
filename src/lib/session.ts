// Mock session — cookie-based, three independent cookies (see ADR-0002)
// Real system uses signed/encrypted tokens; this demo uses plain user IDs for clarity.

import { cookies } from "next/headers";
import { getUserById } from "./mock-data";
import type { SessionType, User } from "./types";

const COOKIE_NAMES: Record<SessionType, string> = {
  hq:     "dd_session",
  worker: "dd_worker_session",
  client: "dd_client_session",
};

export async function getActiveUser(type: SessionType): Promise<User | null> {
  const store = await cookies();
  const userId = store.get(COOKIE_NAMES[type])?.value;
  if (!userId) return null;
  const user = getUserById(userId);
  if (!user || user.sessionType !== type) return null;
  return user;
}

export async function getAnySession(): Promise<{ type: SessionType; user: User } | null> {
  for (const type of ["hq", "worker", "client"] as const) {
    const user = await getActiveUser(type);
    if (user) return { type, user };
  }
  return null;
}

export function cookieName(type: SessionType): string {
  return COOKIE_NAMES[type];
}
