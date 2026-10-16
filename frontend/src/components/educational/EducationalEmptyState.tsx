import Link from "next/link";
import type { ReactNode } from "react";

type EducationalEmptyStateProps = {
  title: string;
  why: string;
  action: string;
  where: string;
  href?: string;
  actionLabel?: string;
  icon?: ReactNode;
  className?: string;
};

export default function EducationalEmptyState({
  title, why, action, where, href, actionLabel, icon, className = "",
}: EducationalEmptyStateProps) {
  return (
    <section className={`rounded-2xl border p-5 sm:p-6 ${className}`}
      style={{ background: "var(--bg-glass)", borderColor: "var(--border-subtle)" }}>
      {icon && <div className="mb-3 text-cyan-300" aria-hidden="true">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>{why}</p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>{action}</p>
      <p className="mt-2 text-xs" style={{ color: "var(--text-muted-dark)" }}>{where}</p>
      {href && actionLabel && (
        <Link href={href} className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-cyan-400/50 px-4 py-2 text-sm font-semibold text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
          {actionLabel}
        </Link>
      )}
    </section>
  );
}
