import { useTranslations } from "next-intl";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GuardrailCustomCodeCardProps {
  customCode: string;
  canEdit: boolean;
  onEdit: () => void;
}

export const GuardrailCustomCodeCard = ({ customCode, canEdit, onEdit }: GuardrailCustomCodeCardProps) => {
  const t = useTranslations("guardrails");
  return (
    <Card className="block mt-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Code className="text-info" />
          <p className="font-medium text-lg">{t("info.customCode")}</p>
        </div>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Code />
            {t("info.editCode")}
          </Button>
        )}
      </div>
      <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e]">
        <pre
          className="p-4 text-sm text-gray-200 overflow-x-auto"
          style={{ fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace" }}
        >
          <code>{customCode}</code>
        </pre>
      </div>
    </Card>
  );
};
