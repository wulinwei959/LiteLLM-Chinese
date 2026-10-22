import { useTranslations } from "next-intl";
import CopyButton from "@/components/shared/CopyButton";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { $api } from "@/lib/http/api";
import { extractProxyErrorMessage } from "@/lib/http/client";
import type { JwksPanel } from "./credential_federation";

const SavedJwks = ({ credentialName }: { credentialName: string }) => {
  const t = useTranslations("modelAdd");
  const jwks = $api.useQuery("get", "/credentials/{credential_name}/jwks", {
    params: { path: { credential_name: credentialName } },
  });
  if (jwks.isPending || !jwks.isFetchedAfterMount) {
    return <p className="text-sm text-muted-foreground">{t("jwks.loading")}</p>;
  }
  if (jwks.isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {extractProxyErrorMessage(jwks.error)}
      </p>
    );
  }
  const jwksText = JSON.stringify(jwks.data, null, 2);
  return (
    <div className="flex flex-col gap-2">
      <pre aria-label={t("jwks.title")} className="max-h-48 overflow-auto rounded-md border bg-muted p-3 text-xs">
        {jwksText}
      </pre>
      <CopyButton value={jwksText} label={t("jwks.copy")} variant="action" className="self-start" />
    </div>
  );
};

export default function InternalIssuerJwks({ panel }: { panel: JwksPanel }) {
  const t = useTranslations("modelAdd");
  switch (panel.kind) {
    case "hidden":
      return null;
    case "after_save":
      return <p className="mb-4 text-sm text-muted-foreground">{t("jwks.reopenHint")}</p>;
    case "saved":
      return (
        <FieldSet className="mb-4 gap-2">
          <FieldLegend variant="label" className="mb-0">
            {t("jwks.title")}
          </FieldLegend>
          <FieldDescription>{t("jwks.registerHint")}</FieldDescription>
          <SavedJwks credentialName={panel.credentialName} />
        </FieldSet>
      );
  }
}
