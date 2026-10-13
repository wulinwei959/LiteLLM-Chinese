import { act, fireEvent, waitFor, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MountedFormHost } from "../../../tests/mounted-form-host";
import AdvancedSettings from "./advanced_settings";

const mockUsePtuCostAttributionEnabled = vi.fn();

vi.mock("@/app/(dashboard)/hooks/uiSettings/usePtuCostAttributionEnabled", () => ({
  usePtuCostAttributionEnabled: () => mockUsePtuCostAttributionEnabled(),
}));

const PTU_LABELS = ["PTU 数量", "计算的 PTU 每小时成本 (USD)", "PTU 生效起始时间 (UTC)"];

const renderAdvancedSettings = () =>
  renderWithProviders(
    <MountedFormHost>
      <AdvancedSettings
        showAdvancedSettings={true}
        setShowAdvancedSettings={() => {}}
        guardrailsList={[]}
        tagsList={{}}
        accessToken="test-token"
      />
    </MountedFormHost>,
  );

describe("AdvancedSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePtuCostAttributionEnabled.mockReturnValue(false);
  });

  it("should render", () => {
    renderAdvancedSettings();
  });

  it("should render tags list", async () => {
    renderAdvancedSettings();
    fireEvent.click(screen.getByText("高级设置"));
    await waitFor(() => {
      expect(screen.getByText("标签")).toBeInTheDocument();
    });
  });

  it("should render the litellm params", async () => {
    renderAdvancedSettings();
    act(() => {
      fireEvent.click(screen.getByText("高级设置"));
    });
    await waitFor(() => {
      expect(screen.getByText("LiteLLM 参数")).toBeInTheDocument();
    });
  });

  it("hides every PTU field when PTU cost attribution is disabled", async () => {
    renderAdvancedSettings();
    act(() => {
      fireEvent.click(screen.getByText("高级设置"));
    });
    await waitFor(() => {
      expect(screen.getByText("标签")).toBeInTheDocument();
    });

    for (const label of PTU_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    }
    expect(screen.queryByText("PTU 生效结束时间 (UTC)")).not.toBeInTheDocument();
  });

  it("shows every PTU field when PTU cost attribution is enabled", async () => {
    mockUsePtuCostAttributionEnabled.mockReturnValue(true);
    renderAdvancedSettings();
    act(() => {
      fireEvent.click(screen.getByText("高级设置"));
    });

    await waitFor(() => {
      expect(screen.getByText("PTU 数量")).toBeInTheDocument();
    });
    for (const label of PTU_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText("PTU 生效结束时间 (UTC)")).toBeInTheDocument();
  });
});
