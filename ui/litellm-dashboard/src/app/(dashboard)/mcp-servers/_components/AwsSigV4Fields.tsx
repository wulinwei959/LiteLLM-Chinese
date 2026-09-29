import { Info } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { SimpleTooltip } from "@/components/ui/tooltip";

import { MountedFormField } from "@/components/common_components/MountedFormField";
import { requiredRule } from "@/components/common_components/formRules";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { requiredWhenSiblingSet, textControl } from "./mcpFieldRules";

const fieldClassName = "rounded-lg border-border focus:border-info focus:ring-ring";

const FieldLabel: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <span className="text-sm font-medium text-foreground flex items-center">
    {label}
    <SimpleTooltip content={tooltip}>
      <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
    </SimpleTooltip>
  </span>
);

const ACCESS_KEY_PATH = ["credentials", "aws_access_key_id"] as const;
const SECRET_KEY_PATH = ["credentials", "aws_secret_access_key"] as const;

const AwsSigV4Fields: React.FC = () => {
  const t = useTranslations("mcpServers");
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">
        {t("awsSigv4.intro")}
        <a
          href="https://docs.litellm.ai/docs/mcp_aws_sigv4"
          target="_blank"
          rel="noopener noreferrer"
          className="text-info hover:text-info/80"
        >
          {t("awsSigv4.viewDocs")}
        </a>
      </p>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.region")} tooltip={t("awsSigv4.regionTooltip")} />}
        name={["credentials", "aws_region_name"]}
        required
        rules={{ validate: { required: requiredRule(t("awsSigv4.regionRequired")) } }}
      >
        {(control) => <Input {...textControl(control)} placeholder="us-east-1" className={fieldClassName} />}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.serviceName")} tooltip={t("awsSigv4.serviceNameTooltip")} />}
        name={["credentials", "aws_service_name"]}
      >
        {(control) => <Input {...textControl(control)} placeholder="bedrock-agentcore" className={fieldClassName} />}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.accessKeyId")} tooltip={t("awsSigv4.accessKeyIdTooltip")} />}
        name={ACCESS_KEY_PATH}
        rules={{
          deps: ["credentials.aws_secret_access_key"],
          validate: {
            pairedWithSecret: requiredWhenSiblingSet(SECRET_KEY_PATH, t("awsSigv4.accessKeyIdPaired")),
          },
        }}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={t("awsSigv4.accessKeyIdPlaceholder")}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.secretAccessKey")} tooltip={t("awsSigv4.secretAccessKeyTooltip")} />}
        name={SECRET_KEY_PATH}
        rules={{
          deps: ["credentials.aws_access_key_id"],
          validate: {
            pairedWithAccessKey: requiredWhenSiblingSet(ACCESS_KEY_PATH, t("awsSigv4.secretAccessKeyPaired")),
          },
        }}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={t("awsSigv4.secretAccessKeyPlaceholder")}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.sessionToken")} tooltip={t("awsSigv4.sessionTokenTooltip")} />}
        name={["credentials", "aws_session_token"]}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={t("awsSigv4.sessionTokenPlaceholder")}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.roleArn")} tooltip={t("awsSigv4.roleArnTooltip")} />}
        name={["credentials", "aws_role_name"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder={t("awsSigv4.roleArnPlaceholder")} className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={<FieldLabel label={t("awsSigv4.sessionName")} tooltip={t("awsSigv4.sessionNameTooltip")} />}
        name={["credentials", "aws_session_name"]}
      >
        {(control) => (
          <Input
            {...textControl(control)}
            placeholder={t("awsSigv4.sessionNamePlaceholder")}
            className={fieldClassName}
          />
        )}
      </MountedFormField>
    </>
  );
};

export default AwsSigV4Fields;
