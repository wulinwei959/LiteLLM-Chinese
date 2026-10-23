/* @vitest-environment jsdom */
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setCallbacksCall } from "@/components/networking";
import ModelGroupAliasSettings from "./model_group_alias_settings";
import { renderWithProviders } from "../../tests/test-utils";

vi.mock("@/components/networking", () => ({
  setCallbacksCall: vi.fn(),
}));

const aliases = {
  "fast-model": "claude-haiku",
  "smart-model": { model: "claude-sonnet", hidden: true },
};

describe("ModelGroupAliasSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(setCallbacksCall).mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("locks config-owned aliases while keeping their names and targets visible", async () => {
    renderWithProviders(
      <ModelGroupAliasSettings accessToken="test-token" initialModelGroupAlias={aliases} managedByConfig />,
    );

    expect(screen.getByText("这些别名在 config.yaml 中定义，此处只读。请修改配置文件来变更它们。")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例如 gpt-4o")).toBeDisabled();
    expect(screen.getByPlaceholderText("例如 gpt-4o-mini-openai")).toBeDisabled();
    expect(screen.getByRole("button", { name: "添加别名" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "编辑别名 fast-model" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "编辑别名 smart-model" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "删除别名 smart-model" })).toBeDisabled();

    expect(await screen.findByText("fast-model")).toBeInTheDocument();
    expect(screen.getByText("claude-haiku")).toBeInTheDocument();
    expect(screen.getByText("smart-model")).toBeInTheDocument();
    expect(screen.getByText("claude-sonnet")).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "删除别名 fast-model" }));
    expect(setCallbacksCall).not.toHaveBeenCalled();
  });

  it("keeps aliases editable by default and saves the current string representation after delete", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModelGroupAliasSettings accessToken="test-token" initialModelGroupAlias={aliases} />);

    expect(await screen.findByText("fast-model")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "编辑别名 fast-model" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "删除别名 fast-model" }));

    expect(setCallbacksCall).toHaveBeenCalledWith("test-token", {
      router_settings: { model_group_alias: { "smart-model": "claude-sonnet" } },
    });
  });
});
