import userEvent from "@testing-library/user-event";
import { chooseSelectOption, fireEvent, screen } from "./test-utils";

const ADVANCED_SECTIONS: Record<string, string> = {
  "Classification Method": "分类器调优",
  "Heuristic Keyword Overrides": "分类器调优",
  "Ignore Custom Tags": "分类器调优",
  Affinity: "会话与效率",
  "Adaptive Routing": "会话与效率",
  Compression: "会话与效率",
  "Response Format": "兼容性",
};

const DEFAULT_ADVANCED_GROUP = "路由规则与恢复";

export const openAutoRouterAdvanced = (section: string) => {
  const advanced = screen.getByRole("button", { name: /^高级设置/ });
  if (advanced.getAttribute("aria-expanded") !== "true") fireEvent.click(advanced);
  const group = screen.getByRole("button", { name: ADVANCED_SECTIONS[section] ?? DEFAULT_ADVANCED_GROUP });
  if (group.getAttribute("aria-expanded") !== "true") fireEvent.click(group);
};

const MENU_FIELDS = new Set(["Heuristic", "Routing approach", "启发式", "路由方式"]);

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
  Capability: "能力",
  Complexity: "复杂度",
  "LLM Classifier": "LLM 分类器",
  "Heuristic first": "启发式优先",
  Hybrid: "混合",
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
