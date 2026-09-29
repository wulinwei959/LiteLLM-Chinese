import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { z } from "zod/v4";
import { useCreateBudget } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { applyBudgetPrecision } from "./budgetPrecision";
import { toast } from "@/lib/toast";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useZodForm } from "@/lib/forms/useZodForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const buildBudgetSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    budget_id: z.string().min(1, t("budgetIdRequired")),
    tpm_limit: z.number().nullish(),
    rpm_limit: z.number().nullish(),
    tpd_limit: z.number().nullish(),
    max_budget: z.number().nullish(),
    budget_duration: z.string().nullish(),
  });

type BudgetFormValues = z.output<ReturnType<typeof buildBudgetSchema>>;

const BUDGET_DURATION_OPTIONS = [
  { value: "24h", labelKey: "durationDailyLower" },
  { value: "7d", labelKey: "durationWeeklyLower" },
  { value: "30d", labelKey: "durationMonthlyLower" },
] as const;

interface BudgetModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const BudgetModal: React.FC<BudgetModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const t = useTranslations("budgets");
  const [optionalSettingsOpen, setOptionalSettingsOpen] = React.useState(false);
  const form = useZodForm(buildBudgetSchema(t), { defaultValues: { budget_id: "" } });
  const createBudget = useCreateBudget();

  const handleCancel = () => {
    setIsModalVisible(false);
    form.reset();
  };

  const handleCreate = async (formValues: BudgetFormValues) => {
    try {
      toast.info(t("makingApiCall"));
      await createBudget.mutateAsync(
        applyBudgetPrecision(
          optionalSettingsOpen ? formValues : { ...formValues, max_budget: undefined, budget_duration: undefined },
        ),
      );
      toast.success(t("budgetCreated"));
      form.reset();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating the budget:", error);
      toast.fromError(t("createFailedDetail", { error: String(error) }));
    }
  };

  return (
    <Dialog open={isModalVisible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("createBudget")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreate)} noValidate>
          <FieldGroup>
            <FormField control={form.control} name="budget_id" label={t("budgetID")} description={t("budgetIdHint")}>
              {({ ref, ...field }) => <Input {...field} ref={ref} value={field.value ?? ""} placeholder="" />}
            </FormField>
            <FormField control={form.control} name="tpm_limit" label={t("tpmLimitFull")} description={t("tpmRpmHint")}>
              {({ ref, value, onChange, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  step={1}
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                />
              )}
            </FormField>
            <FormField control={form.control} name="rpm_limit" label={t("rpmLimitFull")} description={t("tpmRpmHint")}>
              {({ ref, value, onChange, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  step={1}
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                />
              )}
            </FormField>
            <FormField control={form.control} name="tpd_limit" label={t("tpdLimitFull")} description={t("tpdHint")}>
              {({ ref, value, onChange, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="number"
                  step={1}
                  value={value ?? ""}
                  onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                />
              )}
            </FormField>

            <Collapsible open={optionalSettingsOpen} onOpenChange={setOptionalSettingsOpen} className="mt-20 mb-8">
              <CollapsibleTrigger className="group flex w-full items-center justify-between py-2 text-left">
                <b>{t("optionalSettings")}</b>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-data-panel-open:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <FormField control={form.control} name="max_budget" label={t("maxBudgetUsd")}>
                  {({ ref, value, onChange, ...field }) => (
                    <Input
                      {...field}
                      ref={ref}
                      type="number"
                      step={0.01}
                      value={value ?? ""}
                      onChange={(event) => onChange(event.target.value === "" ? null : event.target.valueAsNumber)}
                    />
                  )}
                </FormField>
                <FormField className="mt-8" control={form.control} name="budget_duration" label={t("resetBudgetFull")}>
                  {({ id, value, onChange, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }) => (
                    <Select
                      items={BUDGET_DURATION_OPTIONS.map((option) => ({
                        value: option.value,
                        label: t(option.labelKey),
                      }))}
                      value={value ?? null}
                      onValueChange={onChange}
                    >
                      <SelectTrigger id={id} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy}>
                        <SelectValue placeholder="n/a" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
              </CollapsibleContent>
            </Collapsible>
          </FieldGroup>

          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button type="submit">{t("createBudget")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetModal;
