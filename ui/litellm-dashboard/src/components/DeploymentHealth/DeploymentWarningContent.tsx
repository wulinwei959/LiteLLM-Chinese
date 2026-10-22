import type { ReactNode } from "react";
import { formatExpiryDate, getDaysUntilExpiration } from "@/utils/licenseUtils";
import type { DeploymentHealthTranslator } from "@/lib/i18n/translators";

const LICENSE_EXPIRY_PREFIX = "license_expiry:";
const SALES_EMAIL = "sales@berri.ai";

export interface DeploymentWarningContent {
  title: string;
  fix?: ReactNode;
  docsUrl?: string;
}

const staticContent = (t: DeploymentHealthTranslator): Readonly<Record<string, DeploymentWarningContent>> => ({
  env_credential_login: {
    title: t("warning.envCredentialLogin.title"),
    fix: (
      <>
        {t("warning.envCredentialLogin.fixBefore")} <code>UI_USERNAME</code>/<code>UI_PASSWORD</code>{" "}
        {t("warning.envCredentialLogin.fixMiddle")} <code>UI_PASSWORD</code> {t("warning.envCredentialLogin.fixAfter")}{" "}
        <code>general_settings.disable_env_credential_login: true</code>
      </>
    ),
    docsUrl: "https://docs.litellm.ai/docs/proxy/ui",
  },
  no_redis: {
    title: t("warning.noRedis.title"),
    fix: <>{t("warning.noRedis.fix")}</>,
    docsUrl: "https://docs.litellm.ai/docs/proxy/redis_requirements",
  },
  detailed_debug: {
    title: t("warning.detailedDebug.title"),
    fix: (
      <>
        <code>LITELLM_LOG=DEBUG</code> {t("warning.detailedDebug.fix")}
      </>
    ),
    docsUrl: "https://docs.litellm.ai/docs/proxy/prod",
  },
});

const describeCountdown = (days: number, t: DeploymentHealthTranslator): string => {
  if (days <= 0) return t("license.expiresToday");
  if (days === 1) return t("license.expiresInOneDay");
  return t("license.expiresInDays", { days });
};

const licenseExpiryContent = (
  expirationDate: string,
  now: Date,
  t: DeploymentHealthTranslator,
): DeploymentWarningContent => {
  const days = getDaysUntilExpiration(expirationDate, now) ?? 0;
  const formattedDate = formatExpiryDate(expirationDate);
  const salesLink = <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>;
  return days < 0
    ? {
        title: t("license.expiredTitle", { date: formattedDate }),
        fix: (
          <>
            {t("license.expiredFix")} {salesLink} {t("license.restoreAccess")}
          </>
        ),
        docsUrl: "https://docs.litellm.ai/docs/proxy/enterprise",
      }
    : {
        title: t("license.countdownTitle", { countdown: describeCountdown(days, t), date: formattedDate }),
        fix: (
          <>
            {t("license.renewHint")} {salesLink}
          </>
        ),
        docsUrl: "https://docs.litellm.ai/docs/proxy/enterprise",
      };
};

export const deploymentWarningContent = (
  warningId: string,
  t: DeploymentHealthTranslator,
  now: Date = new Date(),
): DeploymentWarningContent => {
  if (warningId.startsWith(LICENSE_EXPIRY_PREFIX)) {
    return licenseExpiryContent(warningId.slice(LICENSE_EXPIRY_PREFIX.length), now, t);
  }
  return staticContent(t)[warningId] ?? { title: warningId };
};
