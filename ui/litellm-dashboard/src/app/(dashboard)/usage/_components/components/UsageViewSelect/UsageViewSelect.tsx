import { BarChart3, Bot, Building2, Globe, LineChart, ShoppingCart, Tags, User, Users } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
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
interface OptionConfig {
  value: UsageOption;
  iconKey: "global" | "myUsage" | "organization" | "team" | "customer" | "tag" | "agent" | "user" | "userAgentActivity";
  icon: React.ReactNode;
  capability?: Capability;
  adminOnly?: boolean;
  badgeText?: string;
}
const OPTIONS: OptionConfig[] = [
  {
    value: "global",
    iconKey: "global",
    icon: <Globe className="size-4" />,
  },
  {
    value: "my-usage",
    iconKey: "myUsage",
    icon: <User className="size-4" />,
    adminOnly: true,
  },
  {
    value: "organization",
    iconKey: "organization",
    icon: <Building2 className="size-4" />,
    capability: "viewOrganizationUsage",
  },
  {
    value: "team",
    iconKey: "team",
    icon: <Users className="size-4" />,
  },
  {
    value: "customer",
    iconKey: "customer",
    icon: <ShoppingCart className="size-4" />,
    adminOnly: true,
  },
  {
    value: "tag",
    iconKey: "tag",
    icon: <Tags className="size-4" />,
    adminOnly: true,
  },
  {
    value: "agent",
    iconKey: "agent",
    icon: <Bot className="size-4" />,
    capability: "viewAgentUsage",
  },
  {
    value: "user",
    iconKey: "user",
    icon: <User className="size-4" />,
    adminOnly: true,
  },
  {
    value: "user-agent-activity",
    iconKey: "userAgentActivity",
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
  const LABEL_KEYS = {
    global: "global",
    myUsage: "myUsage",
    organization: "organization",
    team: "team",
    customer: "customer",
    tag: "tag",
    agent: "agent",
    user: "user",
    userAgentActivity: "userAgentActivity",
  } as const;
  const DESCRIPTION_KEYS = {
    global: "globalDesc",
    myUsage: "myUsageDesc",
    organization: "organizationDesc",
    team: "teamDesc",
    customer: "customerDesc",
    tag: "tagDesc",
    agent: "agentDesc",
    user: "userDesc",
    userAgentActivity: "userAgentActivityDesc",
  } as const;
  const getFilteredOptions = () => {
    return visibleOptions(userRole, canViewTagUsage, isOrgAdmin).map((option) => {
      const label = option.value === "global" && !isAdmin ? t("yourUsage") : t(LABEL_KEYS[option.iconKey]);
      const desc =
        option.value === "global" && !isAdmin ? t("yourUsageDesc") : t(DESCRIPTION_KEYS[option.iconKey]);
      return {
        value: option.value,
        label,
        description: desc,
        icon: option.icon,
        badgeText: option.badgeText,
      };
    });
  };
  const filteredOptions = getFilteredOptions();
  const selectedOption = filteredOptions.find((option) => option.value === value);
  return (
    <div className="flex items-center gap-3" data-id={dataId}>
      <h1 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <BarChart3 aria-hidden="true" className="size-4" strokeWidth={2} />
        {title ?? t("title")}
      </h1>
      <Select
        value={value}
        onValueChange={(next: UsageOption | null) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger aria-label={description ?? t("description")} className="h-8 w-52">
          <SelectValue>
            {selectedOption && (
              <span className="flex items-center gap-2">
                {selectedOption.icon}
                <span className="text-sm">{selectedOption.label}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        {/* Sized to its content rather than the narrow trigger, so descriptions never clip. */}
        <SelectContent align="start" className="w-auto min-w-72 p-1">
          {filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="rounded-md py-2 pr-8 pl-2">
              <span className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 text-muted-foreground">{option.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm leading-5 text-foreground">{option.label}</span>
                  <span className="block text-xs leading-4 text-muted-foreground">{option.description}</span>
                </span>
                {option.badgeText && <Badge>{option.badgeText}</Badge>}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
