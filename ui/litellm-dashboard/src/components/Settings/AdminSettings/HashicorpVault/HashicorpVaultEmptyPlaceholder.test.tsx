import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../../../tests/test-utils";
import HashicorpVaultEmptyPlaceholder from "./HashicorpVaultEmptyPlaceholder";

describe("HashicorpVaultEmptyPlaceholder", () => {
  it("should render the empty state message and configure button", () => {
    renderWithProviders(<HashicorpVaultEmptyPlaceholder onAdd={vi.fn()} />);
    expect(screen.getByText("尚未配置 Vault")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /配置 vault/i })).toBeInTheDocument();
  });

  it("should call onAdd when the configure button is clicked", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<HashicorpVaultEmptyPlaceholder onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: /配置 vault/i }));

    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("should display the description text about Vault purpose", () => {
    renderWithProviders(<HashicorpVaultEmptyPlaceholder onAdd={vi.fn()} />);
    expect(screen.getByText(/配置 Hashicorp Vault，为 LiteLLM 部署安全管理服务商 API 密钥与机密/)).toBeInTheDocument();
  });
});
