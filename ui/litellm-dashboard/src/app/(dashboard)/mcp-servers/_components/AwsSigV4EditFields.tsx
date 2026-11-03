import { Info } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { SimpleTooltip } from "@/components/ui/tooltip";

import { MountedFormField } from "@/components/common_components/MountedFormField";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { textControl } from "./mcpFieldRules";

interface AwsSigV4EditFieldsProps {
  readonly isEditing: boolean;
}

const fieldClassName = "rounded-lg border-border focus:border-info focus:ring-ring";

export const AwsSigV4EditFields: React.FC<AwsSigV4EditFieldsProps> = ({ isEditing }) => {
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
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.region")}
            <SimpleTooltip content={t("awsSigv4.regionTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_region_name"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder={t("edit.awsRegionPlaceholder")} className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.serviceName")}
            <SimpleTooltip content={t("awsSigv4.serviceNameTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_service_name"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder={t("edit.awsServicePlaceholder")} className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.accessKeyId")}
            <SimpleTooltip content={t("awsSigv4.accessKeyIdTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_access_key_id"]}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={t("edit.keepExistingOnly")}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.secretAccessKey")}
            <SimpleTooltip content={t("awsSigv4.secretAccessKeyTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_secret_access_key"]}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={t("edit.keepExistingOnly")}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.sessionToken")}
            <SimpleTooltip content={t("awsSigv4.sessionTokenTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_session_token"]}
      >
        {(control) => (
          <PasswordInput
            {...textControl(control)}
            placeholder={t("edit.keepExistingOnly")}
            groupClassName={fieldClassName}
          />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.roleArn")}
            <SimpleTooltip content={t("edit.awsRoleArnTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_role_name"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder={t("edit.keepExistingOnly")} className={fieldClassName} />
        )}
      </MountedFormField>
      <MountedFormField
        label={
          <span className="text-sm font-medium text-foreground flex items-center">
            {t("awsSigv4.sessionName")}
            <SimpleTooltip content={t("awsSigv4.sessionNameTooltip")}>
              <Info className="ml-2 size-4 text-info hover:text-info/80 cursor-help" />
            </SimpleTooltip>
          </span>
        }
        name={["credentials", "aws_session_name"]}
      >
        {(control) => (
          <Input {...textControl(control)} placeholder={t("edit.keepExistingOnly")} className={fieldClassName} />
        )}
      </MountedFormField>
    </>
  );
};
