"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { toast } from "@/lib/toast";
import { StatusBadge } from "@/components/shared/table_cells/status_badge";
import {
  useCoordinationRedisSettings,
  useTestCoordinationRedisConnection,
  useUpdateCoordinationRedisSettings,
} from "@/app/(dashboard)/hooks/coordinationRedis/useCoordinationRedisSettings";
import CoordinationRedisFieldSection from "./CoordinationRedisFieldSection";
import CoordinationRedisTypeSelector from "./CoordinationRedisTypeSelector";
import { COORDINATION_FIELDS, CoordinationRedisType } from "./coordinationRedisFields";
import {
  buildCoordinationPayload,
  buildInitialValues,
  configuredSecretFields,
  CoordinationFormValues,
  inferRedisType,
  isFieldVisible,
  sourceBadge,
} from "./coordinationRedisUtils";

const CoordinationRedisSettings: React.FC = () => {
  const form = useForm<CoordinationFormValues>({ defaultValues: buildInitialValues({}) });
  const t = useTranslations("caching");
  const cacheT = useTranslations("cacheSettings");
  const commonT = useTranslations("common");
  const [selectedRedisType, setSelectedRedisType] = useState<CoordinationRedisType | null>(null);

  const { data, isLoading, isError } = useCoordinationRedisSettings();
  const updateSettings = useUpdateCoordinationRedisSettings();
  const testConnection = useTestCoordinationRedisConnection();

  const redisType = selectedRedisType ?? inferRedisType(data?.values ?? {});

  useEffect(() => {
    if (data) {
      form.reset(buildInitialValues(data.values));
    }
  }, [data, form]);

  useEffect(() => {
    if (isError) {
      toast.fromError(t("coordination.toast.loadFailed"));
    }
  }, [isError, t]);

  const validate = (): CoordinationFormValues | null => {
    const values = form.getValues();
    const failures = COORDINATION_FIELDS.filter((field) => isFieldVisible(field, redisType)).flatMap((field) => {
      const message = field.rules?.map((rule) => rule(values[field.name])).find((result) => result !== null);
      return message === undefined || message === null ? [] : [[field.name, cacheT(message)] as const];
    });

    form.clearErrors();
    failures.forEach(([name, message]) => form.setError(name, { message }));
    return failures.length > 0 ? null : values;
  };

  const handleTestConnection = async () => {
    const values = validate();
    if (values === null) {
      return;
    }

    try {
      const result = await testConnection.mutateAsync(buildCoordinationPayload(redisType, values));
      if (result.status === "healthy") {
        toast.success(t("coordination.toast.testSuccess"));
      } else {
        toast.fromError(t("coordination.toast.testFailed", { reason: result.error ?? t("unknownError") }));
      }
    } catch (error) {
      toast.fromError(
        t("coordination.toast.testFailed", {
          reason: error instanceof Error ? error.message : t("unknownError"),
        }),
      );
    }
  };

  const handleSaveChanges = async () => {
    const values = validate();
    if (values === null) {
      return;
    }

    try {
      await updateSettings.mutateAsync(buildCoordinationPayload(redisType, values));
      toast.success(t("coordination.toast.saveSuccess"));
    } catch {
      toast.fromError(t("coordination.toast.updateFailed"));
    }
  };

  const badge = sourceBadge(data?.source);
  const configuredSecrets = useMemo(() => configuredSecretFields(data?.values ?? {}), [data]);

  return (
    <div className="w-full space-y-8 py-2">
      <FormProvider {...form}>
        <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-foreground">{t("coordinationRedis")}</h3>
              {!isLoading && (
                <StatusBadge tone={badge.tone} label={t(badge.labelKey)} dataTestId="coordination-redis-source" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t("coordination.intro")}</p>
            <p className="text-xs text-muted-foreground">{t(badge.tooltipKey)}</p>
            <p className="text-xs text-warning">{t("restartNote")}</p>
          </div>

          <CoordinationRedisTypeSelector redisType={redisType} onTypeChange={setSelectedRedisType} />

          <div className="pt-4 border-t border-border">
            <CoordinationRedisFieldSection
              title={cacheT("sections.connection")}
              section="connection"
              redisType={redisType}
              configuredSecrets={configuredSecrets}
            />
          </div>

          {redisType === "cluster" && (
            <div className="pt-4 border-t border-border">
              <CoordinationRedisFieldSection
                title={cacheT("sections.cluster")}
                section="cluster"
                redisType={redisType}
                configuredSecrets={configuredSecrets}
                gridCols="grid-cols-1 gap-6"
              />
            </div>
          )}

          {redisType === "sentinel" && (
            <div className="pt-4 border-t border-border">
              <CoordinationRedisFieldSection
                title={cacheT("sections.sentinel")}
                section="sentinel"
                redisType={redisType}
                configuredSecrets={configuredSecrets}
              />
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <CoordinationRedisFieldSection
              title={cacheT("sections.ssl")}
              section="ssl"
              redisType={redisType}
              configuredSecrets={configuredSecrets}
            />
          </div>
        </form>
      </FormProvider>

      <div className="border-t border-border pt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={handleTestConnection} disabled={testConnection.isPending}>
          {testConnection.isPending && <UiLoadingSpinner className="size-4" />}
          {testConnection.isPending ? t("testing") : t("testConnection")}
        </Button>
        <Button onClick={handleSaveChanges} disabled={updateSettings.isPending}>
          {updateSettings.isPending && <UiLoadingSpinner className="size-4" />}
          {updateSettings.isPending ? commonT("saving") : t("saveChanges")}
        </Button>
      </div>
    </div>
  );
};

export default CoordinationRedisSettings;
