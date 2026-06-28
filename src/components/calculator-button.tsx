"use client";

import type { ButtonConfig } from "@/lib/button-config";

export function CalculatorButton({
  config,
  onClick,
}: {
  config: ButtonConfig;
  onClick: () => void;
}) {
  const base =
    "h-full w-full rounded-2xl text-xl font-medium transition-colors select-none active:scale-[0.97]";

  const variant = config.variant === "equals"
    ? "bg-primary text-primary-foreground hover:bg-primary/80"
    : config.variant === "operator"
      ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      : config.variant === "control"
        ? "bg-muted text-muted-foreground hover:bg-muted/80"
        : "bg-secondary/50 text-foreground hover:bg-secondary/70";

  if (config.span === 2) {
    return (
      <div className="col-span-2">
        <button className={`${base} ${variant} aspect-auto`} onClick={onClick}>
          {config.label}
        </button>
      </div>
    );
  }

  return (
    <button className={`${base} ${variant} aspect-square`} onClick={onClick}>
      {config.label}
    </button>
  );
}
