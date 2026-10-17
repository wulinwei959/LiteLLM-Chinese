import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/lib/toast";
import ExportFormatSelector from "./ExportFormatSelector";
import ExportSummary from "./ExportSummary";
import ExportTypeSelector from "./ExportTypeSelector";
import type { EntityUsageExportModalProps, ExportFormat, ExportType } from "./types";
import { downloadBlob, exportFilename } from "./utils";

const EntityUsageExportModal: React.FC<EntityUsageExportModalProps> = ({
  isOpen,
  onClose,
  entityType,
  onExport,
  dateRange,
  selectedFilters = [],
  customTitle,
}) => {
  const t = useTranslations("entityUsageExport");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [exportType, setExportType] = useState<ExportType>("daily");
  const [isExporting, setIsExporting] = useState(false);

  const modalTitle = customTitle || t("modalTitle", { entity: t(`entityNames.${entityType}`) });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await onExport(exportType, exportFormat);
      downloadBlob(blob, exportFilename(entityType, exportType, exportFormat, dateRange));
      toast.success(t("successToast", { entity: t(`entityNames.${entityType}`), format: exportFormat.toUpperCase() }));
      onClose();
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.fromError(t("errorToast"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <ExportSummary dateRange={dateRange} selectedFilters={selectedFilters} />
          <ExportTypeSelector value={exportType} onChange={setExportType} entityType={entityType} />
          <ExportFormatSelector value={exportFormat} onChange={setExportFormat} />
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              {t("cancel")}
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting && <Loader2 className="animate-spin" />}
              {isExporting ? t("exporting") : t("exportFormat", { format: exportFormat.toUpperCase() })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntityUsageExportModal;
