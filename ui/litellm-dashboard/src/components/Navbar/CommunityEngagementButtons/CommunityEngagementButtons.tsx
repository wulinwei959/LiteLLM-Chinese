import { useDisableShowPrompts } from "@/app/(dashboard)/hooks/useDisableShowPrompts";
import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/cva.config";
import { Github, Slack } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

type CommunityLinkLabelKey = "slack" | "github";

const COMMUNITY_LINKS: ReadonlyArray<{
  href: string;
  labelKey: CommunityLinkLabelKey;
  tooltipKey: CommunityLinkLabelKey | "slackTooltip";
  Icon: typeof Slack;
}> = [
  {
    href: "https://www.litellm.ai/support",
    labelKey: "slack",
    tooltipKey: "slackTooltip",
    Icon: Slack,
  },
  {
    href: "https://github.com/BerriAI/litellm",
    labelKey: "github",
    tooltipKey: "github",
    Icon: Github,
  },
];

export const CommunityEngagementButtons: React.FC = () => {
  const t = useTranslations("navbar.community");
  const disableShowPrompts = useDisableShowPrompts();

  if (disableShowPrompts) {
    return null;
  }

  return (
    <TooltipProvider>
      <ButtonGroup aria-label={t("linksAria")}>
        {COMMUNITY_LINKS.map(({ href, labelKey, tooltipKey, Icon }) => (
          <Tooltip key={href}>
            <TooltipTrigger
              render={
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(labelKey)}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }), "text-muted-foreground")}
                />
              }
            >
              <Icon />
            </TooltipTrigger>
            <TooltipContent>{t(tooltipKey)}</TooltipContent>
          </Tooltip>
        ))}
      </ButtonGroup>
    </TooltipProvider>
  );
};
