import {
  getFrameworks,
  type ComplianceCategory,
  type ComplianceFramework,
  type CompliancePrompt,
} from "@/data/compliancePrompts";
import {
  ClipboardList,
  Lock,
  Brain,
  BarChart3,
  Scale,
  Search,
  Smile,
  Fingerprint,
  CheckCircle2,
  TrendingDown,
  Bot,
  Pencil,
  Shield,
  FileText,
} from "lucide-react";
import type { ComponentType } from "react";

export const CATEGORY_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  lock: Lock,
  brain: Brain,
  "bar-chart": BarChart3,
  scale: Scale,
  search: Search,
  smile: Smile,
  fingerprint: Fingerprint,
  "check-circle": CheckCircle2,
  "trending-down": TrendingDown,
  bot: Bot,
  pencil: Pencil,
  shield: Shield,
  "file-text": FileText,
};

export function CategoryIcon({
  iconKey,
  className = "w-4 h-4 text-muted-foreground",
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICON_MAP[iconKey] ?? ClipboardList;
  return <Icon className={className} />;
}

export interface TestResult {
  promptId: string;
  prompt: string;
  category: string;
  categoryIcon: string;
  expectedResult: "fail" | "pass";
  actualResult: "blocked" | "allowed";
  isMatch: boolean;
  triggeredBy?: string;
  returnedText?: string;
  status: "pending" | "running" | "complete";
}

export interface QuickTestMessage {
  id: string;
  type: "user" | "system";
  text: string;
  result?: "blocked" | "allowed";
  triggeredBy?: string;
  returnedText?: string;
  timestamp: Date;
}

export type ResultFilter = "all" | "matches" | "mismatches" | "pending";

export const RESULT_FILTER_KEYS: Record<
  ResultFilter,
  "compliance.filterAll" | "compliance.filterMatches" | "compliance.filterMismatches" | "compliance.filterPending"
> = {
  all: "compliance.filterAll",
  matches: "compliance.filterMatches",
  mismatches: "compliance.filterMismatches",
  pending: "compliance.filterPending",
};

export type RightPanelTab = "quick-test" | "batch-results";

export interface GuardrailOption {
  id: string;
  name: string;
  type?: string;
}

export type { ComplianceCategory, ComplianceFramework, CompliancePrompt };

export const getFrameworksData = getFrameworks;
