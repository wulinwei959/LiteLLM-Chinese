import { SearchSelect } from "@/components/shared/SearchSelect";
import { parseUsageClient, UsageClient } from "./overview/agentCatalog";
import { useTranslations } from "next-intl";

const CLIENT_OPTIONS = [
  { value: UsageClient.ClaudeDesktop, label: "Claude Desktop" },
  { value: UsageClient.ClaudeCode, label: "Claude Code" },
];

export default function ClientUsageSelect({
  value,
  onChange,
}: {
  value: UsageClient | null;
  onChange: (client: UsageClient | null) => void;
}) {
  const t = useTranslations("clientUsage");
  return (
    <SearchSelect
      aria-label={t("viewClientUsage")}
      placeholder={t("viewClientUsage")}
      value={value}
      options={CLIENT_OPTIONS}
      onValueChange={(client) => onChange(parseUsageClient(client))}
    />
  );
}
