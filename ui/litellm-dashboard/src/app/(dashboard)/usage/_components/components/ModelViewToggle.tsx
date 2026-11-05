import { useTranslations } from "next-intl";

export type ModelViewType = "groups" | "individual";

type ModelViewLabelKey = "publicModelName" | "litellmModelName";

const MODEL_VIEW_OPTIONS: readonly { value: ModelViewType; labelKey: ModelViewLabelKey }[] = [
  { value: "groups", labelKey: "publicModelName" },
  { value: "individual", labelKey: "litellmModelName" },
];

interface ModelViewToggleProps {
  value: ModelViewType;
  onChange: (value: ModelViewType) => void;
}

export default function ModelViewToggle({ value, onChange }: ModelViewToggleProps) {
  const t = useTranslations("usage");
  return (
    <div className="flex bg-muted rounded-lg p-1">
      {MODEL_VIEW_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            value === option.value ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onChange(option.value)}
        >
          {t(`modelViewToggle.${option.labelKey}`)}
        </button>
      ))}
    </div>
  );
}
