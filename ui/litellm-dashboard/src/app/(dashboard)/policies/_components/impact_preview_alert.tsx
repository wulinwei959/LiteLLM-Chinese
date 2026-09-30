import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";

interface ImpactResult {
  affected_keys_count: number;
  affected_teams_count: number;
  sample_keys: string[];
  sample_teams: string[];
}

interface ImpactPreviewAlertProps {
  impactResult: ImpactResult;
  isDefault?: boolean;
}

interface SampleListProps {
  label: string;
  samples: string[];
  totalCount: number;
}

const SampleList: React.FC<SampleListProps> = ({ label, samples, totalCount }) => {
  const t = useTranslations("policies");
  return (
  <div className="mt-1 flex flex-wrap items-center gap-1">
    <span className="text-xs text-muted-foreground">{label}: </span>
    {samples.slice(0, 5).map((sample) => (
      <Badge key={sample} variant="outline">
        {sample}
      </Badge>
    ))}
    {totalCount > 5 && (
      <span className="text-xs text-muted-foreground">{t("impact.more", { rest: totalCount - 5 })}</span>
    )}
  </div>
  );
};

const ImpactPreviewAlert: React.FC<ImpactPreviewAlertProps> = ({ impactResult, isDefault = false }) => {
  const t = useTranslations("policies");
  const isGlobal = impactResult.affected_keys_count === -1;

  return (
    <Alert className="mb-4">
      {isGlobal ? <AlertTriangle /> : <Info />}
      <AlertTitle>{t("impact.title")}</AlertTitle>
      <AlertDescription>
        {isGlobal ? (
          <span>
            {t("impact.globalAlert")}
          </span>
        ) : (
          <div>
            <span>
              This attachment would affect {isDefault ? t("impact.upTo") : ""}
              <strong>
                {t("impact.keysLine", { count: impactResult.affected_keys_count })}
              </strong>{" "}
              and{" "}
              <strong>
                {t("impact.teamsLine", { count: impactResult.affected_teams_count })}
              </strong>
              .
            </span>
            {isDefault && (
              <div className="text-xs text-muted-foreground">
                {t("impact.defaultNote")}
              </div>
            )}
            {impactResult.sample_keys.length > 0 && (
              <SampleList
                label={t("impact.keysLabel")}
                samples={impactResult.sample_keys}
                totalCount={impactResult.affected_keys_count}
              />
            )}
            {impactResult.sample_teams.length > 0 && (
              <SampleList
                label={t("impact.teamsLabel")}
                samples={impactResult.sample_teams}
                totalCount={impactResult.affected_teams_count}
              />
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ImpactPreviewAlert;
