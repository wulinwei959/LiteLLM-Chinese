import { AlertCircle, Check, Circle } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatusMarkProps {
  status: "ok" | "error" | "unset";
  count?: number;
  subtle?: boolean;
}

/** Run / span status glyph: red alert (+ count) for errors, a quiet muted dot or check otherwise. */
export function StatusMark({ status, count, subtle = false }: StatusMarkProps) {
  const t = useTranslations("logs");
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] text-destructive"
        aria-label={t("traceList.errorCount", { count: count ?? 1 })}
      >
        <AlertCircle className="size-3" />
        {count !== undefined && <span className="font-mono tabular-nums">{count}</span>}
      </span>
    );
  }
  if (subtle)
    return (
      <Circle className="size-2 shrink-0 fill-muted-foreground/60 text-muted-foreground/60" aria-label={t("success")} />
    );
  return <Check className="size-3 text-muted-foreground" aria-label={t("success")} />;
}
