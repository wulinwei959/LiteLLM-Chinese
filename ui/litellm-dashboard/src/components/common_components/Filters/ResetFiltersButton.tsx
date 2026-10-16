import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface ResetFiltersButtonProps {
  onClick: () => void;
  label?: string;
}

export const ResetFiltersButton: React.FC<ResetFiltersButtonProps> = ({ onClick, label }) => {
  const t = useTranslations("common");
  return (
    <Button variant="outline" onClick={onClick}>
      <RotateCcw className="size-4" />
      {label ?? t("resetFilters")}
    </Button>
  );
};
