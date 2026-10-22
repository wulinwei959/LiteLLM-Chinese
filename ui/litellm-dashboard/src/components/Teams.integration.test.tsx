import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, testQueryClient } from "../../tests/test-utils";
import Teams from "./Teams";

const sessionCookie = () => {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
  const claims = {
    key: "sk-session-test",
    user_id: "test-admin",
    user_role: "proxy_admin",
    premium_user: true,
    exp: Date.now() / 1000 + 3600,
  };
  document.cookie = `token=${encode({ alg: "none" })}.${encode(claims)}.test; Path=/`;
};

const responseFor = (url: string): object | object[] => {
  if (url.includes("/v2/team/list")) return { teams: [], total: 0, page: 1, page_size: 50, total_pages: 1 };
  if (url.includes("/models")) return { data: [{ id: "gpt-4" }] };
  if (url.includes("/v1/access_group")) return [];
  if (url.includes("/v1/mcp/access_groups")) return { access_groups: [] };
  if (url.includes("/guardrails/list")) return { guardrails: [] };
  if (url.includes("/policies/list")) return { policies: [] };
  if (url.includes("/organization/list")) return { organizations: [] };
  if (url.includes("/team/new")) return { team_id: "new-team-1" };
  if (url.includes("/default")) return { values: {} };
  if (url.includes("/litellm-ui-config")) return { server_root_path: "", proxy_base_url: "" };
  return {};
};

beforeEach(() => {
  testQueryClient.clear();
  sessionCookie();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => Response.json(responseFor(String(input)))),
  );
});

afterEach(() => {
  testQueryClient.clear();
  vi.unstubAllGlobals();
  document.cookie = "token=; Max-Age=0; Path=/";
});

describe("Teams creation integration", () => {
  it("sends a configured default member per-model budget", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Teams accessToken="sk-session-test" userID="test-admin" userRole="Admin" premiumUser />);

    await user.click(screen.getAllByRole("button", { name: /创建团队/ })[0]);
    await screen.findByLabelText(/团队名称/);
    await user.click(screen.getByText("附加设置"));
    await screen.findByText(/团队成员密钥有效期/);

    const addBudgetButtons = screen.getAllByRole("button", { name: /添加模型预算/ });
    await user.click(addBudgetButtons[1]);
    const modelSelectors = screen.getAllByPlaceholderText("选择模型");
    await user.click(modelSelectors.at(-1)!);
    await user.click(await screen.findByRole("option", { name: "gpt-4" }));
    fireEvent.change(screen.getAllByPlaceholderText("最大花费（$）")[0], { target: { value: "4" } });
    await user.click(screen.getByText("附加设置"));

    fireEvent.change(screen.getByLabelText(/团队名称/), { target: { value: "Budget Team" } });
    await user.click(screen.getAllByRole("button", { name: /创建团队/ }).at(-1)!);
    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalled();
    });

    const createRequest = vi.mocked(fetch).mock.calls.find(([input]) => String(input).includes("/team/new"));
    expect(createRequest).toBeDefined();
    const payload = JSON.parse(String(createRequest?.[1]?.body)) as Record<string, unknown>;
    expect(payload.team_member_model_max_budget).toStrictEqual({
      "gpt-4": { budget_limit: 4, time_period: "30d" },
    });
    expect(JSON.parse(JSON.stringify(payload)).team_member_model_max_budget).toStrictEqual({
      "gpt-4": { budget_limit: 4, time_period: "30d" },
    });
  });
});
