"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldTitle } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { AgentFormField, AgentFormValues, labelWithHint } from "./AgentFormKit";
import {
  KILL_SWITCH_AUTH_TYPES,
  KILL_SWITCH_METHODS,
  validateKillSwitchBody,
  type KillSwitchAuthType,
} from "./kill_switch_config";

const AUTH_TYPE_LABEL_KEYS = {
  none: "authTypeNone",
  bearer: "bearerToken",
  api_key: "authTypeApiKey",
  basic: "authTypeBasic",
} as const satisfies Record<KillSwitchAuthType, string>;

const KeyValueFieldArray = ({
  name,
  addLabel,
  removeLabel,
  keyPlaceholder,
  valuePlaceholder,
}: {
  name: "kill_switch.headers" | "kill_switch.query_params";
  addLabel: string;
  removeLabel: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
}) => {
  const t = useTranslations("agents");
  const { control } = useFormContext<AgentFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-2">
          <AgentFormField name={`${name}.${index}.key`} rules={{ required: t("keyNameRequired") }}>
            {({ value, onChange, ref, ...control }) => (
              <Input
                {...control}
                ref={ref}
                className="w-55"
                placeholder={keyPlaceholder}
                value={typeof value === "string" ? value : ""}
                onChange={onChange}
              />
            )}
          </AgentFormField>
          <AgentFormField name={`${name}.${index}.value`}>
            {({ value, onChange, ref, ...control }) => (
              <Input
                {...control}
                ref={ref}
                className="w-65"
                placeholder={valuePlaceholder}
                value={typeof value === "string" ? value : ""}
                onChange={onChange}
              />
            )}
          </AgentFormField>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={removeLabel}
            className="text-destructive hover:text-destructive/80"
            onClick={() => remove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => append({})}>
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
};

const TextField = ({
  name,
  label,
  placeholder,
  required,
  secret,
}: {
  name: `kill_switch.${string}`;
  label: React.ReactNode;
  placeholder?: string;
  required?: string;
  secret?: boolean;
}) => (
  <AgentFormField name={name} label={label} rules={required ? { required } : undefined}>
    {({ value, onChange, ref, ...control }) =>
      secret ? (
        <PasswordInput
          {...control}
          ref={ref}
          placeholder={placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      ) : (
        <Input
          {...control}
          ref={ref}
          placeholder={placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      )
    }
  </AgentFormField>
);

const KillSwitchAuthFields = () => {
  const t = useTranslations("agents");
  const { control } = useFormContext<AgentFormValues>();
  const authType = useWatch({ control, name: "kill_switch.auth_type" });

  switch (authType) {
    case "bearer":
      return <TextField name="kill_switch.auth_token" label={t("bearerToken")} required={t("tokenRequired")} secret />;
    case "api_key":
      return (
        <>
          <TextField name="kill_switch.auth_header_name" label={t("headerNameLabel")} placeholder={t("xApiKey")} />
          <TextField name="kill_switch.auth_api_key" label={t("apiKeyLabel")} required={t("apiKeyRequired")} secret />
        </>
      );
    case "basic":
      return (
        <>
          <TextField name="kill_switch.auth_username" label={t("username")} required={t("usernameRequired")} />
          <TextField name="kill_switch.auth_password" label={t("password")} required={t("passwordRequired")} secret />
        </>
      );
    default:
      return null;
  }
};

const KillSwitchFormFields = () => {
  const t = useTranslations("agents");
  return (
    <>
      <TextField
        name="kill_switch.url"
        label={labelWithHint(t("webhookUrl"), t("webhookUrlHint"))}
        placeholder="https://example.com/hooks/kill-agent"
      />

      <AgentFormField name="kill_switch.method" label={t("method")}>
        {({ value, onChange, ref: _ref, ...control }) => (
          <Select value={typeof value === "string" ? value : "POST"} onValueChange={onChange}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KILL_SWITCH_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </AgentFormField>

      <Field>
        <FieldTitle>{t("headers")}</FieldTitle>
        <KeyValueFieldArray
          name="kill_switch.headers"
          addLabel={t("addHeader")}
          removeLabel={t("removeHeader")}
          keyPlaceholder={t("headerNamePh")}
          valuePlaceholder={t("headerValuePh")}
        />
      </Field>

      <Field>
        <FieldTitle>{t("queryParams")}</FieldTitle>
        <KeyValueFieldArray
          name="kill_switch.query_params"
          addLabel={t("addQueryParam")}
          removeLabel={t("removeQueryParam")}
          keyPlaceholder={t("queryNamePh")}
          valuePlaceholder={t("queryValuePh")}
        />
      </Field>

      <AgentFormField
        name="kill_switch.body"
        label={labelWithHint(t("jsonBodyLabel"), t("jsonBodyHint"))}
        rules={{ validate: (value) => validateKillSwitchBody(t, typeof value === "string" ? value : "") }}
      >
        {({ value, onChange, ref, ...control }) => (
          <Textarea
            {...control}
            ref={ref}
            rows={4}
            placeholder='{"reason": "manual kill switch"}'
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
          />
        )}
      </AgentFormField>

      <AgentFormField name="kill_switch.auth_type" label={t("authentication")}>
        {({ value, onChange, ref: _ref, ...control }) => (
          <Select value={typeof value === "string" ? value : "none"} onValueChange={onChange}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KILL_SWITCH_AUTH_TYPES.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(AUTH_TYPE_LABEL_KEYS[value])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </AgentFormField>

      <KillSwitchAuthFields />
    </>
  );
};

export default KillSwitchFormFields;
