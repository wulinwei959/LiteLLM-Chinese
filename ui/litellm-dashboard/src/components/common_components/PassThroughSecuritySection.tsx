import { useTranslations } from "next-intl";
import React from "react";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export interface PassThroughSecuritySectionProps {
  premiumUser: boolean;
  authEnabled: boolean;
  onAuthChange: (checked: boolean) => void;
}

const PassThroughSecuritySection: React.FC<PassThroughSecuritySectionProps> = ({
  premiumUser,
  authEnabled,
  onAuthChange,
}) => {
  const t = useTranslations("models.passThrough");
  return (
    <Card className="block p-6">
      <h3 className="mb-2 text-lg font-semibold text-foreground">{t("securityTitle")}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{t("securityDescription")}</p>
      {premiumUser ? (
        <Switch checked={authEnabled} onCheckedChange={onAuthChange} />
      ) : (
        <div>
          <div className="mb-3 flex items-center">
            <Switch disabled checked={false} />
            <span className="ml-2 text-sm text-muted-foreground">{t("authPremiumLabel")}</span>
          </div>
          <div className="rounded-lg border border-warning/20 bg-warning/10 p-3">
            <p className="text-sm text-warning">
              {t.rich("securityEnterpriseNotice", {
                link: (chunks) => (
                  <a
                    href="https://www.litellm.ai/#pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PassThroughSecuritySection;
