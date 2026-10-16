import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import type { EmailEventSettingsTranslator } from "@/lib/i18n/translators";
import { getEmailEventSettings, updateEmailEventSettings, resetEmailEventSettings } from "../networking";
import { EmailEvent } from "../../types";
import { EmailEventSetting } from "./types";

interface EmailEventSettingsProps {
  accessToken: string | null;
}

const getEventDescription = (event: EmailEvent, t: EmailEventSettingsTranslator): string => {
  if (event.includes("Virtual Key Created")) {
    return t("descVirtualKey");
  } else if (event.includes("New User Invitation")) {
    return t("descNewUser");
  } else {
    const words = event
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase();
    return t("descGeneric", { words });
  }
};

const EmailEventSettings: React.FC<EmailEventSettingsProps> = ({ accessToken }) => {
  const t = useTranslations("emailEventSettings");
  const [loading, setLoading] = useState(true);
  const [eventSettings, setEventSettings] = useState<EmailEventSetting[]>([]);

  // Fetch email event settings on component mount
  useEffect(() => {
    fetchEventSettings();
  }, [accessToken]);

  const fetchEventSettings = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await getEmailEventSettings(accessToken);
      setEventSettings(response.settings);
    } catch (error) {
      console.error("Failed to fetch email event settings:", error);
      toast.fromError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event: EmailEvent, checked: boolean) => {
    const updatedSettings = eventSettings.map((setting) =>
      setting.event === event ? { ...setting, enabled: checked } : setting,
    );
    setEventSettings(updatedSettings);
  };

  const handleSaveSettings = async () => {
    if (!accessToken) return;

    try {
      await updateEmailEventSettings(accessToken, { settings: eventSettings });
      toast.success(t("updated"));
    } catch (error) {
      console.error("Failed to update email event settings:", error);
      toast.fromError(error);
    }
  };

  const handleResetSettings = async () => {
    if (!accessToken) return;

    try {
      await resetEmailEventSettings(accessToken);
      toast.success(t("resetDone"));
      // Refresh settings after reset
      fetchEventSettings();
    } catch (error) {
      console.error("Failed to reset email event settings:", error);
      toast.fromError(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>

      <CardContent>
        <Separator className="mb-6" />

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {eventSettings.map((setting) => (
              <div key={setting.event} className="flex items-start">
                <Checkbox
                  checked={setting.enabled}
                  onCheckedChange={(checked) => handleCheckboxChange(setting.event, checked === true)}
                  className="mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm">{setting.event}</p>
                  <div className="block text-sm text-muted-foreground">{getEventDescription(setting.event, t)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Button onClick={handleSaveSettings} disabled={loading}>
            {t("saveChanges")}
          </Button>
          <Button variant="secondary" onClick={handleResetSettings} disabled={loading}>
            {t("resetToDefaults")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailEventSettings;
