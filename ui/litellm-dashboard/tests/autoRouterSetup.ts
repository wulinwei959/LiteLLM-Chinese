import userEvent from "@testing-library/user-event";
import { chooseSelectOption, fireEvent, screen } from "./test-utils";

const ADVANCED_SECTIONS: Record<string, readonly string[]> = {
  "Classification Method": ["启发式调优", "分类器调优", "LLM 调优"],
  "Heuristic Keyword Overrides": ["启发式调优"],
  "Ignore Custom Tags": ["请求预处理"],
  "Housekeeping Routing": ["路由规则与恢复"],
  "Modality Routing": ["路由规则与恢复"],
  "Plan-Mode Override": ["路由规则与恢复"],
  "Escalation Keywords": ["路由规则与恢复"],
  "Keyword/Semantic Matching": ["路由规则与恢复"],
  Affinity: ["会话与效率"],
  "Adaptive Routing": ["会话与效率"],
  Compression: ["会话与效率"],
  "Response Format": ["兼容性"],
  缓存感知路由: ["会话与效率", "缓存感知路由"],
};

const DEFAULT_ADVANCED_GROUP = ["路由规则与恢复"];

export const openAutoRouterAdvanced = (section: string) => {
  const advanced = screen.getByRole("button", { name: /^高级设置/ });
  if (advanced.getAttribute("aria-expanded") !== "true") fireEvent.click(advanced);
  const groups = ADVANCED_SECTIONS[section] ?? DEFAULT_ADVANCED_GROUP;
  const opened: string[] = [];
  for (const name of groups) {
    const group = screen.queryByRole("button", { name });
    if (group === null) continue;
    if (group.getAttribute("aria-expanded") !== "true") fireEvent.click(group);
    opened.push(name);
  }
  if (opened.length === 0) {
    throw new Error(`No advanced group button matched for section "${section}": tried ${groups.join(", ")}`);
  }
};

const MENU_FIELDS = new Set(["Heuristic", "Routing approach", "启发式", "路由方式", "Heuristic before the judge"]);

// Suites name these controls in English for readability; the dashboard renders them in the
// active locale (zh-CN in tests), so translate at the query boundary.
const RENDERED_LABELS: Record<string, string> = {
  Heuristic: "启发式",
  "Routing approach": "路由方式",
  "How often to classify": "分类频率",
  "Every request": "每个请求",
  "Every new user message": "每条新用户消息",
  "Once per session": "每个会话一次",
  "Rule-based": "基于规则",
  "Heuristic v2": "启发式 v2",
  "Heuristic v1": "启发式 v1（基于规则）",
  Capability: "能力",
  Complexity: "复杂度",
  "LLM Classifier": "LLM 分类器",
  "Heuristic first": "启发式优先",
  Hybrid: "混合",
  "Local checks before the judge": "评审前的本地检查",
  "Heuristic before the judge": "评审前的启发式",
  "Always use the judge": "始终使用评审模型",
  Medium: "中等",
};

const rendered = (label: string) => RENDERED_LABELS[label] ?? label;

export const selectAutoRouterOption = async (field: string, option: string) => {
  if (MENU_FIELDS.has(field)) {
    const user = userEvent.setup();
    fireEvent.click(screen.getByRole("button", { name: rendered(field) }));
    await user.click(await screen.findByRole("menuitemradio", { name: new RegExp(`^${rendered(option)}`) }));
    return;
  }
  await chooseSelectOption(
    userEvent.setup(),
    screen.getByRole("combobox", { name: rendered(field) }),
    new RegExp(`^${rendered(option)}`),
  );
};

export const selectAutoRouterApproach = async (option: string) => {
  await userEvent.click(screen.getByRole("radio", { name: "LLM" }));
  await selectAutoRouterOption("Routing approach", option);
};
