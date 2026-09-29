import { Info } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { SimpleTooltip } from "@/components/ui/tooltip";

import { MountedFormField } from "@/components/common_components/MountedFormField";
import UpstreamTokenHeaderField from "./UpstreamTokenHeaderField";
import { requiredRule } from "@/components/common_components/formRules";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requiredUnlessSiblingSet, tagsControl, textControl } from "./mcpFieldRules";

interface IdJagFormFieldsProps {
  isEditing?: boolean;
}

const fieldClassName = "rounded-lg border-border focus:border-info focus:ring-ring";

const FieldLabel: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <span className="text-sm font-medium text-foreground flex items-center">
    {label}
    <SimpleTooltip content={tooltip}>
      <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
    </SimpleTooltip>
  </span>
);

const PRIVATE_KEY_PATH = ["credentials", "client_private_key"] as const;

const IdJagFormFields: React.FC<IdJagFormFieldsProps> = ({ isEditing = false }) => {
  const t = useTranslations("mcpServers");
  const placeholderSuffix = isEditing ? t("form.keepExistingSuffix") : "";
  const requiredWhenCreating = (message: string) =>
    isEditing ? undefined : { validate: { required: requiredRule(message) } };

  return (
    <>
      <MountedFormField
        label={<FieldLabel label={t("idJag.orgTokenEndpoint")} tooltip={t("idJag.orgTokenEndpointTooltip")} />}
        name="token_exchange_endpoint"
        required={!isEditing}
        rules={requiredWhenCreating(t("idJag.orgTokenEndpointRequired"))}
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="https://your-org.okta.com/oauth2/v1/token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <FieldLabel label={t("idJag.resourceTokenEndpoint")} tooltip={t("idJag.resourceTokenEndpointTooltip")} />
        }
        name={["credentials", "id_jag_resource_token_endpoint"]}
        required={!isEditing}
        rules={requiredWhenCreating(t("idJag.resourceTokenEndpointRequired"))}
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="https://upstream.example.com/oauth2/token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.clientId")} tooltip={t("idJag.clientIdTooltip")} />}
        name={["credentials", "client_id"]}
        required={!isEditing}
        rules={requiredWhenCreating(t("idJag.clientIdRequired"))}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={`${t("idJag.clientIdPlaceholder")}${placeholderSuffix}`}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.clientSecret")} tooltip={t("idJag.clientSecretTooltip")} />}
        name={["credentials", "client_secret"]}
        rules={
          isEditing
            ? undefined
            : {
                deps: ["credentials.client_private_key"],
                validate: {
                  secretOrPrivateKey: requiredUnlessSiblingSet(PRIVATE_KEY_PATH, t("idJag.secretOrPrivateKey")),
                },
              }
        }
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={`${t("idJag.clientSecretPlaceholder")}${placeholderSuffix}`}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.clientPrivateKey")} tooltip={t("idJag.clientPrivateKeyTooltip")} />}
        name={PRIVATE_KEY_PATH}
      >
        {(control) => (
          <Textarea
            {...textControl(control)}
            rows={3}
            placeholder={`-----BEGIN PRIVATE KEY-----${placeholderSuffix}`}
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.privateKeyId")} tooltip={t("idJag.privateKeyIdTooltip")} />}
        name={["credentials", "client_private_key_id"]}
      >
        {(control) => <Input {...textControl(control)} placeholder="my-signing-key-1" className={fieldClassName} />}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.assertionSigningAlg")} tooltip={t("idJag.assertionSigningAlgTooltip")} />}
        name={["credentials", "client_assertion_signing_alg"]}
      >
        {(control) => <Input {...textControl(control)} placeholder="RS256" className={fieldClassName} />}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.audience")} tooltip={t("idJag.audienceTooltip")} />}
        name="audience"
      >
        {(control) => (
          <Input {...textControl(control)} placeholder="https://upstream.example.com" className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.resourceIndicator")} tooltip={t("idJag.resourceIndicatorTooltip")} />}
        name={["credentials", "id_jag_resource"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder="https://upstream.example.com/mcp" className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.subjectTokenType")} tooltip={t("idJag.subjectTokenTypeTooltip")} />}
        name="subject_token_type"
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder="urn:ietf:params:oauth:token-type:id_token"
            className={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("idJag.scopes")} tooltip={t("idJag.scopesTooltip")} />}
        name={["credentials", "scopes"]}
      >
        {(control) => (
          <MultiSelect {...tagsControl(control)} placeholder={t("idJag.addScopes")} className="rounded-lg" />
        )}
      </MountedFormField>
      <UpstreamTokenHeaderField />
    </>
  );
};

export default IdJagFormFields;
