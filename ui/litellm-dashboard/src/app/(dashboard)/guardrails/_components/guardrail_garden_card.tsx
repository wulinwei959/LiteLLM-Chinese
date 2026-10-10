import React from "react";
import { useTranslations } from "next-intl";
import { CircleCheck } from "lucide-react";
import { GuardrailCardInfo } from "./guardrail_garden_data";
import { Logo } from "@/components/molecules/logo/Logo";

const GuardrailCard: React.FC<{ card: GuardrailCardInfo; onClick: () => void }> = ({ card, onClick }) => {
  const t = useTranslations("guardrails");
  return (
    <div
      onClick={onClick}
      className="flex min-h-[170px] cursor-pointer flex-col rounded-xl border border-border bg-card px-5 pt-5 pb-4 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-sm"
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <Logo src={card.logo} label={card.name} className="w-7 h-7 rounded-md object-contain shrink-0" />
        <span className="text-sm leading-tight font-semibold text-foreground">{card.name}</span>
      </div>

      <p className="line-clamp-3 m-0 flex-1 text-xs leading-relaxed text-muted-foreground">{card.description}</p>

      {card.eval && (
        <div className="mt-2.5 flex items-center gap-1 text-success">
          <CircleCheck className="size-3" />
          <span className="text-[11px] font-medium">
            {t("gardenCard.f1", { f1: card.eval.f1 })}% &middot; {t("gardenCard.testCases", { count: card.eval.testCases })}
          </span>
        </div>
      )}
    </div>
  );
};

export default GuardrailCard;
