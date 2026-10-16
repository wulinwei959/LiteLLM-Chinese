import { useTranslations } from "next-intl";
import { RunView } from "@/components/view_logs/TraceView/TraceDrawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function TracePanel({
  open,
  traceId,
  traceRef,
  initialSpanId,
  accessToken,
  onClose,
}: {
  open: boolean;
  traceId: string;
  traceRef?: string;
  initialSpanId?: string;
  accessToken: string;
  onClose: () => void;
}) {
  const t = useTranslations("lens");
  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="w-full overflow-y-auto data-[side=right]:sm:max-w-[90vw]">
        <SheetHeader>
          <SheetTitle className="text-xl">{t("originalRun")}</SheetTitle>
          <SheetDescription>{t("recordedAgentSteps")}</SheetDescription>
        </SheetHeader>
        {open && (
          <RunView
            key={`${traceId}:${traceRef}:${initialSpanId}`}
            traceId={traceId}
            traceRef={traceRef}
            initialSpanId={initialSpanId}
            accessToken={accessToken}
            onBack={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
