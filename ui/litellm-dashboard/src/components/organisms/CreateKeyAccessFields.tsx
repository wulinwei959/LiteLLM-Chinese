"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TagsInput } from "@/app/(dashboard)/guardrails/_components/content_filter/TagsInput";
import { Info } from "lucide-react";
import { isProxyAdminRole } from "../../utils/roles";
import AccessGroupSelector from "../common_components/AccessGroupSelector";
import PassThroughRoutesSelector from "../common_components/PassThroughRoutesSelector";
import { MountedFormField } from "../common_components/MountedFormField";
import { Team } from "../key_team_helpers/key_list";
import VectorStoreSelector from "../vector_store_management/VectorStoreSelector";

interface CreateKeyAccessFieldsProps {
  readonly canEditGuardrails: boolean;
  readonly canViewPolicies: boolean;
  readonly canViewPrompts: boolean;
  readonly premiumUser: boolean | null;
  readonly userRole: string | null;
  readonly accessToken: string;
  readonly guardrailsList: string[];
  readonly policiesList: string[];
  readonly promptsList: string[];
  readonly tagOptions: { value: string; label: string }[];
  readonly selectedCreateKeyTeam: Team | null;
}

export const CreateKeyAccessFields: React.FC<CreateKeyAccessFieldsProps> = ({
  canEditGuardrails,
  canViewPolicies,
  canViewPrompts,
  premiumUser,
  userRole,
  accessToken,
  guardrailsList,
  policiesList,
  promptsList,
  tagOptions,
  selectedCreateKeyTeam,
}) => {
  const t = useTranslations("virtualKeys");
  const ct = useTranslations("virtualKeys.createForm");
  const guardrailsT = useTranslations("guardrails");
  const policiesT = useTranslations("policies");

  return (
    <>
      <MountedFormField
        label={
          <span>
            {guardrailsT("title")}{" "}
            <SimpleTooltip content={ct("guardrailsHint")}>
              <a
                href="https://docs.litellm.ai/docs/proxy/guardrails/quick_start"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent accordion from collapsing when clicking link
              >
                <Info className="ml-1 inline size-3.5 align-text-bottom" />
              </a>
            </SimpleTooltip>
          </span>
        }
        name="guardrails"
        className="mt-4"
        help={canEditGuardrails ? ct("selectExistingGuardrails") : ct("guardrailsPremium")}
      >
        {(control) => (
          <TagsInput
            id={control.id}
            value={(control.value as string[] | undefined) ?? []}
            onValueChange={control.onChange}
            disabled={!canEditGuardrails}
            placeholder={!canEditGuardrails ? ct("guardrailsPremium") : ct("selectOrEnterGuardrails")}
            options={guardrailsList.map((name) => ({ value: name, label: name }))}
          />
        )}
      </MountedFormField>
      {userRole != null && isProxyAdminRole(userRole) && (
        <MountedFormField
          label={
            <span>
              {t("info.disableGlobalGuardrailsLabel")}{" "}
              <SimpleTooltip content={t("editForm.disableGlobalGuardrailsHint")}>
                <a
                  href="https://docs.litellm.ai/docs/proxy/guardrails/quick_start"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Prevent accordion from collapsing when clicking link
                >
                  <Info className="ml-1 inline size-3.5 align-text-bottom" />
                </a>
              </SimpleTooltip>
            </span>
          }
          name="disable_global_guardrails"
          className="mt-4"
          help={canEditGuardrails ? ct("bypassGlobalGuardrailsHelp") : ct("globalGuardrailsPremium")}
        >
          {(control) => (
            <Switch
              id={control.id}
              checked={control.value === true}
              onCheckedChange={control.onChange}
              disabled={!canEditGuardrails}
              aria-describedby={control["aria-describedby"]}
            />
          )}
        </MountedFormField>
      )}
      {canViewPolicies && (
        <MountedFormField
          label={
            <span>
              {policiesT("title")}{" "}
              <SimpleTooltip content={t("editForm.policiesHint")}>
                <a
                  href="https://docs.litellm.ai/docs/proxy/guardrails/guardrail_policies"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Prevent accordion from collapsing when clicking link
                >
                  <Info className="ml-1 inline size-3.5 align-text-bottom" />
                </a>
              </SimpleTooltip>
            </span>
          }
          name="policies"
          className="mt-4"
          help={premiumUser ? ct("selectExistingPolicies") : ct("policiesPremium")}
        >
          {(control) => (
            <TagsInput
              id={control.id}
              value={(control.value as string[] | undefined) ?? []}
              onValueChange={control.onChange}
              disabled={!premiumUser}
              placeholder={!premiumUser ? ct("policiesPremium") : ct("selectOrEnterPolicies")}
              options={policiesList.map((name) => ({ value: name, label: name }))}
            />
          )}
        </MountedFormField>
      )}
      {canViewPrompts && (
        <MountedFormField
          label={
            <span>
              {t("info.promptsLabel")}{" "}
              <SimpleTooltip content={ct("promptsHint")}>
                <a
                  href="https://docs.litellm.ai/docs/proxy/prompt_management"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Prevent accordion from collapsing when clicking link
                >
                  <Info className="ml-1 inline size-3.5 align-text-bottom" />
                </a>
              </SimpleTooltip>
            </span>
          }
          name="prompts"
          className="mt-4"
          help={premiumUser ? ct("selectExistingPrompts") : t("editForm.promptsPremiumPlaceholder")}
        >
          {(control) => (
            <TagsInput
              id={control.id}
              value={(control.value as string[] | undefined) ?? []}
              onValueChange={control.onChange}
              disabled={!premiumUser}
              placeholder={!premiumUser ? t("editForm.promptsPremiumPlaceholder") : t("editForm.selectOrEnterPrompts")}
              options={promptsList.map((name) => ({ value: name, label: name }))}
            />
          )}
        </MountedFormField>
      )}
      <MountedFormField
        label={
          <span>
            {t("editForm.accessGroups")}{" "}
            <SimpleTooltip content={t("editForm.accessGroupsHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="access_group_ids"
        className="mt-4"
        help={ct("accessGroupsHelp")}
      >
        {(control) => (
          <AccessGroupSelector
            value={control.value as string[] | undefined}
            onChange={control.onChange}
            placeholder={t("editForm.selectAccessGroups")}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span>
            {t("info.allowedPassThroughRoutesLabel")}{" "}
            <SimpleTooltip content={ct("passThroughHint")}>
              <a
                href="https://docs.litellm.ai/docs/proxy/pass_through"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent accordion from collapsing when clicking link
              >
                <Info className="ml-1 inline size-3.5 align-text-bottom" />
              </a>
            </SimpleTooltip>
          </span>
        }
        name="allowed_passthrough_routes"
        className="mt-4"
        help={premiumUser ? ct("selectExistingPassThrough") : ct("passThroughPremium")}
      >
        {(control) => (
          <PassThroughRoutesSelector
            value={control.value as string[] | undefined}
            onChange={control.onChange}
            accessToken={accessToken}
            placeholder={!premiumUser ? ct("passThroughPremium") : ct("selectOrEnterPassThrough")}
            disabled={!premiumUser}
            teamId={selectedCreateKeyTeam ? selectedCreateKeyTeam.team_id : null}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span>
            {ct("allowedVectorStores")}{" "}
            <SimpleTooltip content={ct("vectorStoresHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="allowed_vector_store_ids"
        className="mt-4"
        help={ct("vectorStoresHelp")}
      >
        {(control) => (
          <VectorStoreSelector
            onChange={control.onChange}
            value={control.value as string[] | undefined}
            accessToken={accessToken}
            placeholder={ct("vectorStoresPlaceholder")}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span>
            {t("info.metadataLabel")}{" "}
            <SimpleTooltip content={ct("metadataHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="metadata"
        className="mt-4"
      >
        {(control) => (
          <Textarea
            {...control}
            value={(control.value as string | undefined) ?? ""}
            rows={4}
            placeholder={ct("metadataPlaceholder")}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span>
            {t("info.tagsLabel")}{" "}
            <SimpleTooltip content={ct("tagsHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="tags"
        className="mt-4"
        help={ct("tagsHelp")}
      >
        {(control) => (
          <TagsInput
            id={control.id}
            value={(control.value as string[] | undefined) ?? []}
            onValueChange={control.onChange}
            placeholder={t("editForm.selectOrEnterTags")}
            tokenSeparators={[","]}
            options={tagOptions}
          />
        )}
      </MountedFormField>
    </>
  );
};
