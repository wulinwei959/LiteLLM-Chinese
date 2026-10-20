import { type FC } from "react";
import { useTranslations } from "next-intl";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { SelectItem } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TRANSPORT, TRANSPORT_ITEMS } from "@/components/mcp_tools/types";
import { $api } from "@/lib/http/api";

export const useMcpStdioEnabled = (): boolean =>
  $api.useQuery("get", "/.well-known/litellm-ui-config").data?.mcp_stdio_enabled !== false;

export const TransportSelectItems: FC<{ stdioEnabled: boolean }> = ({ stdioEnabled }) => {
  const t = useTranslations("mcpServers");
  return (
    <>
      {TRANSPORT_ITEMS.map((item) => {
        const disabled = item.value === TRANSPORT.STDIO && !stdioEnabled;
        return (
          <SelectItem key={item.value} value={item.value} disabled={disabled}>
            {t(item.labelKey)}
            {disabled && <SimpleTooltip content={t("stdioDisabledMessage")} className="pointer-events-auto" />}
          </SelectItem>
        );
      })}
    </>
  );
};

export const StdioDisabledBanner: FC = () => {
  const t = useTranslations("mcpServers");
  return (
    <Alert variant="warning" className="mb-4 rounded-lg">
      <TriangleAlert />
      <AlertTitle>{t("stdioDisabledTitle")}</AlertTitle>
      <AlertDescription>
        {t("stdioDisabledMessage")}. {t("stdioDisabledUntilThen")}
      </AlertDescription>
    </Alert>
  );
};
