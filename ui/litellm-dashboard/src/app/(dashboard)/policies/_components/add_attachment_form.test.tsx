import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/../tests/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as networking from "@/components/networking";
import AddAttachmentForm from "./add_attachment_form";
import { Policy } from "@/components/policies/types";

vi.mock("@/components/networking");

vi.mock("./impact_preview_alert", () => ({
  default: ({ impactResult }: { impactResult: any }) =>
    React.createElement("div", { "data-testid": "impact-preview" }, `${impactResult.affected_keys_count} keys`),
}));

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: () => ({ userId: "admin-user-id", userRole: "Admin", accessToken: "test-token" }),
}));

const makePolicy = (overrides: Partial<Policy> = {}): Policy => ({
  policy_id: "policy-id-1",
  policy_name: "test-policy",
  inherit: null,
  description: null,
  guardrails_add: [],
  guardrails_remove: [],
  condition: null,
  ...overrides,
});

const defaultProps = {
  visible: true,
  onClose: vi.fn(),
  onSuccess: vi.fn(),
  accessToken: "test-token",
  policies: [
    makePolicy({ policy_name: "policy-alpha" }),
    makePolicy({ policy_name: "policy-beta", policy_id: "id-2" }),
  ],
  createAttachment: vi.fn(),
};

const teamListResult = (aliases: string[]) =>
  aliases.map((team_alias) => ({ team_alias })) as unknown as Awaited<ReturnType<typeof networking.teamListCall>>;

describe("AddAttachmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(networking.teamListCall).mockResolvedValue([]);
    vi.mocked(networking.keyListCall).mockResolvedValue({ keys: [] });
    vi.mocked(networking.modelAvailableCall).mockResolvedValue({ data: [] });
  });

  it("should render the modal title when visible", async () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    expect(await screen.findByText("创建策略附件")).toBeInTheDocument();
  });

  it("should not render modal content when visible is false", () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} visible={false} />);
    expect(screen.queryByText("创建策略附件")).not.toBeInTheDocument();
  });

  it("should fetch teams, keys, and models on mount when visible and accessToken are provided", async () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await waitFor(() => {
      expect(networking.teamListCall).toHaveBeenCalled();
      expect(networking.keyListCall).toHaveBeenCalled();
      expect(networking.modelAvailableCall).toHaveBeenCalled();
    });
  });

  it("fetches all teams, not just teams the caller is a member of (LIT-4199)", async () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await waitFor(() => expect(networking.teamListCall).toHaveBeenCalled());
    expect(networking.teamListCall).toHaveBeenCalledWith("test-token", null, null);
  });

  it("should not fetch teams, keys, or models when accessToken is null", () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} accessToken={null} />);
    expect(networking.teamListCall).not.toHaveBeenCalled();
    expect(networking.keyListCall).not.toHaveBeenCalled();
    expect(networking.modelAvailableCall).not.toHaveBeenCalled();
  });

  it("should call onClose when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await user.click(await screen.findByRole("button", { name: /取消/ }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should not show scope-specific fields when scope is global (default)", async () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await screen.findByText("创建策略附件");
    expect(screen.queryByText("团队")).not.toBeInTheDocument();
    expect(screen.queryByText("密钥")).not.toBeInTheDocument();
    expect(screen.queryByText("模型")).not.toBeInTheDocument();
  });

  it("should show Teams, Keys, Models, and Tags fields when scope is switched to specific", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await screen.findByText("创建策略附件");
    await user.click(screen.getByRole("radio", { name: /特定/ }));
    expect(screen.getByText("团队")).toBeInTheDocument();
    expect(screen.getByText("密钥")).toBeInTheDocument();
    expect(screen.getByText("模型")).toBeInTheDocument();
    expect(screen.getByText("标签")).toBeInTheDocument();
  });

  it("should show the 'Estimate Impact' button only when scope is specific", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await screen.findByText("创建策略附件");
    expect(screen.queryByRole("button", { name: /预估影响/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /特定/ }));
    expect(screen.getByRole("button", { name: /预估影响/ })).toBeInTheDocument();
  });

  it("should render a 'Create Attachment' submit button", async () => {
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    expect(await screen.findByRole("button", { name: /创建附件/ })).toBeInTheDocument();
  });

  type UserEvent = ReturnType<typeof userEvent.setup>;

  const TEAMS_ERROR = /这些团队不存在/;

  const openSpecificScope = async (user: UserEvent) => {
    await screen.findByText("创建策略附件");
    await waitFor(() => expect(networking.teamListCall).toHaveBeenCalled());
    await user.click(screen.getByRole("radio", { name: /特定/ }));
  };

  const enterTeam = async (user: UserEvent, value: string) => {
    const input = screen.getByLabelText("团队");
    await user.click(input);
    await user.type(input, `${value}{Enter}`);
  };

  // Submits and waits for the validation cycle to settle. No policy is selected, so
  // the "select at least one policy" required error always appears - we use it as a
  // synchronization point, then assert whether the teams validator also complained.
  const submitAndSettle = async (user: UserEvent) => {
    await user.click(screen.getByRole("button", { name: /创建附件/ }));
    await screen.findByText(/请至少选择一个策略/);
  };

  it("blocks submit with a field error when a concrete team that does not exist is entered", async () => {
    const user = userEvent.setup();
    vi.mocked(networking.teamListCall).mockResolvedValue(teamListResult(["real-team"]));
    const createAttachment = vi.fn();
    renderWithProviders(<AddAttachmentForm {...defaultProps} createAttachment={createAttachment} />);
    await openSpecificScope(user);
    await enterTeam(user, "ghost-team");
    await submitAndSettle(user);
    expect(screen.getByText(TEAMS_ERROR)).toBeInTheDocument();
    expect(createAttachment).not.toHaveBeenCalled();
  });

  it("does not flag a team that exists", async () => {
    const user = userEvent.setup();
    vi.mocked(networking.teamListCall).mockResolvedValue(teamListResult(["real-team"]));
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await openSpecificScope(user);
    await enterTeam(user, "real-team");
    await submitAndSettle(user);
    expect(screen.queryByText(TEAMS_ERROR)).not.toBeInTheDocument();
  });

  it("does not flag a wildcard pattern even when it matches no existing team", async () => {
    const user = userEvent.setup();
    vi.mocked(networking.teamListCall).mockResolvedValue(teamListResult([]));
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await openSpecificScope(user);
    await enterTeam(user, "healthcare-*");
    await submitAndSettle(user);
    expect(screen.queryByText(TEAMS_ERROR)).not.toBeInTheDocument();
  });

  const selectPolicy = async (user: UserEvent, policyName: string) => {
    await screen.findByText("创建策略附件");
    const input = screen.getByLabelText("策略");
    await user.click(input);
    await user.type(input, `${policyName}{Enter}`);
  };

  const setPriority = (value: string) => {
    fireEvent.change(screen.getByLabelText("优先级"), { target: { value } });
  };

  const submit = async (user: UserEvent) => {
    await user.click(screen.getByRole("button", { name: /创建附件/ }));
  };

  it("sends the entered priority with the attachment", async () => {
    const user = userEvent.setup();
    const createAttachment = vi.fn().mockResolvedValue({});
    renderWithProviders(<AddAttachmentForm {...defaultProps} createAttachment={createAttachment} />);
    await selectPolicy(user, "policy-alpha");
    setPriority("10");
    await submit(user);
    await waitFor(() => expect(createAttachment).toHaveBeenCalledTimes(1));
    expect(createAttachment).toHaveBeenCalledWith("test-token", {
      policy_name: "policy-alpha",
      scope: "*",
      priority: 10,
    });
  });

  it("sends a negative priority typed one keystroke at a time", async () => {
    const user = userEvent.setup();
    const createAttachment = vi.fn().mockResolvedValue({});
    renderWithProviders(<AddAttachmentForm {...defaultProps} createAttachment={createAttachment} />);
    await selectPolicy(user, "policy-alpha");
    const priority = screen.getByLabelText("优先级");
    await user.type(priority, "-5");
    expect(priority).toHaveValue(-5);
    await submit(user);
    await waitFor(() => expect(createAttachment).toHaveBeenCalledTimes(1));
    expect(createAttachment).toHaveBeenCalledWith("test-token", {
      policy_name: "policy-alpha",
      scope: "*",
      priority: -5,
    });
  });

  it("omits priority from the attachment when the field is left blank", async () => {
    const user = userEvent.setup();
    const createAttachment = vi.fn().mockResolvedValue({});
    renderWithProviders(<AddAttachmentForm {...defaultProps} createAttachment={createAttachment} />);
    await selectPolicy(user, "policy-alpha");
    await submit(user);
    await waitFor(() => expect(createAttachment).toHaveBeenCalledTimes(1));
    expect(createAttachment).toHaveBeenCalledWith("test-token", { policy_name: "policy-alpha", scope: "*" });
  });

  it("sends default: true when the Default switch is turned on", async () => {
    const user = userEvent.setup();
    const createAttachment = vi.fn().mockResolvedValue({});
    renderWithProviders(<AddAttachmentForm {...defaultProps} createAttachment={createAttachment} />);
    await selectPolicy(user, "policy-alpha");
    await user.click(screen.getByRole("switch", { name: /默认/ }));
    await submit(user);
    await waitFor(() => expect(createAttachment).toHaveBeenCalledTimes(1));
    expect(createAttachment).toHaveBeenCalledWith("test-token", {
      policy_name: "policy-alpha",
      scope: "*",
      default: true,
    });
  });

  it.each([
    ["2147483648", /不得大于 2147483647/],
    ["-2147483649", /不得小于 -2147483648/],
    ["1.5", /必须是整数/],
  ])("blocks submit with a field error when priority is %s", async (value, error) => {
    const user = userEvent.setup();
    const createAttachment = vi.fn();
    renderWithProviders(<AddAttachmentForm {...defaultProps} createAttachment={createAttachment} />);
    await selectPolicy(user, "policy-alpha");
    setPriority(value);
    await submit(user);
    expect(await screen.findByText(error)).toBeInTheDocument();
    expect(createAttachment).not.toHaveBeenCalled();
  });

  it("defers to the backend (does not flag) when the team list failed to load", async () => {
    const user = userEvent.setup();
    vi.mocked(networking.teamListCall).mockRejectedValue(new Error("boom"));
    renderWithProviders(<AddAttachmentForm {...defaultProps} />);
    await openSpecificScope(user);
    await enterTeam(user, "ghost-team");
    await submitAndSettle(user);
    expect(screen.queryByText(TEAMS_ERROR)).not.toBeInTheDocument();
  });
});
