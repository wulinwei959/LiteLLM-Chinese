import { useCloudZeroDryRun } from "@/app/(dashboard)/hooks/cloudzero/useCloudZeroDryRun";
import { useCloudZeroExport } from "@/app/(dashboard)/hooks/cloudzero/useCloudZeroExport";
import { useCloudZeroDeleteSettings } from "@/app/(dashboard)/hooks/cloudzero/useCloudZeroSettings";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import DeleteResourceModal from "@/components/common_components/DeleteResourceModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/toast";
import { CheckCircle, Pencil, Play, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CloudZeroUpdateModal from "./CloudZeroUpdateModal";
import { CloudZeroSettings } from "./types";

interface CloudZeroIntegrationSettingsProps {
  settings: CloudZeroSettings;
  onSettingsUpdated: () => void;
}

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

const DetailRow = ({ label, children }: DetailRowProps) => (
  <div className="grid grid-cols-1 border-b border-border last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)]">
    <dt className="bg-muted/50 px-4 py-3 text-sm font-medium">{label}</dt>
    <dd className="px-4 py-3 text-sm">{children}</dd>
  </div>
);

const NotConfigured = () => {
  const t = useTranslations("cloudZero");
  return <span className="text-muted-foreground italic">{t("notConfigured")}</span>;
};

export function CloudZeroIntegrationSettings({ settings, onSettingsUpdated }: CloudZeroIntegrationSettingsProps) {
  const t = useTranslations("cloudZero");
  const commonT = useTranslations("common");
  const { accessToken } = useAuthorized();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);

  const dryRunMutation = useCloudZeroDryRun(accessToken || "");
  const exportMutation = useCloudZeroExport(accessToken || "");
  const deleteMutation = useCloudZeroDeleteSettings(accessToken || "");

  const handleDryRun = () => {
    if (!accessToken) return;

    dryRunMutation.mutate(
      { limit: 10 },
      {
        onSuccess: (data) => {
          toast.success(t("dryRunSuccessToast"));
        },
        onError: (error) => {
          toast.error(error?.message || t("dryRunFailedToast"));
        },
      },
    );
  };

  const dryRunResult = dryRunMutation.data ? JSON.stringify(dryRunMutation.data, null, 2) : null;

  const handleExport = () => {
    if (!accessToken) return;

    exportMutation.mutate(
      { operation: "replace_hourly" },
      {
        onSuccess: () => {
          toast.success(t("exportSuccessToast"));
          setIsExportConfirmOpen(false);
        },
        onError: (error) => {
          toast.error(error?.message || t("exportFailedToast"));
        },
      },
    );
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalOk = async () => {
    setIsEditModalOpen(false);
    onSettingsUpdated();
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!accessToken) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("deletedToast"));
        setIsDeleteModalOpen(false);
        onSettingsUpdated();
      },
      onError: (error) => {
        toast.error(error?.message || t("deleteFailedToast"));
      },
    });
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {t("configTitle")}
              <Badge variant="secondary" className="capitalize">
                {settings.status || commonT("active")}
              </Badge>
            </CardTitle>
            <CardAction className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Pencil />
                {commonT("edit")}
              </Button>
              <Button variant="destructive" onClick={handleDeleteClick}>
                <Trash2 />
                {commonT("delete")}
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <dl className="rounded-md border border-border">
              <DetailRow label={t("apiKeyRedacted")}>
                <span className="font-mono">{settings.api_key_masked || <NotConfigured />}</span>
              </DetailRow>
              <DetailRow label={t("connectionIdLabel")}>
                <span className="font-mono">{settings.connection_id || <NotConfigured />}</span>
              </DetailRow>
              <DetailRow label={t("timezoneLabel")}>
                {settings.timezone || <span className="text-muted-foreground italic">{t("defaultUtc")}</span>}
              </DetailRow>
            </dl>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{commonT("actions")}</span>
              <Separator className="flex-1" />
            </div>

            <div className="mt-4 mb-6 flex flex-wrap gap-4">
              <Button variant="outline" onClick={handleDryRun} disabled={dryRunMutation.isPending}>
                <Play />
                {t("runDryRun")}
              </Button>

              <Button onClick={() => setIsExportConfirmOpen(true)} disabled={exportMutation.isPending}>
                <Upload />
                {t("exportNow")}
              </Button>
            </div>

            {dryRunResult && (
              <Alert>
                <CheckCircle />
                <AlertTitle>{t("dryRunResults")}</AlertTitle>
                <AlertDescription>
                  <p>{t("dryRunSimulationOutput", { connectionId: settings.connection_id ?? "" })}</p>
                  <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-xs text-foreground">
                    {dryRunResult}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isExportConfirmOpen} onOpenChange={setIsExportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("exportConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("exportConfirmBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={exportMutation.isPending}>{commonT("cancel")}</AlertDialogCancel>
            <Button onClick={handleExport} disabled={exportMutation.isPending}>
              {commonT("export")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CloudZeroUpdateModal
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        settings={settings}
      />

      <DeleteResourceModal
        isOpen={isDeleteModalOpen}
        title={t("deleteTitle")}
        message={t("deleteBody")}
        resourceInformationTitle={t("integrationDetails")}
        resourceInformation={[
          {
            label: t("connectionIdLabel"),
            value: settings.connection_id,
            code: true,
          },
          {
            label: t("timezoneLabel"),
            value: settings.timezone || t("defaultUtc"),
          },
        ]}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        confirmLoading={deleteMutation.isPending}
      />
    </>
  );
}
