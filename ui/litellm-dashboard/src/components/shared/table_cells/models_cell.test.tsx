import { screen, renderWithProviders } from "../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ModelsCell } from "./models_cell";

describe("ModelsCell", () => {
  it("shows 'All Proxy Models' when the list is empty, null, or undefined", () => {
    const { rerender } = renderWithProviders(<ModelsCell models={[]} />);
    expect(screen.getByText("所有代理模型")).toBeInTheDocument();
    rerender(<ModelsCell models={null} />);
    expect(screen.getByText("所有代理模型")).toBeInTheDocument();
    rerender(<ModelsCell models={undefined} />);
    expect(screen.getByText("所有代理模型")).toBeInTheDocument();
  });

  it("shows 'No model access' for scope-restricted keys with an empty model list", () => {
    const { rerender } = renderWithProviders(<ModelsCell models={[]} allowedRoutes={["/scim/*"]} />);
    expect(screen.getByText("无模型访问权限")).toBeInTheDocument();
    expect(screen.queryByText("所有代理模型")).not.toBeInTheDocument();
    rerender(<ModelsCell models={[]} allowedRoutes={["management_routes"]} />);
    expect(screen.getByText("无模型访问权限")).toBeInTheDocument();
    rerender(<ModelsCell models={[]} allowedRoutes={["info_routes"]} />);
    expect(screen.getByText("无模型访问权限")).toBeInTheDocument();
  });

  it("still shows 'All Proxy Models' for empty models when the key is not scope-restricted", () => {
    renderWithProviders(<ModelsCell models={[]} allowedRoutes={["llm_api_routes"]} />);
    expect(screen.getByText("所有代理模型")).toBeInTheDocument();
    expect(screen.queryByText("无模型访问权限")).not.toBeInTheDocument();
  });

  it("uses a persisted key_type to render 'No model access' regardless of allowed_routes", () => {
    const { rerender } = renderWithProviders(<ModelsCell models={[]} allowedRoutes={[]} keyType="management" />);
    expect(screen.getByText("无模型访问权限")).toBeInTheDocument();
    expect(screen.queryByText("所有代理模型")).not.toBeInTheDocument();
    rerender(<ModelsCell models={[]} allowedRoutes={[]} keyType="read_only" />);
    expect(screen.getByText("无模型访问权限")).toBeInTheDocument();
  });

  it("renders every model with no overflow badge when at or below the limit", () => {
    renderWithProviders(<ModelsCell models={["gpt-4o", "claude-sonnet-4-5", "o3-mini"]} maxVisible={3} />);
    expect(screen.getByText("gpt-4o")).toBeInTheDocument();
    expect(screen.getByText("claude-sonnet-4-5")).toBeInTheDocument();
    expect(screen.getByText("o3-mini")).toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("collapses models beyond the limit into a '+N more' badge", () => {
    renderWithProviders(<ModelsCell models={["a", "b", "c", "d", "e"]} maxVisible={2} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.queryByText("c")).not.toBeInTheDocument();
    expect(screen.getByText("+3 个")).toBeInTheDocument();
  });

  it("reveals the hidden models in a tooltip on hover", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModelsCell models={["a", "b", "c", "d"]} maxVisible={2} />);
    await user.hover(screen.getByText("+2 个"));
    expect(await screen.findByText("c")).toBeInTheDocument();
    expect(await screen.findByText("d")).toBeInTheDocument();
  });

  it("labels the all-proxy-models wildcard", () => {
    renderWithProviders(<ModelsCell models={["all-proxy-models"]} />);
    expect(screen.getByText("所有代理模型")).toBeInTheDocument();
  });
});
