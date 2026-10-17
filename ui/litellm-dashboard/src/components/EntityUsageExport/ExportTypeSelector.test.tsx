import { renderWithProviders, screen } from "../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ExportTypeSelector from "./ExportTypeSelector";

describe("ExportTypeSelector", () => {
  it("should render", () => {
    renderWithProviders(<ExportTypeSelector value="daily" onChange={vi.fn()} entityType="team" />);
    expect(screen.getByText("导出类型")).toBeInTheDocument();
  });

  it("should display entity type in radio labels", () => {
    renderWithProviders(<ExportTypeSelector value="daily" onChange={vi.fn()} entityType="team" />);
    expect(screen.getByText(/按团队逐日拆分$/)).toBeInTheDocument();
    expect(screen.getByText(/按团队与 Key 逐日拆分/)).toBeInTheDocument();
    expect(screen.getByText(/按团队与模型逐日统计/)).toBeInTheDocument();
  });

  it("should display the correct entity type for different entities", () => {
    renderWithProviders(<ExportTypeSelector value="daily" onChange={vi.fn()} entityType="organization" />);
    expect(screen.getByText(/按组织逐日拆分$/)).toBeInTheDocument();
  });

  it("should call onChange when a radio option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<ExportTypeSelector value="daily" onChange={onChange} entityType="team" />);
    await user.click(screen.getByRole("radio", { name: /按团队与 Key 逐日拆分/i }));
    expect(onChange).toHaveBeenCalledWith("daily_with_keys");
  });

  it("should have the correct radio checked", () => {
    renderWithProviders(<ExportTypeSelector value="daily_with_models" onChange={vi.fn()} entityType="team" />);
    expect(screen.getByRole("radio", { name: /按团队与模型逐日统计/i })).toBeChecked();
  });

  it("should offer the per-user scope for teams and call onChange with daily_with_users", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<ExportTypeSelector value="daily" onChange={onChange} entityType="team" />);

    const option = screen.getByRole("radio", { name: /按团队与用户逐日拆分/i });
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith("daily_with_users");
    expect(screen.getByText("每个团队的每日指标，按 Key 归属者拆分")).toBeInTheDocument();
  });

  it("should hide the per-user scope for user exports while keeping the other scopes", () => {
    renderWithProviders(<ExportTypeSelector value="daily" onChange={vi.fn()} entityType="user" />);

    expect(screen.queryByRole("radio", { name: /and user/i })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /按用户逐日拆分 每个用户的每日指标$/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /按用户与 Key 逐日拆分/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /按用户与模型逐日统计/i })).toBeInTheDocument();
  });

  it("should offer the per-user scope for tags", () => {
    renderWithProviders(<ExportTypeSelector value="daily" onChange={vi.fn()} entityType="tag" />);

    expect(screen.getByRole("radio", { name: /按标签与用户逐日拆分/i })).toBeInTheDocument();
  });
});
