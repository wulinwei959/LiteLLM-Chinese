import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { ROUTER_FAMILIES, type FamilyPreference, type RouterGoal, type SolverModel, type SolverNotice } from "./auto_setup";

type Props = {
  customized: boolean;
  hasSuggestions: boolean;
  onReset: () => void;
  goal: RouterGoal;
  family: FamilyPreference;
  models: readonly SolverModel[];
  everyday?: SolverModel;
  hard?: SolverModel;
  waitingForTeam: boolean;
  loading: boolean;
  error: boolean;
  notice: SolverNotice | "kept" | null;
  onGoalChange: (goal: RouterGoal) => void;
  onFamilyChange: (family: FamilyPreference) => void;
  onModelChange: (role: "everyday" | "hard", model: string) => void;
  onAdvanced: () => void;
  onRetry: () => void;
};

const sharedFamily = (everyday?: SolverModel, hard?: SolverModel) =>
  everyday?.family && everyday.family === hard?.family ? ROUTER_FAMILIES[everyday.family] : null;

const modelDescription = (model: SolverModel) =>
  [model.model !== model.name ? model.model : null, model.provider].filter(Boolean).join(" · ");

export default function AutoRouterSimpleSetup({
  customized,
  hasSuggestions,
  onReset,
  goal,
  family,
  models,
  everyday,
  hard,
  waitingForTeam,
  loading,
  error,
  notice,
  onGoalChange,
  onFamilyChange,
  onModelChange,
  onAdvanced,
  onRetry,
}: Props) {
  const t = useTranslations("models.addModel");
  const goalLabel = (value: RouterGoal): string => {
    if (value === "cheapest") return t("autoRouterGoalCheapest");
    if (value === "quality") return t("autoRouterGoalQuality");
    return t("autoRouterGoalBalanced");
  };
  const noticeText = (value: SolverNotice | "kept"): string => {
    if (value === "mixed") return t("autoRouterSimpleNoticeMixed");
    if (value === "substitute") return t("autoRouterSimpleNoticeSubstitute");
    return t("autoRouterSimpleKeptChoices");
  };
  const inventoryReady = !waitingForTeam && !loading;
  const showPreferences = !inventoryReady || error || hasSuggestions;
  const sameFamily = sharedFamily(everyday, hard);
  const familyItems = [
    { value: "auto", label: sameFamily ? t("autoRouterSimpleFamilyAutoWith", { family: sameFamily }) : t("autoRouterSimpleFamilyAuto") },
    ...Object.entries(ROUTER_FAMILIES).map(([value, label]) => ({ value, label })),
  ];
  return (
    <div className="space-y-4">
      {showPreferences && (
        <>
          <div className="space-y-2">
            <Label>{t("autoRouterSimpleOptimizeFor")}</Label>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label={t("autoRouterSimpleGoalGroupAria")}>
              {(["cheapest", "balanced", "quality"] as const).map((key) => (
                <Button
                  key={key}
                  type="button"
                  className="w-full"
                  variant={goal === key ? "default" : "outline"}
                  aria-pressed={goal === key}
                  onClick={() => onGoalChange(key)}
                >
                  {goalLabel(key)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="auto-router-family">{t("autoRouterSimpleModelFamily")}</Label>
            <Select
              items={familyItems}
              value={family}
              onValueChange={(value) => {
                if (value === "auto" || (value && value in ROUTER_FAMILIES)) onFamilyChange(value as FamilyPreference);
              }}
            >
              <SelectTrigger id="auto-router-family" aria-label={t("autoRouterSimpleModelFamily")} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {familyItems.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {waitingForTeam && <p className="text-sm text-muted-foreground">{t("autoRouterSimpleSelectTeamFirst")}</p>}
      {!waitingForTeam && loading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <UiLoadingSpinner className="size-4" />
          {t("autoRouterSimpleLoadingModels")}
        </p>
      )}
      {inventoryReady && error && (
        <p role="alert" className="text-sm text-destructive">
          {t("autoRouterSimpleLoadFailed")}{" "}
          <Button type="button" variant="link" onClick={onRetry}>
            {t("retryLabel")}
          </Button>
        </p>
      )}
      {inventoryReady && !error && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label>{t("autoRouterSimpleChosenModels")}</Label>
              {customized && hasSuggestions && (
                <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={onReset}>
                  {t("autoRouterSimpleUseSuggested")}
                </Button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["everyday", "hard"] as const).map((role) => {
                const chosen = role === "everyday" ? everyday : hard;
                const other = role === "everyday" ? hard : everyday;
                const choices = models.filter((model) => model.name !== other?.name);
                const items = choices.map((model) => ({ value: model.name, label: model.name }));
                const label = role === "everyday" ? t("autoRouterSimpleEveryday") : t("autoRouterSimpleHardTasks");
                return (
                  <div className="min-w-0 space-y-3 rounded-lg border bg-muted/20 p-4" key={role}>
                    <div className="space-y-1">
                      <Label htmlFor={`auto-router-${role}`}>{label}</Label>
                      <p className="text-xs text-muted-foreground">
                        {role === "everyday" ? t("autoRouterSimpleEverydayHint") : t("autoRouterSimpleHardHint")}
                      </p>
                    </div>
                    <Select
                      items={items}
                      value={chosen?.name ?? null}
                      onValueChange={(value) => {
                        if (value) onModelChange(role, value);
                      }}
                    >
                      <SelectTrigger
                        id={`auto-router-${role}`}
                        aria-label={t("autoRouterSimpleModelAria", { label })}
                        className="w-full"
                      >
                        <SelectValue placeholder={t("autoRouterSimpleSelectModel")} />
                      </SelectTrigger>
                      <SelectContent>
                        {choices.map((model) => (
                          <SelectItem key={model.name} value={model.name} label={model.name}>
                            <div>
                              <div>{model.name}</div>
                              <div className="text-xs text-muted-foreground">{modelDescription(model)}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {chosen && <p className="break-words text-xs text-muted-foreground">{modelDescription(chosen)}</p>}
                  </div>
                );
              })}
            </div>
          </div>
          {(!everyday || !hard) && (
            <p role="status" className="text-sm text-muted-foreground">
              {models.length < 2 ? t("autoRouterSimpleNeedTwo") : t("autoRouterSimpleChooseTwo")}
            </p>
          )}
          {notice && !customized && (
            <p role="status" className="text-xs text-muted-foreground">
              {noticeText(notice)}
            </p>
          )}
        </>
      )}
      <Button type="button" variant="link" className="px-0" onClick={onAdvanced}>
        {t("autoRouterSimpleAdvanced")}
      </Button>
    </div>
  );
}
