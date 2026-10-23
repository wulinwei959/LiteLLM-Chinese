import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import MoyaiConnected from "./MoyaiConnected";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("@/utils/uiHref", () => ({ uiHref: (seg: string) => `/ui/${seg}` }));

describe("MoyaiConnected", () => {
  it("shows workspace, key alias, and model count rows with an Open Moyai CTA", () => {
    renderWithProviders(
      <MoyaiConnected moyaiUrl="https://moyai.example.com" keyAlias="moyai-moyai.example.com" models={42} />,
    );

    expect(screen.getByText("已关联的工作区")).toBeInTheDocument();
    expect(screen.getByText("https://moyai.example.com")).toBeInTheDocument();
    expect(screen.getByText("已签发的虚拟密钥")).toBeInTheDocument();
    expect(screen.getByText("moyai-moyai.example.com")).toBeInTheDocument();
    expect(screen.getByText(/个模型可通过 LiteLLM 使用/)).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /打开 Moyai/ })).toHaveAttribute("href", "https://moyai.example.com");
    expect(screen.getByRole("link", { name: /返回 AI 网关/ })).toHaveAttribute("href", "/ui/");
  });

  it("hides the models row when the count is missing", () => {
    renderWithProviders(<MoyaiConnected moyaiUrl="https://moyai.example.com" keyAlias={null} models={null} />);

    expect(screen.queryByText(/个模型可通过 LiteLLM 使用/)).not.toBeInTheDocument();
    expect(screen.queryByText("已签发的虚拟密钥")).not.toBeInTheDocument();
  });
});
