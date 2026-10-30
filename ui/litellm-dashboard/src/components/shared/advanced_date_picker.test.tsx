import { act, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import AdvancedDatePicker from "./advanced_date_picker";

const rangeName = (from: Date, to: Date): string => {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  return `${fmt(from)} - ${fmt(to)}`;
};

// Polyfill requestIdleCallback for test environment
beforeAll(() => {
  if (typeof window !== "undefined" && !window.requestIdleCallback) {
    window.requestIdleCallback = (callback: any) => {
      const start = Date.now();
      return setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        });
      }, 1) as any;
    };
  }
});

describe("AdvancedDatePicker", () => {
  const mockOnValueChange = vi.fn();
  const defaultValue = {
    from: new Date("2025-01-01T12:00:00.000Z"),
    to: new Date("2025-01-31T12:00:00.000Z"),
  };

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  const getTrigger = (container: HTMLElement) => container.querySelector('[data-slot="advanced-date-picker-trigger"]');

  const openDropdown = (container: HTMLElement) => {
    const trigger = getTrigger(container);
    if (trigger) {
      fireEvent.click(trigger);
    }
  };

  it.each([
    ["MTD", "月初至今"],
    ["YTD", "年初至今"],
  ])("keeps %s selected when calendar ranges coincide", (preset, label) => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2027, 0, 1, 12));
    try {
      render(
        <AdvancedDatePicker
          value={{ from: new Date(2027, 0, 1), to: new Date(2027, 0, 1, 23, 59, 59, 999) }}
          onValueChange={mockOnValueChange}
          presetShortLabel={preset}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: rangeName(new Date(2027, 0, 1), new Date(2027, 0, 1, 23, 59, 59, 999)) }));
      expect(screen.getByRole("button", { name: new RegExp(label) })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: /今天/ })).toHaveAttribute("aria-pressed", "false");
      fireEvent.click(screen.getByRole("button", { name: /今天/ }));
      fireEvent.click(screen.getByRole("button", { name: "取消" }));
      fireEvent.click(screen.getByRole("button", { name: rangeName(new Date(2027, 0, 1), new Date(2027, 0, 1, 23, 59, 59, 999)) }));
      expect(screen.getByRole("button", { name: new RegExp(label) })).toHaveAttribute("aria-pressed", "true");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should render with default label", () => {
    render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);
    expect(screen.getByText("选择时间范围")).toBeInTheDocument();
  });

  it("should render with custom label", () => {
    render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} label="Custom Label" />);
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("should display formatted date range", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);
    expect(getTrigger(container)).toHaveTextContent(rangeName(defaultValue.from, defaultValue.to));
  });

  it("should open dropdown when clicked", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    // Check for relative time options
    expect(screen.getByText("今天")).toBeInTheDocument();
    expect(screen.getByText("最近 7 天")).toBeInTheDocument();
    expect(screen.getByText("最近 30 天")).toBeInTheDocument();
  });

  it("should display relative time options", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    expect(screen.getByText("今天")).toBeInTheDocument();
    expect(screen.getByText("最近 7 天")).toBeInTheDocument();
    expect(screen.getByText("最近 30 天")).toBeInTheDocument();
    expect(screen.getByText("月初至今")).toBeInTheDocument();
    expect(screen.getByText("年初至今")).toBeInTheDocument();
  });

  it("anchors the panel to the trigger edge named by align", () => {
    const { container, unmount } = render(
      <AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} align="left" />,
    );
    openDropdown(container);
    const leftPanel = container.querySelector('[data-slot="advanced-date-picker-panel"]');
    expect(leftPanel).toHaveAttribute("data-align", "left");
    unmount();

    const { container: defaultContainer } = render(
      <AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />,
    );
    openDropdown(defaultContainer);
    const rightPanel = defaultContainer.querySelector('[data-slot="advanced-date-picker-panel"]');
    expect(rightPanel).toHaveAttribute("data-align", "right");
  });

  it("opens the dropdown from the keyboard alone", async () => {
    const user = userEvent.setup();
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    await user.tab();

    const trigger = getTrigger(container);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{Enter}");

    expect(screen.getByText("相对时间")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("should show date inputs in dropdown", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const startDateInput = screen.getByDisplayValue("2025-01-01");
    const endDateInput = screen.getByDisplayValue("2025-01-31");

    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it("should update date inputs when changed", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const startDateInput = screen.getByDisplayValue("2025-01-01") as HTMLInputElement;
    fireEvent.change(startDateInput, { target: { value: "2025-02-01" } });

    expect(startDateInput.value).toBe("2025-02-01");
  });

  it("should show Apply and Cancel buttons", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    expect(screen.getByText("应用")).toBeInTheDocument();
    expect(screen.getByText("取消")).toBeInTheDocument();
  });

  it("should close dropdown when Cancel is clicked", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const cancelButton = screen.getByText("取消");
    fireEvent.click(cancelButton);

    // Dropdown should be closed, so relative time options shouldn't be visible
    expect(screen.queryByText("今天")).not.toBeInTheDocument();
  });

  it("should call onValueChange when Apply is clicked", async () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const applyButton = screen.getByText("应用");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenCalled();
    });
  });

  it("passes the clicked preset label when applying", async () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);
    fireEvent.click(screen.getByText("今天"));
    fireEvent.click(screen.getByRole("button", { name: "应用" }));

    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expect.anything(), "today");
    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expect.anything(), "today");
    });
  });

  it("passes a null preset label when typed dates match today", async () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);
    const today = moment().format("YYYY-MM-DD");

    openDropdown(container);
    fireEvent.change(screen.getByDisplayValue("2025-01-01"), { target: { value: today } });
    fireEvent.change(screen.getByDisplayValue("2025-01-31"), { target: { value: today } });
    fireEvent.click(screen.getByRole("button", { name: "应用" }));

    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expect.anything(), null);
    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expect.anything(), null);
    });
  });

  it("resets the preset label when the parent switches to a custom range", async () => {
    const { container, rerender } = render(
      <AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />,
    );

    openDropdown(container);
    fireEvent.click(screen.getByText("今天"));
    fireEvent.click(screen.getByRole("button", { name: "应用" }));

    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expect.anything(), "today");
    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expect.anything(), "today");
    });

    mockOnValueChange.mockClear();
    const customValue = {
      from: new Date("2025-02-01T00:00:00.000Z"),
      to: new Date("2025-02-10T23:59:59.999Z"),
    };
    rerender(<AdvancedDatePicker value={customValue} onValueChange={mockOnValueChange} presetShortLabel={null} />);

    openDropdown(container);
    fireEvent.click(screen.getByRole("button", { name: "应用" }));

    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expect.anything(), null);
    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expect.anything(), null);
    });
  });

  it("preserves the parent preset label when applying an unchanged range", async () => {
    const value = {
      from: moment().subtract(30, "days").startOf("day").toDate(),
      to: moment().endOf("day").toDate(),
    };
    const { container } = render(
      <AdvancedDatePicker value={value} onValueChange={mockOnValueChange} presetShortLabel="30d" />,
    );

    openDropdown(container);
    fireEvent.click(screen.getByRole("button", { name: "应用" }));

    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expect.anything(), "30d");
    await waitFor(() => {
      expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expect.anything(), "30d");
    });
  });

  it("should select relative time option", () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const todayOption = screen.getByText("今天");
    fireEvent.click(todayOption);

    // The option should be highlighted (bg-info/10)
    expect(todayOption.closest("button")).toHaveClass("bg-info/10");
  });

  it("selects a relative range from the keyboard alone", async () => {
    const user = userEvent.setup();
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    await user.tab();
    await user.keyboard("{Enter}");

    const presets = Array.from(container.querySelectorAll('[data-slot="advanced-date-picker-preset"]'));
    expect(presets).toHaveLength(5);

    await user.tab();
    expect(presets[0]).toHaveFocus();
    expect(presets[0]).toHaveAttribute("aria-pressed", "false");

    await user.tab();
    expect(presets[1]).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(presets[1]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("最近 7 天").closest("button")).toHaveClass("bg-info/10");
  });

  it("should show validation error for invalid date range", async () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const startDateInput = screen.getByDisplayValue("2025-01-01");
    const endDateInput = screen.getByDisplayValue("2025-01-31");

    // Set end date before start date
    fireEvent.change(startDateInput, { target: { value: "2025-12-01" } });
    fireEvent.change(endDateInput, { target: { value: "2025-01-01" } });

    await waitFor(() => {
      expect(screen.getByText("结束日期不能早于开始日期")).toBeInTheDocument();
    });
  });

  it("should disable Apply button when validation fails", async () => {
    const { container } = render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} />);

    openDropdown(container);

    const startDateInput = screen.getByDisplayValue("2025-01-01");
    const endDateInput = screen.getByDisplayValue("2025-01-31");

    // Set end date before start date
    fireEvent.change(startDateInput, { target: { value: "2025-12-01" } });
    fireEvent.change(endDateInput, { target: { value: "2025-01-01" } });

    await waitFor(() => {
      // Find the button element (the Apply button's actual button element)
      const applyButton = screen.getByText("应用").closest("button");
      expect(applyButton).toBeDisabled();
    });
  });

  it("should label compact custom date inputs, validate their order and apply the corrected range", async () => {
    const user = userEvent.setup();
    render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} compact />);

    await user.click(screen.getByRole("button", { expanded: false }));
    const start = screen.getByLabelText("开始日期");
    const end = screen.getByLabelText("结束日期");
    expect(start).toHaveValue("2025-01-01");
    expect(end).toHaveValue("2025-01-31");

    act(() => fireEvent.change(start, { target: { value: "2025-02-01" } }));
    expect(screen.getByText("结束日期不能早于开始日期")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "应用" })).toBeDisabled();
    expect(mockOnValueChange).not.toHaveBeenCalled();

    act(() => fireEvent.change(end, { target: { value: "2025-02-05" } }));
    expect(screen.queryByText("结束日期不能早于开始日期")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "应用" })).toBeEnabled();
    expect(mockOnValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "应用" }));
    const expectedRange = {
      from: new Date(2025, 1, 1),
      to: new Date(2025, 1, 5, 23, 59, 59, 999),
    };
    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expectedRange, null);
    await waitFor(() => expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expectedRange, null));
    expect(screen.queryByLabelText("开始日期")).not.toBeInTheDocument();
  });

  it("should keep compact preset selection pending until Apply is clicked", async () => {
    const user = userEvent.setup();
    render(<AdvancedDatePicker value={defaultValue} onValueChange={mockOnValueChange} compact />);

    await user.click(screen.getByRole("button", { expanded: false }));
    await user.click(screen.getByRole("button", { name: /最近 7 天/ }));
    expect(screen.getByRole("button", { name: /最近 7 天/ })).toHaveAttribute("aria-pressed", "true");
    expect(mockOnValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "应用" }));
    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, expect.anything(), "7d");
    await waitFor(() => expect(mockOnValueChange).toHaveBeenNthCalledWith(2, expect.anything(), "7d"));
  });
});
