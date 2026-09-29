import { Info } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OAUTH_FLOW } from "@/components/mcp_tools/types";
import { MountedFormField } from "@/components/common_components/MountedFormField";
import { requiredRule } from "@/components/common_components/formRules";
import TokenEndpointAuthMethodField from "./TokenEndpointAuthMethodField";
import UpstreamTokenHeaderField from "./UpstreamTokenHeaderField";
import {
  numberControl,
  parsesAsJson,
  selectControl,
  selectTriggerControl,
  tagsControl,
  textControl,
} from "./mcpFieldRules";

interface OAuthFlowStatus {
  startOAuthFlow: () => void;
  status: string;
  error: string | null;
  tokenResponse: { access_token?: string; expires_in?: number } | null;
}

interface OAuthFormFieldsProps {
  isM2M: boolean;
  isEditing?: boolean;
  oauthFlow?: OAuthFlowStatus;
  initialFlowType?: string;
  /** Link to provider docs for creating an OAuth app (e.g. GitHub). */
  docsUrl?: string | null;
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

const UpstreamResourceField: React.FC = () => {
  const t = useTranslations("mcpServers");
  return (
    <MountedFormField
      label={<FieldLabel label={t("oauth.resourceIndicator")} tooltip={t("oauth.resourceIndicatorTooltip")} />}
      name={["credentials", "upstream_resource"]}
    >
      {(control) => (
        <Input
          {...textControl(control)}
          placeholder={t("oauth.resourceIndicatorPlaceholder")}
          className={fieldClassName}
        />
      )}
    </MountedFormField>
  );
};

const OAuthFormFields: React.FC<OAuthFormFieldsProps> = ({
  isM2M,
  isEditing = false,
  oauthFlow,
  initialFlowType,
  docsUrl,
}) => {
  const t = useTranslations("mcpServers");
  const flowItems = [
    { value: OAUTH_FLOW.M2M, label: t("oauth.flowM2M") },
    { value: OAUTH_FLOW.INTERACTIVE, label: t("oauth.flowInteractive") },
  ];
  const placeholderSuffix = isEditing ? t("form.keepExistingSuffix") : "";
  const requiredWhenCreating = (message: string) =>
    isEditing ? undefined : { validate: { required: requiredRule(message) } };

  return (
    <>
      <MountedFormField
        label={<FieldLabel label={t("oauth.flowType")} tooltip={t("oauth.flowTypeTooltip")} />}
        name="oauth_flow_type"
        {...(initialFlowType ? { defaultValue: initialFlowType } : {})}
      >
        {(control) => (
          <Select {...selectControl<string>(control)} items={flowItems}>
            <SelectTrigger {...selectTriggerControl(control)} className="w-full rounded-lg">
              <SelectValue placeholder={t("oauth.selectFlow")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OAUTH_FLOW.M2M}>
                <div>
                  <span className="font-medium">{t("oauth.flowM2M")}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{t("oauth.flowM2MHint")}</span>
                </div>
              </SelectItem>
              <SelectItem value={OAUTH_FLOW.INTERACTIVE}>
                <div>
                  <span className="font-medium">{t("oauth.flowInteractive")}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{t("oauth.flowInteractiveHint")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </MountedFormField>

      {isM2M ? (
        <>
          <MountedFormField
            label={<FieldLabel label={t("idJag.clientId")} tooltip={t("oauth.m2mClientIdTooltip")} />}
            name={["credentials", "client_id"]}
            required={!isEditing}
            rules={requiredWhenCreating(t("oauth.m2mClientIdRequired"))}
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
            label={<FieldLabel label={t("idJag.clientSecret")} tooltip={t("oauth.m2mClientSecretTooltip")} />}
            name={["credentials", "client_secret"]}
            required={!isEditing}
            rules={requiredWhenCreating(t("oauth.m2mClientSecretRequired"))}
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
            label={<FieldLabel label="Token URL" tooltip={t("oauth.m2mTokenUrlTooltip")} />}
            name="token_url"
            required={!isEditing}
            rules={requiredWhenCreating(t("oauth.m2mTokenUrlRequired"))}
          >
            {(control) => (
              <Input
                {...textControl(control)}
                placeholder="https://auth.example.com/oauth/token"
                className={fieldClassName}
              />
            )}
          </MountedFormField>
          <TokenEndpointAuthMethodField isEditing={isEditing} />
          <MountedFormField
            label={<FieldLabel label={t("oauth.scopesOptional")} tooltip={t("oauth.m2mScopesTooltip")} />}
            name={["credentials", "scopes"]}
          >
            {(control) => (
              <MultiSelect {...tagsControl(control)} placeholder={t("idJag.addScopes")} className="rounded-lg" />
            )}
          </MountedFormField>
          <UpstreamResourceField />
          <UpstreamTokenHeaderField />
        </>
      ) : (
        <>
          <MountedFormField
            label={
              <span className="flex items-center justify-between w-full">
                <FieldLabel label={t("oauth.clientIdOptional")} tooltip={t("oauth.optionalBecauseNoDcr")} />
                {docsUrl && (
                  <a
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-info hover:text-info/80 ml-2 font-normal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("oauth.createApp")}
                  </a>
                )}
              </span>
            }
            name={["credentials", "client_id"]}
          >
            {(control) => (
              <PasswordInput
                {...textControl(control)}
                placeholder={`${t("oauth.enterClientId")}${placeholderSuffix}`}
                groupClassName={fieldClassName}
              />
            )}
          </MountedFormField>
          <MountedFormField
            label={<FieldLabel label={t("oauth.clientSecretOptional")} tooltip={t("oauth.optionalBecauseNoDcr")} />}
            name={["credentials", "client_secret"]}
          >
            {(control) => (
              <PasswordInput
                {...textControl(control)}
                placeholder={`${t("oauth.enterClientSecret")}${placeholderSuffix}`}
                groupClassName={fieldClassName}
              />
            )}
          </MountedFormField>
          <MountedFormField
            label={<FieldLabel label={t("oauth.scopesOptional")} tooltip={t("oauth.interactiveScopesTooltip")} />}
            name={["credentials", "scopes"]}
          >
            {(control) => (
              <MultiSelect {...tagsControl(control)} placeholder={t("idJag.addScopes")} className="rounded-lg" />
            )}
          </MountedFormField>
          <UpstreamResourceField />
          <UpstreamTokenHeaderField />
          <MountedFormField
            label={<FieldLabel label={t("oauth.issuer")} tooltip={t("oauth.issuerTooltip")} />}
            name="issuer"
          >
            {(control) => (
              <Input {...textControl(control)} placeholder="https://issuer.example.com" className={fieldClassName} />
            )}
          </MountedFormField>
          <MountedFormField
            label={<FieldLabel label={t("oauth.authorizationUrl")} tooltip={t("oauth.authorizationUrlTooltip")} />}
            name="authorization_url"
          >
            {(control) => (
              <Input
                {...textControl(control)}
                placeholder="https://example.com/oauth/authorize"
                className={fieldClassName}
              />
            )}
          </MountedFormField>
          <MountedFormField
            label={<FieldLabel label={t("oauth.tokenUrlOptional")} tooltip={t("oauth.tokenUrlOptionalTooltip")} />}
            name="token_url"
          >
            {(control) => (
              <Input
                {...textControl(control)}
                placeholder="https://example.com/oauth/token"
                className={fieldClassName}
              />
            )}
          </MountedFormField>
          <TokenEndpointAuthMethodField isEditing={isEditing} />
          <MountedFormField
            label={<FieldLabel label={t("oauth.registrationUrl")} tooltip={t("oauth.registrationUrlTooltip")} />}
            name="registration_url"
          >
            {(control) => (
              <Input
                {...textControl(control)}
                placeholder="https://example.com/oauth/register"
                className={fieldClassName}
              />
            )}
          </MountedFormField>
          <MountedFormField
            label={
              <FieldLabel label={t("oauth.tokenValidationRules")} tooltip={t("oauth.tokenValidationRulesTooltip")} />
            }
            name="token_validation_json"
            rules={{ validate: { json: parsesAsJson(t("oauth.tokenValidationInvalidJson")) } }}
          >
            {(control) => (
              <Textarea
                {...textControl(control)}
                placeholder={'{\n  "organization": "my-org",\n  "team.id": "123"\n}'}
                rows={4}
                className="font-mono text-sm rounded-lg border-border focus:border-info focus:ring-ring"
              />
            )}
          </MountedFormField>
          <MountedFormField
            label={<FieldLabel label={t("oauth.tokenStorageTtl")} tooltip={t("oauth.tokenStorageTtlTooltip")} />}
            name="token_storage_ttl_seconds"
          >
            {(control) => (
              <Input {...numberControl(control)} min={1} placeholder="e.g. 3600" className="w-full rounded-lg" />
            )}
          </MountedFormField>
          {oauthFlow && (
            <div className="rounded-lg border border-dashed border-border p-4 space-y-2">
              <p className="text-sm text-muted-foreground">{t("oauth.authorizeIntro")}</p>
              <Button
                variant="secondary"
                onClick={oauthFlow.startOAuthFlow}
                disabled={oauthFlow.status === "authorizing" || oauthFlow.status === "exchanging"}
              >
                {oauthFlow.status === "authorizing"
                  ? t("passthrough.button.authorizing")
                  : oauthFlow.status === "exchanging"
                    ? t("passthrough.button.exchanging")
                    : t("oauth.authorizeAndFetchToken")}
              </Button>
              {oauthFlow.error && <p className="text-sm text-destructive">{oauthFlow.error}</p>}
              {oauthFlow.status === "success" && oauthFlow.tokenResponse?.access_token && (
                <p className="text-sm text-success">
                  {t("oauth.tokenFetched", { seconds: oauthFlow.tokenResponse.expires_in ?? "?" })}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OAuthFormFields;
