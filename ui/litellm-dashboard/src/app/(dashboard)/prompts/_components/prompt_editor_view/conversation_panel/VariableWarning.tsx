import React from "react";
import { useTranslations } from "next-intl";

interface VariableWarningProps {
  extractedVariables: string[];
  variables: Record<string, string>;
}

const VariableWarning: React.FC<VariableWarningProps> = ({ extractedVariables, variables }) => {
  const t = useTranslations("prompts");
  const missingVariables = extractedVariables.filter(
    (varName) => !variables[varName] || variables[varName].trim() === "",
  );

  if (missingVariables.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
      <div className="flex items-start gap-2">
        <span className="text-warning text-sm">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-warning font-medium mb-1">{t("editor.warnTitle")}</p>
          <p className="text-xs text-warning">
            {t("editor.missing", { vars: missingVariables.map((varName) => `{{${varName}}}`).join(", ") })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VariableWarning;
