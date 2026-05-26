import type { ApprovalEvent, ApprovalState } from "@/lib/types";
import { STATE_LABEL, STATE_COLOR, formatDate } from "@/lib/format";

const FLOW: ApprovalState[] = [
  "draft",
  "submitted",
  "ops_approved",
  "client_approved",
  "hq_approved",
];

export default function ApprovalChain({
  state,
  history,
}: {
  state: ApprovalState;
  history: ApprovalEvent[];
}) {
  const reachedIdx = FLOW.indexOf(state);
  const isRejected = state.endsWith("_rejected");

  return (
    <div className="space-y-5">
      {/* Flow diagram */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FLOW.map((s, i) => {
          const reached = !isRejected && i <= reachedIdx;
          return (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className={
                  "pill " +
                  (reached
                    ? STATE_COLOR[s]
                    : "bg-slate-50 text-slate-400 border-slate-200")
                }
              >
                {STATE_LABEL[s]}
              </span>
              {i < FLOW.length - 1 && (
                <span className={reached ? "text-slate-400" : "text-slate-200"}>→</span>
              )}
            </div>
          );
        })}
        {isRejected && (
          <span className={"pill ml-2 " + STATE_COLOR[state]}>
            ⚠ {STATE_LABEL[state]}
          </span>
        )}
      </div>

      {/* History */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
          이력 (감사 로그 자동 기록)
        </p>
        <ol className="space-y-2.5">
          {history.map((e, i) => (
            <li key={i} className="border-l-2 border-slate-200 pl-3 py-0.5">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs text-slate-500">{formatDate(e.at)}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-sm text-slate-800">
                  <span className="font-medium">{e.byRole}</span>
                  <span className="text-slate-400 mx-1">→</span>
                  {STATE_LABEL[e.from]} → {STATE_LABEL[e.to]}
                </span>
              </div>
              {e.comment && (
                <p className="text-xs text-slate-500 mt-0.5">"{e.comment}"</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
