import React from "react";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AgentKillSwitchDangerZone from "./AgentKillSwitchDangerZone";
import * as networking from "@/components/networking";
import { toast } from "@/lib/toast";

vi.mock("@/components/networking", () => ({
  triggerAgentKillSwitchCall: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const killSwitch = { url: "https://ops.example.com/kill", method: "DELETE" as const };

const renderZone = (props: Partial<React.ComponentProps<typeof AgentKillSwitchDangerZone>> = {}) =>
  render(
    <AgentKillSwitchDangerZone
      agentId="agent-1"
      agentName="support-agent"
      killSwitch={killSwitch}
      accessToken="sk-test"
      isAdmin={true}
      {...props}
    />,
  );

const openDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: "触发紧急停止开关" }));
  return screen.getByRole("dialog");
};

const dialogFireButton = () => within(screen.getByRole("dialog")).getByRole("button", { name: "触发紧急停止开关" });

describe("AgentKillSwitchDangerZone", () => {
  beforeEach(() => {
    vi.mocked(networking.triggerAgentKillSwitchCall).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
  });

  it("renders nothing for non-admins", () => {
    const { container } = renderZone({ isAdmin: false });

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the webhook target and an outage warning inside a Danger Zone region", () => {
    renderZone();

    const region = screen.getByRole("region", { name: "危险区域" });
    expect(region).toHaveTextContent("DELETE https://ops.example.com/kill");
    expect(region).toHaveTextContent("停止该智能体的上游运行时");
    expect(screen.getByRole("button", { name: "触发紧急停止开关" })).toBeEnabled();
  });

  it("shows an unconfigured notice without a fire button when no kill switch is set", () => {
    renderZone({ killSwitch: null });

    expect(screen.getByRole("region", { name: "危险区域" })).toHaveTextContent("尚未配置");
    expect(screen.queryByRole("button", { name: "触发紧急停止开关" })).not.toBeInTheDocument();
  });

  it("keeps the confirm button disabled until the exact agent name is typed", () => {
    renderZone();
    openDialog();

    expect(dialogFireButton()).toBeDisabled();

    fireEvent.change(screen.getByLabelText("确认智能体名称"), { target: { value: "support-agen" } });
    expect(dialogFireButton()).toBeDisabled();

    fireEvent.change(screen.getByLabelText("确认智能体名称"), { target: { value: "support-agent" } });
    expect(dialogFireButton()).toBeEnabled();
    expect(networking.triggerAgentKillSwitchCall).not.toHaveBeenCalled();
  });

  it("fires the webhook after typed confirmation, closes the dialog and shows the sanitized result", async () => {
    const firedResult = {
      agent_id: "agent-1",
      url: killSwitch.url,
      method: "DELETE" as const,
      status_code: 202,
      response_body: '{"stopped": true}',
    };
    vi.mocked(networking.triggerAgentKillSwitchCall).mockResolvedValue(firedResult);
    renderZone();
    openDialog();

    fireEvent.change(screen.getByLabelText("确认智能体名称"), { target: { value: "support-agent" } });
    fireEvent.click(dialogFireButton());

    expect(await screen.findByRole("status")).toHaveTextContent('上次结果：HTTP 202 {"stopped": true}');
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(networking.triggerAgentKillSwitchCall).toHaveBeenCalledWith("sk-test", "agent-1");
    expect(toast.success).toHaveBeenCalledWith("紧急停止开关已触发（HTTP 202）");
  });

  it("does not call the webhook when the dialog is cancelled", () => {
    renderZone();
    openDialog();

    fireEvent.change(screen.getByLabelText("确认智能体名称"), { target: { value: "support-agent" } });
    fireEvent.click(screen.getByRole("button", { name: "取消" }));

    expect(networking.triggerAgentKillSwitchCall).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("surfaces a failed webhook as an error toast and keeps the dialog open", async () => {
    vi.mocked(networking.triggerAgentKillSwitchCall).mockRejectedValue(new Error("Kill switch webhook returned 500"));
    renderZone();
    openDialog();

    fireEvent.change(screen.getByLabelText("确认智能体名称"), { target: { value: "support-agent" } });
    fireEvent.click(dialogFireButton());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Kill switch webhook returned 500"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
