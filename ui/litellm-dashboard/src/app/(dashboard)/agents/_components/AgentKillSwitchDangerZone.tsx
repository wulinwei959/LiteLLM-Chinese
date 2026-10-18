"use client";

import { CircleAlert } from "lucide-react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { toast } from "@/lib/toast";
import { AgentKillSwitchResult, triggerAgentKillSwitchCall } from "@/components/networking";
import { KillSwitchConfig } from "./kill_switch_config";

interface AgentKillSwitchDangerZoneProps {
  agentId: string;
  agentName: string;
  killSwitch: KillSwitchConfig | null | undefined;
  accessToken: string | null;
  isAdmin: boolean;
}

const AgentKillSwitchDangerZone: React.FC<AgentKillSwitchDangerZoneProps> = ({
  agentId,
  agentName,
  killSwitch,
  accessToken,
  isAdmin,
}) => {
  const t = useTranslations("agents");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isFiring, setIsFiring] = useState(false);
  const [lastResult, setLastResult] = useState<AgentKillSwitchResult | null>(null);

  if (!isAdmin) return null;

  const openConfirm = () => {
    setConfirmationInput("");
    setIsConfirmOpen(true);
  };

  const fire = async () => {
    if (!accessToken) return;
    setIsFiring(true);
    setLastResult(null);
    try {
      const result = await triggerAgentKillSwitchCall(accessToken, agentId);
      setLastResult(result);
      setIsConfirmOpen(false);
      toast.success(t("killSwitchFired", { code: String(result.status_code) }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("killSwitchFireFailed"));
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <section aria-labelledby="agent-danger-zone-heading" className="mt-6">
      <h3 id="agent-danger-zone-heading" className="text-lg font-medium text-destructive">
        {t("dangerZone")}
      </h3>
      <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1 text-sm">
            <p className="font-medium text-foreground">{t("killSwitch")}</p>
            {killSwitch ? (
              <>
                <p className="text-muted-foreground">{t("killSwitchDesc")}</p>
                <p className="font-mono break-all text-foreground">
                  {killSwitch.method ?? "POST"} {killSwitch.url}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">{t("killSwitchNotConfigured")}</p>
            )}
          </div>
          {killSwitch && (
            <Button type="button" variant="destructive" onClick={openConfirm} disabled={isFiring} aria-busy={isFiring}>
              {isFiring && <UiLoadingSpinner className="size-4" />}
              {t("fireKillSwitch")}
            </Button>
          )}
        </div>
        {lastResult && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            {t("lastResult", { code: String(lastResult.status_code) })}
            {lastResult.response_body ? ` ${lastResult.response_body}` : ""}
          </p>
        )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={(open) => !open && !isFiring && setIsConfirmOpen(false)}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("fireKillSwitchForAgent", { agentName })}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="error">
              <CircleAlert />
              <AlertTitle>{t("killSwitchWarning")}</AlertTitle>
              <AlertDescription>
                {t("fireConfirmWarning", { method: killSwitch?.method ?? "POST", url: killSwitch?.url ?? "" })}
              </AlertDescription>
            </Alert>
            <div>
              <p className="mb-2 text-base font-medium text-foreground">
                {t.rich("typeToConfirm", {
                  agentName,
                  strong: (chunks) => <span className="font-semibold text-destructive">{chunks}</span>,
                })}
              </p>
              <InputGroup className="rounded-md">
                <InputGroupAddon>
                  <CircleAlert className="size-3.5 text-destructive" />
                </InputGroupAddon>
                <InputGroupInput
                  aria-label={t("confirmAgentName")}
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={agentName}
                  autoFocus
                />
              </InputGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={isFiring}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={fire}
              disabled={confirmationInput !== agentName || isFiring}
              aria-busy={isFiring}
            >
              {isFiring && <UiLoadingSpinner className="size-4" />}
              {isFiring ? t("firing") : t("fireKillSwitch")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AgentKillSwitchDangerZone;
