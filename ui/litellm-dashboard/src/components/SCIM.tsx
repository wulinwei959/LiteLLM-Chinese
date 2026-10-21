import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { keyCreateCall } from "./networking";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CircleAlert, CirclePlus, Copy, Info, KeyRound, Link } from "lucide-react";
import { parseErrorMessage } from "./shared/errorUtils";
import { toast } from "@/lib/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { useZodForm } from "@/lib/forms/useZodForm";

interface SCIMConfigProps {
  accessToken: string | null;
  userID: string | null;
  proxySettings: any;
}

const buildScimTokenSchema = (nameRequired: string) =>
  z.object({
    key_alias: z.string().min(1, nameRequired),
  });

type SCIMTokenFormValues = z.infer<ReturnType<typeof buildScimTokenSchema>>;

const SCIMConfig: React.FC<SCIMConfigProps> = ({ accessToken, userID, proxySettings }) => {
  const t = useTranslations("scim");
  const commonT = useTranslations("common");
  const form = useZodForm(buildScimTokenSchema(t("nameRequired")), { defaultValues: { key_alias: "" } });
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [baseUrl, setBaseUrl] = useState("<your_proxy_base_url>");

  useEffect(() => {
    let url = "<your_proxy_base_url>";

    if (proxySettings && proxySettings.PROXY_BASE_URL && proxySettings.PROXY_BASE_URL !== undefined) {
      url = proxySettings.PROXY_BASE_URL;
    } else if (typeof window !== "undefined") {
      // Use the current origin as the base URL if no proxy URL is set
      url = window.location.origin;
    }

    setBaseUrl(url);
  }, [proxySettings]);

  const scimBaseUrl = `${baseUrl}/scim/v2`;

  const handleCreateSCIMToken = async (values: SCIMTokenFormValues) => {
    if (!accessToken || !userID) {
      toast.fromError(t("loginRequired"));
      return;
    }

    try {
      setIsCreatingToken(true);

      const formData = {
        key_alias: values.key_alias || t("accessToken"),
        team_id: null,
        models: [],
        allowed_routes: ["/scim/*"],
      };

      const response = await keyCreateCall(accessToken, userID, formData);
      setTokenData(response);
      toast.success(t("created"));
    } catch (error: any) {
      console.error("Error creating SCIM token:", error);
      toast.fromError(t("createFailed") + parseErrorMessage(error));
    } finally {
      setIsCreatingToken(false);
    }
  };

  return (
    <div className="grid grid-cols-1">
      <Card>
        <CardContent>
          <div className="flex items-center mb-4">
            <CardTitle>{t("title")}</CardTitle>
          </div>
          <p className="text-muted-foreground">{t("intro")}</p>

          <Separator className="my-6" />

          <div className="space-y-8">
            {/* Step 1: SCIM URL */}
            <div>
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-info/15 text-info mr-2">1</div>
                <h3 className="text-lg font-medium flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  {t("tenantUrl")}
                </h3>
              </div>
              <p className="text-muted-foreground mb-3">{t("tenantUrlHint")}</p>
              <div className="flex items-center">
                <Input value={scimBaseUrl} disabled={true} readOnly className="grow" />
                <CopyToClipboard text={scimBaseUrl} onCopy={() => toast.success(t("urlCopied"))}>
                  <Button type="button" className="ml-2 flex items-center">
                    <Copy />
                    {commonT("copy")}
                  </Button>
                </CopyToClipboard>
              </div>
            </div>

            {/* Step 2: SCIM Token */}
            <div>
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-info/15 text-info mr-2">2</div>
                <h3 className="text-lg font-medium flex items-center">
                  <KeyRound className="h-5 w-5 mr-2" />
                  {t("authToken")}
                </h3>
              </div>

              <Alert variant="info" className="mb-4">
                <Info />
                <AlertTitle>{t("usingScim")}</AlertTitle>
                <AlertDescription>{t("usingScimDesc")}</AlertDescription>
              </Alert>

              {!tokenData ? (
                <div className="bg-muted p-4 rounded-lg">
                  <form onSubmit={form.handleSubmit(handleCreateSCIMToken)}>
                    <FieldGroup>
                      <FormField control={form.control} name="key_alias" label={t("tokenName")}>
                        {({ ref, ...field }) => <Input {...field} ref={ref} placeholder={t("accessToken")} />}
                      </FormField>
                      <div>
                        <Button
                          type="submit"
                          disabled={isCreatingToken}
                          aria-busy={isCreatingToken}
                          className="flex items-center"
                        >
                          {isCreatingToken ? <UiLoadingSpinner className="size-4" /> : <KeyRound />}
                          {t("createButton")}
                        </Button>
                      </div>
                    </FieldGroup>
                  </form>
                </div>
              ) : (
                <Card className="block p-6 border border-warning/30 bg-warning/10">
                  <div className="flex items-center mb-2 text-warning">
                    <CircleAlert className="h-5 w-5 mr-2" />
                    <h4 className="text-lg font-medium text-warning">{t("yourToken")}</h4>
                  </div>
                  <p className="text-warning mb-4 font-medium">{t("tokenWarning")}</p>
                  <div className="flex items-center">
                    <Input value={tokenData.key} className="grow mr-2" type="password" disabled={true} readOnly />
                    <CopyToClipboard text={tokenData.key} onCopy={() => toast.success(t("tokenCopied"))}>
                      <Button type="button" className="flex items-center">
                        <Copy />
                        {commonT("copy")}
                      </Button>
                    </CopyToClipboard>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4 flex items-center"
                    onClick={() => setTokenData(null)}
                  >
                    <CirclePlus />
                    {t("createAnotherToken")}
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SCIMConfig;
