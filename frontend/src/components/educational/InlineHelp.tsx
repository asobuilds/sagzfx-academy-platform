import { useId } from "react";
import type { ReactElement, ReactNode } from "react";
import { cloneElement } from "react";

type DescribedControlProps = {
  "aria-describedby"?: string;
};

type InlineHelpProps = {
  children: ReactElement<DescribedControlProps>;
  text: ReactNode;
  id?: string;
  className?: string;
};

export default function InlineHelp({ children, text, id, className = "" }: InlineHelpProps) {
  const generatedId = useId();
  const helpId = id ?? generatedId;
  const existing = children.props["aria-describedby"];
  return (
    <div className={`space-y-1.5 ${className}`}>
      {cloneElement(children, { "aria-describedby": [existing, helpId].filter(Boolean).join(" ") })}
      <p id={helpId} className="text-xs leading-relaxed" style={{ color: "var(--text-muted-dark)" }}>{text}</p>
    </div>
  );
}
