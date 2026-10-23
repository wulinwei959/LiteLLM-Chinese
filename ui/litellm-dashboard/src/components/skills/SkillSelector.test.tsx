import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "../../../tests/test-utils";
import { getClaudeCodePluginsList } from "../networking";
import SkillSelector from "./SkillSelector";

vi.mock("../networking", () => ({
  getClaudeCodePluginsList: vi.fn(),
}));

describe("SkillSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClaudeCodePluginsList).mockResolvedValue({
      plugins: [
        {
          id: "public-skill",
          name: "public-skill",
          source: { source: "github", repo: "acme/public-skill" },
          description: null,
          created_at: "2025-01-15T10:30:00Z",
          updated_at: "2025-01-16T10:30:00Z",
          version: "1.0.0",
          enabled: true,
        },
        {
          id: "private-skill",
          name: "private-skill",
          source: { source: "github", repo: "acme/private-skill" },
          description: null,
          created_at: "2025-01-15T10:30:00Z",
          updated_at: "2025-01-16T10:30:00Z",
          version: null,
          enabled: false,
        },
      ],
      count: 2,
    });
  });

  it("should list marketplace plugins and mark disabled ones as private", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SkillSelector accessToken="token" onChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByRole("option", { name: "public-skill" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "private-skill (私有)" })).toBeInTheDocument();
    expect(getClaudeCodePluginsList).toHaveBeenCalledWith("token");
  });

  it("should report the selected skill names", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<SkillSelector accessToken="token" onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "private-skill (私有)" }));

    expect(onChange).toHaveBeenCalledWith(["private-skill"]);
  });

  it("should clear all selected skills", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<SkillSelector accessToken="" value={["public-skill"]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "清空全部技能" }));

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
