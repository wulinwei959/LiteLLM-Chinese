import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import {
  DECISIONS_DOCS_URL,
  SYSTEM_ONE_PLAYGROUND_ROUTE,
  isDecisionSelection,
  type DecisionCatalog,
} from "@/lib/decisionModels";
import { uiHref } from "@/utils/uiHref";
import type { MountedFormValues } from "../common_components/MountedFormField";

interface DecisionModelNoteProps {
  catalog: DecisionCatalog;
  litellmProvider: string | undefined;
}

const selectedModelNames = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((model): model is string => typeof model === "string");
  }
  return typeof value === "string" && value !== "" ? [value] : [];
};

export default function DecisionModelNote({ catalog, litellmProvider }: DecisionModelNoteProps) {
  const t = useTranslations("addModel");
  const { control } = useFormContext<MountedFormValues>();
  const model = useWatch({ control, name: "model" });

  if (!isDecisionSelection(catalog, litellmProvider, selectedModelNames(model))) {
    return null;
  }

  return (
    <Alert variant="info" role="note" aria-label={t("decisionModel.ariaLabel")} className="mb-4">
      <Info />
      <AlertTitle>{t("decisionModel.title")}</AlertTitle>
      <AlertDescription>
        <p>
          {t("decisionModel.callBefore")} <code>/v1/decisions</code> {t("decisionModel.openAiFormat")}{" "}
          <code>/v1/systemone</code> {t("decisionModel.systemOneFormat")}{" "}
          <a href={DECISIONS_DOCS_URL} target="_blank" rel="noopener noreferrer" className="underline">
            {t("decisionModel.howToCall")}
          </a>
        </p>
        <p>
          {t("decisionModel.afterAdd")}{" "}
          <a href={uiHref(SYSTEM_ONE_PLAYGROUND_ROUTE)} className="underline">
            {t("decisionModel.testInPlayground")}
          </a>
        </p>
      </AlertDescription>
    </Alert>
  );
}
