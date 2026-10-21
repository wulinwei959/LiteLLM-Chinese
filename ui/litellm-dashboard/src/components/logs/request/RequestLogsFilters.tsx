"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useInfiniteSpendLogEndUsers } from "@/app/(dashboard)/hooks/spendLogs/useSpendLogEndUsers";
import { useInfiniteSpendLogUsers } from "@/app/(dashboard)/hooks/spendLogs/useSpendLogUsers";
import { useInfiniteKeyAliases } from "@/app/(dashboard)/hooks/keys/useKeyAliases";
import { useInfiniteModelInfo } from "@/app/(dashboard)/hooks/models/useModels";
import { DataTableFilterField } from "@/components/shared/DataTable";
import { PaginatedSearchSelect } from "@/components/shared/PaginatedSearchSelect";
import { SearchSelect, type SearchSelectOption } from "@/components/shared/SearchSelect";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Team } from "../key_team_helpers/key_list";
import { ERROR_CODE_OPTIONS } from "./constants";
import { LOG_FILTER_IDS, type LogsWindow } from "./log_filter_logic";

const ALL_VALUE = "all";

const PAGE_SIZE = 50;

const SEARCH_INPUT_REASONS: ReadonlySet<string> = new Set(["input-change", "input-clear", "clear-press"]);

const asString = (value: unknown): string => (typeof value === "string" ? value : "");
const emptyToUndefined = (value: string): string | undefined => (value === "" ? undefined : value);

function TeamFilterField({
  value,
  onChange,
  teams,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  teams: Team[];
}) {
  const t = useTranslations("logs");
  const options = useMemo<SearchSelectOption[]>(
    () =>
      teams.map((team) => ({
        label: team.team_alias || team.team_id,
        value: team.team_id,
        sublabel: team.team_id,
      })),
    [teams],
  );

  return (
    <DataTableFilterField label={t("filters.teamId")}>
      <SearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        placeholder={t("filters.placeholders.searchTeam")}
        emptyText={t("filters.empty.teams")}
      />
    </DataTableFilterField>
  );
}

function KeyAliasFilterField({
  value,
  onChange,
  teamId,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  teamId: string;
}) {
  const t = useTranslations("logs");
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteKeyAliases(
    PAGE_SIZE,
    emptyToUndefined(search),
    emptyToUndefined(teamId),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.aliases.flatMap((alias) => {
        if (!alias || seen.has(alias)) return [];
        seen.add(alias);
        return [{ label: alias, value: alias }];
      }),
    );
  }, [data]);

  return (
    <DataTableFilterField label={t("filters.keyAlias")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("filters.placeholders.searchKeyAlias")}
        emptyText={t("filters.empty.keyAliases")}
      />
    </DataTableFilterField>
  );
}

function ModelFilterField({ value, onChange }: { value: string; onChange: (value: string | undefined) => void }) {
  const t = useTranslations("logs");
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteModelInfo(
    PAGE_SIZE,
    emptyToUndefined(search),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.data.flatMap((model) => {
        const modelId = model.model_info?.id ?? "";
        const modelName = model.model_name ?? "";
        if (!modelId || seen.has(modelId)) return [];
        seen.add(modelId);
        return [{ label: modelName || modelId, value: modelId, sublabel: t("filters.modelIdLabel", { modelId }) }];
      }),
    );
  }, [data, t]);

  return (
    <DataTableFilterField label={t("model")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("filters.placeholders.searchModel")}
        emptyText={t("filters.empty.models")}
      />
    </DataTableFilterField>
  );
}

function UserIdFilterField({
  value,
  onChange,
  logsWindow,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  logsWindow: LogsWindow;
}) {
  const t = useTranslations("logs");
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteSpendLogUsers(
    logsWindow,
    PAGE_SIZE,
    emptyToUndefined(search),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.data.flatMap((userId) => {
        if (!userId || seen.has(userId)) return [];
        seen.add(userId);
        return [{ label: userId, value: userId }];
      }),
    );
  }, [data]);

  return (
    <DataTableFilterField label={t("filters.userId")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("filters.placeholders.searchUser")}
        emptyText={t("filters.empty.users")}
      />
    </DataTableFilterField>
  );
}

function EndUserFilterField({
  value,
  onChange,
  logsWindow,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  logsWindow: LogsWindow;
}) {
  const t = useTranslations("logs");
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteSpendLogEndUsers(
    logsWindow,
    PAGE_SIZE,
    emptyToUndefined(search),
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) =>
      page.data.flatMap((endUser) => {
        if (!endUser || seen.has(endUser)) return [];
        seen.add(endUser);
        return [{ label: endUser, value: endUser }];
      }),
    );
  }, [data]);

  return (
    <DataTableFilterField label={t("filters.endUser")}>
      <PaginatedSearchSelect
        options={options}
        value={value}
        onValueChange={(next) => onChange(next ?? undefined)}
        onSearchChange={setSearch}
        onLoadMore={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        placeholder={t("filters.placeholders.searchEndUser")}
        emptyText={t("filters.empty.endUsers")}
      />
    </DataTableFilterField>
  );
}

function ErrorCodeFilterField({ value, onChange }: { value: string; onChange: (value: string | undefined) => void }) {
  const t = useTranslations("logs");
  const [query, setQuery] = useState("");

  const localizedOptions = useMemo<SearchSelectOption[]>(
    () => ERROR_CODE_OPTIONS.map((option) => ({ label: t(option.labelKey), value: option.value })),
    [t],
  );

  const options = useMemo<SearchSelectOption[]>(() => {
    const trimmed = query.trim();
    const lowered = trimmed.toLowerCase();
    const matches = localizedOptions.filter((option) => option.label.toLowerCase().includes(lowered));
    const isKnownCode = localizedOptions.some(
      (option) => option.value === trimmed || option.label.toLowerCase() === lowered,
    );
    if (trimmed === "" || isKnownCode) return matches;
    return [...matches, { label: t("filters.useCustomCode", { code: trimmed }), value: trimmed }];
  }, [localizedOptions, query, t]);

  const selected = useMemo<SearchSelectOption | null>(() => {
    if (value === "") return null;
    return localizedOptions.find((option) => option.value === value) ?? { label: value, value };
  }, [localizedOptions, value]);

  const items = useMemo<SearchSelectOption[]>(() => {
    if (selected === null) return options;
    if (options.some((option) => option.value === selected.value)) return options;
    return [selected, ...options];
  }, [options, selected]);

  return (
    <DataTableFilterField label={t("filters.errorCode")}>
      <Combobox
        items={items}
        value={selected}
        onValueChange={(item: SearchSelectOption | null) => onChange(emptyToUndefined(item?.value ?? ""))}
        onInputValueChange={(next, eventDetails) => setQuery(SEARCH_INPUT_REASONS.has(eventDetails.reason) ? next : "")}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setQuery("");
        }}
        isItemEqualToValue={(a: SearchSelectOption, b: SearchSelectOption) => a.value === b.value}
        itemToStringLabel={(item: SearchSelectOption) => item.label}
        filter={null}
      >
        <ComboboxInput
          onFocus={(event) => event.currentTarget.select()}
          placeholder={t("filters.placeholders.selectErrorCode")}
          showClear={value !== ""}
          className="w-full"
        />
        <ComboboxContent>
          <ComboboxEmpty>{t("filters.empty.errorCodes")}</ComboboxEmpty>
          <ComboboxList data-testid="error-code-filter-list">
            {(item: SearchSelectOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DataTableFilterField>
  );
}

interface RequestLogsFiltersProps {
  get: (columnId: string) => unknown;
  set: (columnId: string, value: unknown) => void;
  teams: Team[];
  logsWindow: LogsWindow;
}

export function RequestLogsFilters({ get, set, teams, logsWindow }: RequestLogsFiltersProps) {
  const t = useTranslations("logs");
  const valueOf = (id: string): string => asString(get(id));
  const setter = (id: string) => (next: string | undefined) => set(id, next);

  const statusItems = useMemo<{ value: string; label: string }[]>(
    () => [
      { value: ALL_VALUE, label: t("allStatuses") },
      { value: "success", label: t("success") },
      { value: "failure", label: t("failure") },
    ],
    [t],
  );

  const cacheItems = useMemo<{ value: string; label: string }[]>(
    () => [
      { value: ALL_VALUE, label: t("filters.options.allRequests") },
      { value: "hit", label: t("filters.options.cacheHit") },
      { value: "miss", label: t("filters.options.cacheMiss") },
    ],
    [t],
  );

  const credentialItems = useMemo<{ value: string; label: string }[]>(
    () => [
      { value: ALL_VALUE, label: t("filters.options.allCredentials") },
      { value: "true", label: t("filters.options.clientOAuthToken") },
      { value: "false", label: t("filters.options.configuredKey") },
    ],
    [t],
  );

  const spanTypeItems = useMemo<{ value: string; label: string }[]>(
    () => [
      { value: ALL_VALUE, label: t("filters.options.allTypes") },
      { value: "llm", label: t("filters.options.llm") },
      { value: "agent", label: t("filters.options.agent") },
      { value: "mcp", label: t("filters.options.mcp") },
      { value: "batch", label: t("filters.options.batch") },
    ],
    [t],
  );

  return (
    <>
      <TeamFilterField
        value={valueOf(LOG_FILTER_IDS.TEAM_ID)}
        onChange={setter(LOG_FILTER_IDS.TEAM_ID)}
        teams={teams}
      />

      <DataTableFilterField label={t("filters.spanType")}>
        <Select
          items={spanTypeItems}
          value={valueOf(LOG_FILTER_IDS.SPAN_TYPE) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.SPAN_TYPE)}
          onValueChange={(next) =>
            set(LOG_FILTER_IDS.SPAN_TYPE, next === null || next === ALL_VALUE ? undefined : next)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.options.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            {spanTypeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <DataTableFilterField label={t("status")}>
        <Select
          items={statusItems}
          value={valueOf(LOG_FILTER_IDS.STATUS) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.STATUS)}
          onValueChange={(next) => set(LOG_FILTER_IDS.STATUS, next === null || next === ALL_VALUE ? undefined : next)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <DataTableFilterField label={t("filters.cache")}>
        <Select
          items={cacheItems}
          value={valueOf(LOG_FILTER_IDS.CACHE_STATUS) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.CACHE_STATUS)}
          onValueChange={(next) =>
            set(LOG_FILTER_IDS.CACHE_STATUS, next === null || next === ALL_VALUE ? undefined : next)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.options.allRequests")} />
          </SelectTrigger>
          <SelectContent>
            {cacheItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <DataTableFilterField label={t("filters.credential")}>
        <Select
          items={credentialItems}
          value={valueOf(LOG_FILTER_IDS.CREDENTIAL) === "" ? ALL_VALUE : valueOf(LOG_FILTER_IDS.CREDENTIAL)}
          onValueChange={(next) =>
            set(LOG_FILTER_IDS.CREDENTIAL, next === null || next === ALL_VALUE ? undefined : next)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.options.allCredentials")} />
          </SelectTrigger>
          <SelectContent>
            {credentialItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DataTableFilterField>

      <KeyAliasFilterField
        value={valueOf(LOG_FILTER_IDS.KEY_ALIAS)}
        onChange={setter(LOG_FILTER_IDS.KEY_ALIAS)}
        teamId={valueOf(LOG_FILTER_IDS.TEAM_ID)}
      />

      <UserIdFilterField
        value={valueOf(LOG_FILTER_IDS.USER_ID)}
        onChange={setter(LOG_FILTER_IDS.USER_ID)}
        logsWindow={logsWindow}
      />

      <EndUserFilterField
        value={valueOf(LOG_FILTER_IDS.END_USER)}
        onChange={setter(LOG_FILTER_IDS.END_USER)}
        logsWindow={logsWindow}
      />

      <ErrorCodeFilterField value={valueOf(LOG_FILTER_IDS.ERROR_CODE)} onChange={setter(LOG_FILTER_IDS.ERROR_CODE)} />

      <DataTableFilterField label={t("filters.errorMessage")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.ERROR_MESSAGE)}
          onChange={(event) => set(LOG_FILTER_IDS.ERROR_MESSAGE, emptyToUndefined(event.target.value))}
          placeholder={t("filters.placeholders.enterErrorMessage")}
        />
      </DataTableFilterField>

      <DataTableFilterField label={t("filters.keyHash")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.KEY_HASH)}
          onChange={(event) => set(LOG_FILTER_IDS.KEY_HASH, emptyToUndefined(event.target.value))}
          placeholder={t("filters.placeholders.enterKeyHash")}
        />
      </DataTableFilterField>

      <DataTableFilterField label={t("filters.sessionId")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.SESSION_ID)}
          onChange={(event) => set(LOG_FILTER_IDS.SESSION_ID, emptyToUndefined(event.target.value))}
          placeholder={t("filters.placeholders.enterSessionId")}
        />
      </DataTableFilterField>

      <ModelFilterField value={valueOf(LOG_FILTER_IDS.MODEL_ID)} onChange={setter(LOG_FILTER_IDS.MODEL_ID)} />

      <DataTableFilterField label={t("filters.publicModelOrSearchTool")}>
        <Input
          value={valueOf(LOG_FILTER_IDS.PUBLIC_MODEL_OR_SEARCH_TOOL)}
          onChange={(event) => set(LOG_FILTER_IDS.PUBLIC_MODEL_OR_SEARCH_TOOL, emptyToUndefined(event.target.value))}
          placeholder={t("filters.placeholders.enterPublicModel")}
        />
      </DataTableFilterField>
    </>
  );
}
