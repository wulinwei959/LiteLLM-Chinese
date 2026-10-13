import userEvent from "@testing-library/user-event";
import { chooseSelectOption, fireEvent, screen } from "./test-utils";

const groups: Record<string, string> = {
  "Classification Method": "Classifier tuning",
  "Heuristic Keyword Overrides": "Classifier tuning",
  "Ignore Custom Tags": "Classifier tuning",
  Affinity: "Sessions and efficiency",
  "Adaptive Routing": "Sessions and efficiency",
  Compression: "Sessions and efficiency",
  "Response Format": "Compatibility",
};

export const openAutoRouterAdvanced = (section: string) => {
  const advanced = screen.getByRole("button", { name: /^Advanced settings/ });
  if (advanced.getAttribute("aria-expanded") !== "true") fireEvent.click(advanced);
  const group = screen.getByRole("button", { name: groups[section] ?? "Routing rules and recovery" });
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
