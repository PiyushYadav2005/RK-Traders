import { type ReactNode } from "react";
import clsx from "clsx";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function Section({ children, className, id, dark = false }: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "relative px-6 py-20 md:py-28",
        dark ? "bg-navy text-white" : "bg-surface text-navy",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/** The signature "current flow" divider — a thin line with a glowing pulse
 * that travels along it, used between major sections to visually thread
 * the page together like a single circuit. */
export function CurrentLine({ className }: { className?: string }) {
  return <div className={clsx("current-line", className)} aria-hidden="true" />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-volt">
      {children}
    </p>
  );
}
