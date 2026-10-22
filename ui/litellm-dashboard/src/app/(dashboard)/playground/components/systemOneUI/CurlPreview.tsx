import { useTranslations } from "next-intl";
import CopyButton from "@/components/shared/CopyButton";
import { buildCurlCommand, type CurlCommandInput } from "./lib/curlCommand";

interface CurlPreviewProps extends CurlCommandInput {
  errorCount?: number;
}

export default function CurlPreview({ errorCount = 0, ...input }: CurlPreviewProps) {
  const t = useTranslations("playground.systemOne");
  const command = buildCurlCommand(input);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm">
        <span className="font-medium">{t("title.curlRequest")}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {errorCount > 0 ? (
            <span role="alert" className="text-destructive">
              {t("hint.fixIssues", { count: errorCount })}
            </span>
          ) : (
            <>
              <span>{t("hint.replaceApiKey")}</span>
              <CopyButton value={command} label={t("action.copyCurl")} variant="action" />
            </>
          )}
        </div>
      </div>
      <pre
        aria-label={t("title.curlRequest")}
        className="m-0 min-h-0 flex-1 overflow-auto whitespace-pre-wrap wrap-anywhere px-3 py-3 font-mono text-xs leading-5"
      >
        {command}
      </pre>
    </div>
  );
}
