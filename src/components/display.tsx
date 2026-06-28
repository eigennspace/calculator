"use client";

export function Display({
  value,
  previousValue,
  operation,
  error,
}: {
  value: string;
  previousValue: string | null;
  operation: string | null;
  error: boolean;
}) {
  return (
    <div className="flex flex-col items-end justify-end px-6 pt-8 pb-4">
      <div className="h-6 text-sm text-muted-foreground font-mono">
        {previousValue && operation ? `${previousValue} ${operation}` : " "}
      </div>
      <div className="text-5xl font-mono tracking-tight tabular-nums">
        {error ? "\u{1F480} Error" : value}
      </div>
    </div>
  );
}
