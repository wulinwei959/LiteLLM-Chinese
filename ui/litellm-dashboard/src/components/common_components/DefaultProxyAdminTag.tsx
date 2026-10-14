import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_PROXY_ADMIN_USER_ID } from "@/utils/sentinels";

interface DefaultProxyAdminTagProps {
  userId: string | null | undefined;
}

export default function DefaultProxyAdminTag({ userId }: DefaultProxyAdminTagProps) {
  const t = useTranslations("common");

  if (userId === DEFAULT_PROXY_ADMIN_USER_ID) {
    return <Badge variant="secondary">{t("defaultProxyAdmin")}</Badge>;
  }

  return <span>{userId}</span>;
}
