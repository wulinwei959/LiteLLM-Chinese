import { useEffect } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { useCloudZeroCreate } from "@/app/(dashboard)/hooks/cloudzero/useCloudZeroCreate";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useZodForm } from "@/lib/forms/useZodForm";
import type { CloudZeroTranslator } from "@/lib/i18n/translators";
import { toast } from "@/lib/toast";

import { CloudZeroApiKeyInput, labelWithHint } from "./CloudZeroFormControls";
import { buildCloudZeroPayload, EMPTY_CLOUDZERO_FORM_VALUES, type CloudZeroFormValues } from "./cloudZeroPayload";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CloudZeroCreationModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const buildCreateSchema = (t: CloudZeroTranslator) =>
  z.object({
    api_key: z.string().min(1, t("apiKeyRequired")),
    connection_id: z.string().min(1, t("connectionIdRequired")),
    timezone: z.string(),
  });

export default function CloudZeroCreationModal({ open, onOk, onCancel }: CloudZeroCreationModalProps) {
  const t = useTranslations("cloudZero");
  const commonT = useTranslations("common");
  const { accessToken } = useAuthorized();
  const form = useZodForm(buildCreateSchema(t), { defaultValues: EMPTY_CLOUDZERO_FORM_VALUES });
  const createMutation = useCloudZeroCreate(accessToken || "");

  useEffect(() => {
    if (open) {
      form.reset(EMPTY_CLOUDZERO_FORM_VALUES);
    }
  }, [open, form]);

  const handleSubmit = (values: CloudZeroFormValues) => {
    createMutation.mutate(buildCloudZeroPayload(values), {
      onSuccess: () => {
        toast.success(t("createdToast"));
        form.reset(EMPTY_CLOUDZERO_FORM_VALUES);
        onOk();
      },
      onError: (error: Error) => {
        toast.error(error.message || t("createFailedToast"));
      },
    });
  };

  const handleCancel = () => {
    form.reset(EMPTY_CLOUDZERO_FORM_VALUES);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
        </DialogHeader>
        <TooltipProvider>
          <form onSubmit={(event) => event.preventDefault()} noValidate>
            <FieldGroup>
              <FormField control={form.control} name="api_key" label={t("apiKeyLabel")}>
                {({ ref, ...field }) => (
                  <CloudZeroApiKeyInput {...field} ref={ref} placeholder={t("apiKeyPlaceholder")} />
                )}
              </FormField>
              <FormField control={form.control} name="connection_id" label={t("connectionIdLabel")}>
                {({ ref, ...field }) => <Input {...field} ref={ref} placeholder={t("connectionIdPlaceholder")} />}
              </FormField>
              <FormField
                control={form.control}
                name="timezone"
                label={labelWithHint(t("timezoneLabel"), t("timezoneHint"))}
              >
                {({ ref, ...field }) => <Input {...field} ref={ref} placeholder={t("timezonePlaceholder")} />}
              </FormField>
            </FieldGroup>
          </form>
        </TooltipProvider>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={createMutation.isPending}>
            {commonT("cancel")}
          </Button>
          <Button
            onClick={() => void form.handleSubmit(handleSubmit)()}
            disabled={createMutation.isPending}
            aria-busy={createMutation.isPending}
          >
            {createMutation.isPending ? t("creating") : commonT("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
