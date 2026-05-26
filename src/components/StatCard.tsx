import type { ReactNode } from "react";
import { Icon } from "./Icon";

export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "slate",
  children,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: keyof typeof Icon;
  tone?: "slate" | "brand" | "emerald" | "rose" | "amber";
  children?: ReactNode;
}) {
  const toneClass = {
    slate:   "bg-slate-100 text-slate-600",
    brand:   "bg-brand-100 text-brand-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose:    "bg-rose-100 text-rose-700",
    amber:   "bg-amber-100 text-amber-700",
  }[tone];

  const IconComp = icon ? Icon[icon] : null;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
          {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
        </div>
        {IconComp && (
          <div className={`shrink-0 w-9 h-9 rounded-lg ${toneClass} flex items-center justify-center`}>
            <IconComp className="w-5 h-5" />
          </div>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
