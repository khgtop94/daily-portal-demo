import type { ApprovalState } from "./types";

export function formatKRW(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const STATE_LABEL: Record<ApprovalState, string> = {
  draft:           "작성중",
  submitted:       "제출",
  ops_approved:    "관리팀장 승인",
  client_approved: "발주처 승인",
  hq_approved:     "본사 최종 승인",
  ops_rejected:    "관리팀장 반려",
  client_rejected: "발주처 반려",
  hq_rejected:     "본사 반려",
};

export const STATE_COLOR: Record<ApprovalState, string> = {
  draft:           "bg-gray-100 text-gray-700 border-gray-300",
  submitted:       "bg-blue-100 text-blue-700 border-blue-300",
  ops_approved:    "bg-indigo-100 text-indigo-700 border-indigo-300",
  client_approved: "bg-purple-100 text-purple-700 border-purple-300",
  hq_approved:     "bg-emerald-100 text-emerald-700 border-emerald-300",
  ops_rejected:    "bg-rose-100 text-rose-700 border-rose-300",
  client_rejected: "bg-rose-100 text-rose-700 border-rose-300",
  hq_rejected:     "bg-rose-100 text-rose-700 border-rose-300",
};
