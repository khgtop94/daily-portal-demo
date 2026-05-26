import { Icon } from "./Icon";

export default function EmptyState({
  title,
  body,
  icon = "Inbox",
}: {
  title: string;
  body?: string;
  icon?: keyof typeof Icon;
}) {
  const IconComp = Icon[icon];
  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
        <IconComp className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {body && <p className="text-xs text-slate-500 mt-1">{body}</p>}
    </div>
  );
}
