"use client";

import { X } from "lucide-react";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";

import { WatchPicker } from "../WatchPicker";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { InvestigationInput } from "../investigationSchema";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export function ExpectationsFields() {
  const t = useLensTranslate();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<InvestigationInput>();
  const { fields, append, remove } = useFieldArray({ control, name: "questions", keyName: "fieldId" });
  return (
    <div className="space-y-5">
      <label className="grid gap-2 text-sm font-medium">
        {t("investigations.shouldAgentDoing")}<Textarea
          {...register("context")}
          rows={4}
          placeholder={t("setup.answerCustomerSQuestion")}
        />
      </label>
      {errors.context?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.context.message}
        </p>
      )}
      <Controller
        control={control}
        name="watching"
        render={({ field }) => (
          <WatchPicker
            selected={new Set(field.value)}
            onChange={(values) => field.onChange([...values])}
            onAddCustom={() => append({ id: crypto.randomUUID(), instruction: "", enabled: true })}
          />
        )}
      />
      <fieldset className="space-y-2">
        <legend className="sr-only">{t("setup.customChecks")}</legend>
        {fields.map((check, index) => (
          <div key={check.fieldId} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Textarea
                aria-label={t("setup.checkValue0", { value0: index + 1 })}
                {...register(`questions.${index}.instruction`)}
                rows={2}
                placeholder={t("setup.eGQuotesPrice")}
              />
              {errors.questions?.[index]?.instruction?.message && (
                <p role="alert" className="mt-1 text-sm text-destructive">
                  {errors.questions[index].instruction.message}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" aria-label={t("setup.removeCheckValue0", { value0: index + 1 })} onClick={() => remove(index)}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
