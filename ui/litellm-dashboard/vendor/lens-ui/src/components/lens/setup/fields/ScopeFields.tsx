"use client";

import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "../../../ui/combobox";
import { Input } from "../../../ui/input";
import type { InvestigationInput } from "../investigationSchema";
import type { ScopeOptions } from "../useMatchingActivity";

import { MetadataFilters } from "./MetadataFilters";
import { useLensTranslate } from "../../../../host/useLensTranslate";

const selectClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

export function ScopeFields({ names, agentsLoading, agentsError, retryAgents, attributes, keys }: ScopeOptions) {
  const t = useLensTranslate();
  const { control, register, setValue } = useFormContext<InvestigationInput>();
  const selection = useWatch({ control, name: "selection" });
  const filters = selection.filters ?? [];
  const hasOptionalScope = !!selection.team_id || !!selection.service;
  const showAdvancedByDefault = !!selection.filters.length || hasOptionalScope || selection.source !== "traces";
  const [advanced, setAdvanced] = useState(showAdvancedByDefault);
  const nameFieldName = selection.source === "requests" ? "selection.service" : "selection.agent_name";
  const selectedName = selection.source === "requests" ? selection.service : selection.agent_name;
  const nameLabel = selection.source === "requests" ? t("setup.modelGroupOptional") : t("setup.agentOptional");
  return (
    <>
      <label className="grid gap-2 text-sm font-medium">
        {nameLabel}
        <Controller
          control={control}
          name={nameFieldName}
          render={({ field }) => (
            <Combobox
              items={names}
              value={field.value || null}
              inputValue={field.value ?? ""}
              onInputValueChange={field.onChange}
              onValueChange={(name) => field.onChange(name ?? "")}
            >
              <ComboboxInput
                aria-label={nameLabel}
                placeholder={selection.source === "requests" ? t("setup.allModelGroups") : t("setup.allAgentsActivity")}
                showClear={!!selectedName}
                className="w-full h-9"
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {agentsLoading ? t("agents.loadingAgents") : t("investigations.matchesEnterRecordedName")}
                </ComboboxEmpty>
                <ComboboxList>
                  {(name: string) => (
                    <ComboboxItem key={name} value={name}>
                      {name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        />
      </label>
      {selection.source !== "requests" && agentsError && (
        <p role="alert" className="text-sm text-destructive">
          {t("setup.couldLoadAgents")}{" "}
          <button type="button" className="underline" onClick={retryAgents}>
            {t("investigations.retry")}</button>
        </p>
      )}
      <details open={advanced} onToggle={(event) => setAdvanced(event.currentTarget.open)} className="group">
        <summary className="cursor-pointer text-sm font-medium">
          {t("setup.advancedFiltersvalue0", { value0: filters.length ? ` (${filters.length})` : "" })}</summary>
        <div className="mt-4 space-y-4">
          {selection.source !== "requests" && (
            <label className="grid gap-2 text-sm">
              {t("setup.applicationOptional")}<Input {...register("selection.service")} placeholder={t("setup.allApplications")} />
            </label>
          )}
          <label className="grid gap-2 text-sm">
            {t("setup.activityType")}<select
              {...register("selection.source", {
                onChange: () => {
                  setValue("selection.service", "");
                  setValue("selection.agent_name", "");
                  setValue("selection.filters", []);
                },
              })}
              className={selectClass}
            >
              <option value="traces">{t("model.agentTraces")}</option>
              <option value="requests">{t("model.lLMRequests")}</option>
              <option value="both">{t("setup.tracesLLMRequests")}</option>
            </select>
          </label>
          <p className="text-xs leading-5 text-muted-foreground">
            {t("setup.matchAnyRecordedMetadata")}</p>
          <MetadataFilters attributes={attributes} keys={keys} />
          <label className="grid gap-2 text-sm">
            {t("setup.teamIDOptional")}<Input {...register("selection.team_id")} placeholder={t("setup.allAccessibleTeams")} />
          </label>
        </div>
      </details>
    </>
  );
}
