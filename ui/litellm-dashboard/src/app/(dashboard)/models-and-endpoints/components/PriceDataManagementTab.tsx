import PriceDataReload from "@/components/price_data_reload";
import { useTranslations } from "next-intl";
import React from "react";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { useQueryClient } from "@tanstack/react-query";
import { modelCostMapKeys } from "../../hooks/models/useModelCostMap";

const PriceDataManagementTab = () => {
  const t = useTranslations("models.priceData");
  const { accessToken } = useAuthorized();
  const queryClient = useQueryClient();

  return (
    <div>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <PriceDataReload
          accessToken={accessToken}
          onReloadSuccess={() => {
            queryClient.invalidateQueries({ queryKey: modelCostMapKeys.all });
          }}
          buttonText={t("reloadButton")}
          size="middle"
          type="primary"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PriceDataManagementTab;
