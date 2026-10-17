"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PaginationState } from "@tanstack/react-table";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { useDeletedKeys } from "@/app/(dashboard)/hooks/keys/useKeys";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { DeletedKeysTable } from "./DeletedKeysTable/DeletedKeysTable";

export default function DeletedKeysPage() {
  const t = useTranslations("common");
  const { premiumUser } = useAuthorized();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });

  const { data: keysData, isLoading } = useDeletedKeys(pagination.pageIndex + 1, pagination.pageSize);

  return (
    <div className="flex flex-col gap-4">
      {!premiumUser && (
        <Alert>
          <Info />
          <AlertTitle>{t("comingSoonEnterprise")}</AlertTitle>
          <AlertDescription>{t("deletedKeysAuditBody")}</AlertDescription>
        </Alert>
      )}
      <DeletedKeysTable
        keys={keysData?.keys || []}
        totalCount={keysData?.total_count || 0}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
