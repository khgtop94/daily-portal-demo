// Inline SVG icons — no extra dependency
type IconProps = { className?: string };

const base = "w-5 h-5 stroke-current fill-none";

export const Icon = {
  Home: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M3 12 12 3l9 9M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Receipt: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M6 2v20l3-2 3 2 3-2 3 2V2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 7h6M9 11h6M9 15h4" strokeLinecap="round"/></svg>
  ),
  Shield: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" strokeLinejoin="round"/></svg>
  ),
  Users: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14c2.8 0 5 2.2 5 5"/></svg>
  ),
  Site: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-6h4v6" strokeLinejoin="round"/></svg>
  ),
  Clipboard: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4" strokeLinecap="round"/></svg>
  ),
  Clock: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/></svg>
  ),
  Meeting: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M3 7h18v11H3z" strokeLinejoin="round"/><path d="M8 7V4M16 7V4" strokeLinecap="round"/></svg>
  ),
  Box: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M3 7v11l9 4 9-4V7l-9-4-9 4z" strokeLinejoin="round"/><path d="M3 7l9 4 9-4M12 11v11"/></svg>
  ),
  Bell: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3V8z" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round"/></svg>
  ),
  Audit: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M5 4h11l4 4v12H5z" strokeLinejoin="round"/><path d="M8 12h8M8 16h6M8 8h4" strokeLinecap="round"/></svg>
  ),
  Architecture: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  ),
  Camera: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M4 8h3l2-3h6l2 3h3v12H4z" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5"/></svg>
  ),
  Gps: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" strokeLinejoin="round"/></svg>
  ),
  Check: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  X: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2.5"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/></svg>
  ),
  Warning: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M12 3 2 21h20L12 3z" strokeLinejoin="round"/><path d="M12 10v5M12 18v.5" strokeLinecap="round"/></svg>
  ),
  Inbox: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M3 13l3-8h12l3 8v6H3v-6z" strokeLinejoin="round"/><path d="M3 13h5l1 3h6l1-3h5"/></svg>
  ),
  Search: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4" strokeLinecap="round"/></svg>
  ),
  Arrow: ({ className }: IconProps) => (
    <svg className={`${base} ${className ?? ""}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
};
