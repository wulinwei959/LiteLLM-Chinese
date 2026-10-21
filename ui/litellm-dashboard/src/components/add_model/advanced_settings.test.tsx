import { act, fireEvent, waitFor, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MountedFormHost } from "../../../tests/mounted-form-host";
import type { MountedFormValues } from "../common_components/MountedFormField";
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
      {includeDiscoveryValue && <KubernetesPodDiscoveryValue />}
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

  it("updates the Kubernetes pod discovery form value when enabled", async () => {
    renderAdvancedSettings(true);
    act(() => {
      fireEvent.click(screen.getByText("Advanced Settings"));
    });

    const toggle = await screen.findByRole("switch", { name: "Kubernetes pod discovery" });
    const formValue = screen.getByRole("status", { name: "Kubernetes pod discovery form value" });
    expect(toggle).not.toBeChecked();
    expect(formValue).toHaveTextContent("false");

    fireEvent.click(toggle);

    expect(toggle).toBeChecked();
    expect(formValue).toHaveTextContent("true");
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

  it("offers both cache write tiers once custom pricing is on", async () => {
    renderAdvancedSettings();
    act(() => {
      fireEvent.click(screen.getByText("Advanced Settings"));
    });
    fireEvent.click(await screen.findByRole("switch", { name: "Custom Pricing" }));

    expect(await screen.findByLabelText(/^Cache Write Cost \(per 1M tokens\)/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Cache Write Cost \(1 hour, per 1M tokens\)/)).toBeInTheDocument();
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
