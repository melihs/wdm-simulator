import { ReactNode } from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
}

export default function Section({ title, subtitle, badge, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
