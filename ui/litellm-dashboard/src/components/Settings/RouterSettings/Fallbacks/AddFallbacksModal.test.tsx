import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddFallbacksModal } from "./AddFallbacksModal";

describe("AddFallbacksModal", () => {
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the modal when open is true", () => {
    renderWithProviders(
      <AddFallbacksModal open={true} onCancel={mockOnCancel}>
        <div>Test Content</div>
      </AddFallbacksModal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("配置模型回退")).toBeInTheDocument();
    expect(screen.getByText(/为不同模型管理多条回退链/)).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should not render the modal when open is false", () => {
    renderWithProviders(
      <AddFallbacksModal open={false} onCancel={mockOnCancel}>
        <div>Test Content</div>
      </AddFallbacksModal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render children content when modal is open", () => {
    renderWithProviders(
      <AddFallbacksModal open={true} onCancel={mockOnCancel}>
        <div data-testid="child-content">Child Component</div>
      </AddFallbacksModal>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should display the correct title and description", () => {
    renderWithProviders(
      <AddFallbacksModal open={true} onCancel={mockOnCancel}>
        <div>Content</div>
      </AddFallbacksModal>,
    );

    expect(screen.getByText("配置模型回退")).toBeInTheDocument();
    expect(screen.getByText(/为不同模型管理多条回退链/)).toBeInTheDocument();
  });
});
