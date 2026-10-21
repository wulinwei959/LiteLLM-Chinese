import { BarChart3, Bot, Building2, Globe, LineChart, ShoppingCart, Tags, User, Users } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hasCapability, type Capability } from "@/utils/capabilities";
import { all_admin_roles } from "@/utils/roles";
export type UsageOption =
  | "global"
  | "my-usage"
  | "organization"
  | "team"
  | "customer"
  | "tag"
  | "agent"
  | "user"
  | "user-agent-activity";
export interface UsageViewSelectProps {
  value: UsageOption;
  onChange: (value: UsageOption) => void;
  userRole: string | null;
  canViewTagUsage?: boolean;
  isOrgAdmin?: boolean;
  title?: string;
  description?: string;
  "data-id"?: string;
}
type ViewSelectKey =
  | "global"
  | "yourUsage"
  | "organization"
  | "team"
  | "customer"
  | "tag"
  | "agent"
  | "user"
  | "userAgentActivity"
  | "globalDesc"
  | "globalDescNonAdmin"
  | "myUsageDesc"
  | "organizationDesc"
  | "teamDesc"
  | "customerDesc"
  | "tagDesc"
  | "agentDesc"
  | "userDesc"
  | "userAgentDesc";

interface OptionConfig {
  value: UsageOption;
  labelKey: ViewSelectKey;
  descriptionKey: ViewSelectKey;
  icon: React.ReactNode;
  capability?: Capability;
  adminOnly?: boolean;
  nonAdminLabelKey?: ViewSelectKey;
  nonAdminDescriptionKey?: ViewSelectKey;
  badgeText?: string;
}
const OPTIONS: OptionConfig[] = [
  {
    value: "global",
    labelKey: "global",
    nonAdminLabelKey: "yourUsage",
    descriptionKey: "globalDesc",
    nonAdminDescriptionKey: "globalDescNonAdmin",
    icon: <Globe className="size-4" />,
  },
  {
    value: "my-usage",
    labelKey: "yourUsage",
    descriptionKey: "myUsageDesc",
    icon: <User className="size-4" />,
    adminOnly: true,
  },
  {
    value: "organization",
    labelKey: "organization",
    descriptionKey: "organizationDesc",
    icon: <Building2 className="size-4" />,
    capability: "viewOrganizationUsage",
  },
  {
    value: "team",
    labelKey: "team",
    descriptionKey: "teamDesc",
    icon: <Users className="size-4" />,
  },
  {
    value: "customer",
    labelKey: "customer",
    descriptionKey: "customerDesc",
    icon: <ShoppingCart className="size-4" />,
    adminOnly: true,
  },
  {
    value: "tag",
    labelKey: "tag",
    descriptionKey: "tagDesc",
    icon: <Tags className="size-4" />,
    adminOnly: true,
  },
  {
    value: "agent",
    labelKey: "agent",
    descriptionKey: "agentDesc",
    icon: <Bot className="size-4" />,
    capability: "viewAgentUsage",
  },
  {
    value: "user",
    labelKey: "user",
    descriptionKey: "userDesc",
    icon: <User className="size-4" />,
    adminOnly: true,
  },
  {
    value: "user-agent-activity",
    labelKey: "userAgentActivity",
    descriptionKey: "userAgentDesc",
    icon: <LineChart className="size-4" />,
    adminOnly: true,
  },
];
const visibleOptions = (userRole: string | null, canViewTagUsage: boolean, isOrgAdmin: boolean): OptionConfig[] => {
  const isAdmin = all_admin_roles.includes(userRole ?? "");
  return OPTIONS.filter((option) => {
    if (option.capability) {
      return hasCapability(userRole, option.capability, isOrgAdmin);
    }
    if (option.value === "tag" && canViewTagUsage) {
      return true;
    }
    return !(option.adminOnly && !isAdmin);
  });
};

export const USAGE_OPTIONS: readonly UsageOption[] = OPTIONS.map((option) => option.value);

export const allowedUsageOptions = (
  userRole: string | null,
  canViewTagUsage: boolean,
  isOrgAdmin: boolean,
): readonly UsageOption[] => visibleOptions(userRole, canViewTagUsage, isOrgAdmin).map((option) => option.value);

export const UsageViewSelect: React.FC<UsageViewSelectProps> = ({
  value,
  onChange,
  userRole,
  canViewTagUsage = false,
  isOrgAdmin = false,
  title,
  description,
  "data-id": dataId,
}) => {
  const t = useTranslations("usage.viewSelect");
  const isAdmin = all_admin_roles.includes(userRole ?? "");
  const getFilteredOptions = () => {
    return OPTIONS.filter((option) => {
      if (option.capability) {
        return hasCapability(userRole, option.capability, isOrgAdmin);
      }
      if (option.value === "tag" && canViewTagUsage) {
        return true;
      }
      if (option.adminOnly && !isAdmin) {
        return false;
      }
      return true;
    }).map((option) => {
      const labelKey = option.nonAdminLabelKey && !isAdmin ? option.nonAdminLabelKey : option.labelKey;
      const descriptionKey =
        option.nonAdminDescriptionKey && !isAdmin ? option.nonAdminDescriptionKey : option.descriptionKey;
      return {
        value: option.value,
        label: t(labelKey),
        description: t(descriptionKey),
        icon: option.icon,
        badgeText: option.badgeText,
      };
    });
  };
  const filteredOptions = getFilteredOptions();
  const selectedOption = filteredOptions.find((option) => option.value === value);
  return (
    <div className="w-full" data-id={dataId}>
      <div className="flex flex-wrap items-center justify-start gap-4">
        <div className="flex items-stretch gap-2 min-w-0">
          <div className="shrink-0 flex items-center">
            <BarChart3 className="size-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-0.5 leading-tight">{title ?? t("title")}</h3>
            <p className="text-xs text-muted-foreground leading-tight">{description ?? t("description")}</p>
          </div>
        </div>
        <div className="shrink-0">
          <Select
            value={value}
            onValueChange={(next: UsageOption | null) => {
              if (next) onChange(next);
            }}
          >
            <SelectTrigger className="w-54 sm:w-64 md:w-72">
              <SelectValue>
                {selectedOption && (
                  <span className="flex items-center gap-2">
                    {selectedOption.icon}
                    <span className="text-sm">{selectedOption.label}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filteredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2 py-1">
                    <span className="shrink-0 mt-0.5">{option.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-foreground">{option.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{option.description}</span>
                    </span>
                    {option.badgeText && <Badge>{option.badgeText}</Badge>}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
