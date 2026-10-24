import { useState } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { useZodForm } from "../../../lib/forms/useZodForm";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { DurationInput } from "../../shared/DurationInput";
import { type Settings } from "../model/types";
import { useLensTranslate } from "../../../host/useLensTranslate";

const monitoringSchema = z.object({
  interval_minutes: z.number().int().min(1),
});

export function MonitoringDialog({
  settings,
  ready,
  onSave,
  onClose,
}: {
  settings: Settings;
  ready: boolean;
  onSave: (settings: Settings) => Promise<void>;
  onClose: () => void;
}) {
  const t = useLensTranslate();
  const [error, setError] = useState("");
  const form = useZodForm(monitoringSchema, {
    defaultValues: { interval_minutes: settings.interval_minutes ?? 30 },
    mode: "onChange",
  });
  const { formState, control } = form;
  const save = form.handleSubmit(async ({ interval_minutes }) => {
    setError("");
    try {
      await onSave({ ...settings, enabled: true, interval_minutes });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("setup.couldEnableMonitoring"));
    }
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !formState.isSubmitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("setup.keepMonitoring")}</DialogTitle>
          <DialogDescription>
            {t("setup.repeatInvestigationSavedScope")}</DialogDescription>
        </DialogHeader>
        <Controller
          control={control}
          name="interval_minutes"
          render={({ field }) => (
            <DurationInput label={t("setup.checkEvery")} value={field.value} onChange={field.onChange} base="minutes" />
          )}
        />
        {formState.errors.interval_minutes?.message && (
          <p role="alert" className="text-sm text-destructive">
            {formState.errors.interval_minutes.message}
          </p>
        )}
        <p className="text-xs leading-5 text-muted-foreground">
          {t("setup.eachInvestigationLooksBack")}</p>
        {!ready && (
          <p role="status" className="text-sm text-warning">
            {t("setup.reconnectWorkerBeforeEnabling")}</p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("datasets.cancel")}</Button>
          <Button disabled={!formState.isValid || formState.isSubmitting || !ready} onClick={() => void save()}>
            {formState.isSubmitting ? t("settings.saving") : t("investigations.enableMonitoring")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
