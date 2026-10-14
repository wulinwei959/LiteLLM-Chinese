import React from "react";
import { useTranslations } from "next-intl";
import { CircleHelp } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RateLimitType = "tpm" | "rpm";

interface RateLimitTypeOption {
  value: string;
  label: string;
  description: string;
}

interface RateLimitTypeFormItemProps {
  /** The type of rate limit - either 'tpm' or 'rpm' */
  type: RateLimitType;
  /** The form field name */
  name: string;
  /** Whether to show detailed descriptions (default: true) */
  showDetailedDescriptions?: boolean;
  /** Additional CSS classes */
  className?: string;
  value?: string | null;
  /** Custom onChange handler */
  onChange?: (value: string) => void;
  id?: string;
  disabled?: boolean;
  "aria-invalid"?: true | undefined;
  "aria-describedby"?: string | undefined;
}

export const RateLimitTypeFormItem: React.FC<RateLimitTypeFormItemProps> = ({
  type,
  name,
  showDetailedDescriptions = true,
  className = "",
  value,
  onChange,
  id,
  disabled,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}) => {
  const t = useTranslations("virtualKeys");
  const tCommon = useTranslations("common");
  const upper = type.toUpperCase();
  const lower = type.toLowerCase();
  const plainLabels: Record<string, string> = {
    best_effort_throughput: t("rateLimitType.bestEffort"),
    guaranteed_throughput: t("rateLimitType.guaranteed"),
    dynamic: t("rateLimitType.dynamic"),
  };
  const tooltip = t("rateLimitType.tooltip", { type: upper });
  const placeholder = t("rateLimitType.selectPlaceholder");
  const controlId = id ?? `rate-limit-type-${name}`;
  const options: RateLimitTypeOption[] = [
    {
      value: "best_effort_throughput",
      label: tCommon("default"),
      description: t("rateLimitType.bestEffortDescription", { lower }),
    },
    {
      value: "guaranteed_throughput",
      label: plainLabels.guaranteed_throughput,
      description: t("rateLimitType.guaranteedDescription", { lower }),
    },
    {
      value: "dynamic",
      label: plainLabels.dynamic,
      description: t("rateLimitType.dynamicDescription", { upper }),
    },
  ];

  return (
    <div className={className}>
      <TooltipProvider>
        <label htmlFor={controlId} className="mb-2 flex items-center gap-1 text-sm text-foreground">
          {t("rateLimitType.label", { type: upper })}
          <Tooltip>
            <TooltipTrigger
              render={<CircleHelp className="size-3.5 shrink-0 cursor-help text-muted-foreground" />}
              aria-label={tooltip}
            />
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </label>
      </TooltipProvider>
      <Select
        value={value ?? null}
        onValueChange={(next: string | null) => next !== null && onChange?.(next)}
        disabled={disabled}
      >
        <SelectTrigger id={controlId} className="w-full" aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy}>
          <SelectValue placeholder={placeholder}>
            {(selected: string | null) => (selected === null ? placeholder : plainLabels[selected] ?? selected)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) =>
            showDetailedDescriptions ? (
              <SelectItem key={option.value} value={option.value} title={option.label}>
                <span className="flex flex-col py-1">
                  <span className="font-medium">{option.label}</span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">{option.description}</span>
                </span>
              </SelectItem>
            ) : (
              <SelectItem key={option.value} value={option.value} title={plainLabels[option.value]}>
                {plainLabels[option.value]}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RateLimitTypeFormItem;
