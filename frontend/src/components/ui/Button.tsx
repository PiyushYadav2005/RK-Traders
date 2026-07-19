import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "live";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  as?: "button" | "a" | "link";
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-volt text-white hover:bg-volt-dim shadow-[0_8px_24px_-8px_rgba(0,87,255,0.6)]",
  secondary:
    "bg-white text-navy border border-line hover:border-volt hover:text-volt",
  ghost: "bg-transparent text-white border border-white/25 hover:border-white/60",
  live: "bg-live text-navy hover:bg-live-dim shadow-[0_8px_24px_-8px_rgba(255,213,0,0.5)]",
};

export function Button({
  variant = "primary",
  icon,
  className,
  children,
  as = "button",
  href,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold font-display tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
    variantStyles[variant],
    className
  );

  if ((as === "link" || as === "a") && href) {
    return (
      <Link to={href} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      {icon}
    </button>
  );
}