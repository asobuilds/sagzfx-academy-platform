import Link from "next/link";

type NextStepCueProps = {
  message: string;
  href?: string;
  linkLabel?: string;
  available?: boolean;
  fallback?: string;
  className?: string;
};

export default function NextStepCue({
  message, href, linkLabel, available = true, fallback, className = "",
}: NextStepCueProps) {
  const canLink = available && Boolean(href && linkLabel);
  return (
    <aside className={`rounded-2xl border p-4 text-sm leading-relaxed sm:p-5 ${className}`}
      style={{ background: "var(--bg-glass)", borderColor: "var(--border-subtle)" }}
      aria-label="What's next">
      <p>
        <span className="font-semibold">What&apos;s next? </span>
        {canLink ? message : (fallback ?? message)}
        {canLink && (
          <>{" "}<Link href={href!} className="font-semibold text-cyan-300 underline underline-offset-4 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">{linkLabel}</Link></>
        )}
      </p>
    </aside>
  );
}
