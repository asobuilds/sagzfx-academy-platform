import type { ReactNode } from "react";

type PageIntroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
};

export default function PageIntro({ title, description, eyebrow, children, className = "" }: PageIntroProps) {
  return (
    <header className={`space-y-3 ${className}`}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        {title}
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{description}</p>
      {children}
    </header>
  );
}
